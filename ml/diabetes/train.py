import time
import os
import json
import joblib
import numpy as np
import pandas as pd
import shap
from sklearn.base import clone
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from xgboost import XGBClassifier

import sys
sys.path.append(r"e:\diagnotech")
from ml.common.metrics import compute_all_metrics, compute_curve_points
from ml.common.preprocessing import CDCPreprocessor

log_file = r"e:\diagnotech\train_progress.log"
def log(msg):
    print(msg, flush=True)
    with open(log_file, "a") as f:
        f.write(f"[{time.strftime('%H:%M:%S')}] {msg}\n")

with open(log_file, "w") as f:
    f.write("=== Starting Pipeline ===\n")

log("Loading diabetes dataset...")
t0 = time.time()
df = pd.read_csv(r"e:\diagnotech\datasets\diabetes\cdc_diabetes.csv")
log(f"Dataset loaded: {df.shape} in {time.time()-t0:.2f}s")

# Sample 45000 rows for high statistical validity and rapid execution
df = df.sample(n=45000, replace=True, random_state=42).reset_index(drop=True)
target_col = "Diabetes_binary"
feature_cols = [c for c in df.columns if c != target_col]

X = df[feature_cols]
y = df[target_col]

X_train_df, X_test_df, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
log(f"Split done: {len(X_train_df)} train, {len(X_test_df)} test")

preprocessor = CDCPreprocessor(feature_names=feature_cols)
X_train = preprocessor.fit_transform(X_train_df)
X_test = preprocessor.transform(X_test_df)
log("Preprocessing completed")

candidates = {
    "Logistic Regression": LogisticRegression(max_iter=300, random_state=42, class_weight="balanced"),
    "Decision Tree": DecisionTreeClassifier(max_depth=6, random_state=42, class_weight="balanced"),
    "Random Forest": RandomForestClassifier(n_estimators=60, max_depth=8, random_state=42, class_weight="balanced", n_jobs=1),
    "XGBoost": XGBClassifier(n_estimators=60, max_depth=4, learning_rate=0.08, eval_metric="logloss", random_state=42, n_jobs=1)
}

comparison_results = []
trained_models = {}
cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

for name, model in candidates.items():
    t_start = time.time()
    log(f"Evaluating {name}...")
    cv_aucs = []
    cv_recalls = []
    for train_idx, val_idx in cv.split(X_train, y_train):
        m_clone = clone(model)
        m_clone.fit(X_train[train_idx], y_train.iloc[train_idx])
        val_preds = m_clone.predict(X_train[val_idx])
        val_probs = m_clone.predict_proba(X_train[val_idx])[:, 1]
        m_metrics = compute_all_metrics(y_train.iloc[val_idx], val_preds, val_probs)
        cv_aucs.append(m_metrics["roc_auc"])
        cv_recalls.append(m_metrics["recall"])
        
    model.fit(X_train, y_train)
    trained_models[name] = model
    
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    test_metrics = compute_all_metrics(y_test, y_pred, y_prob)
    
    comparison_results.append({
        "name": name,
        "cv_roc_auc_mean": round(float(np.mean(cv_aucs)), 4),
        "cv_roc_auc_std": round(float(np.std(cv_aucs)), 4),
        "cv_recall_mean": round(float(np.mean(cv_recalls)), 4),
        "accuracy": test_metrics["accuracy"],
        "precision": test_metrics["precision"],
        "recall": test_metrics["recall"],
        "specificity": test_metrics["specificity"],
        "f1": test_metrics["f1"],
        "roc_auc": test_metrics["roc_auc"]
    })
    log(f"  -> {name} completed in {time.time()-t_start:.2f}s | ROC-AUC: {test_metrics['roc_auc']}, Recall: {test_metrics['recall']}")

# Production model: Random Forest
prod_name = "Random Forest"
prod_model = trained_models[prod_name]
y_test_pred = prod_model.predict(X_test)
y_test_prob = prod_model.predict_proba(X_test)[:, 1]
prod_metrics = compute_all_metrics(y_test, y_test_pred, y_test_prob)
curve_points = compute_curve_points(y_test, y_test_prob)

log("Computing SHAP TreeExplainer...")
t_shap = time.time()
explainer = shap.TreeExplainer(prod_model)
bg_sample = X_test[:80]
shap_vals = explainer.shap_values(bg_sample)
if isinstance(shap_vals, list):
    shap_vals = shap_vals[1]
elif len(shap_vals.shape) == 3:
    shap_vals = shap_vals[:, :, 1]
log(f"SHAP computed in {time.time()-t_shap:.2f}s")

mean_abs_shap = np.mean(np.abs(shap_vals), axis=0)
global_importance = [
    {"feature": col, "importance": round(float(imp), 4)}
    for col, imp in zip(feature_cols, mean_abs_shap)
]
global_importance.sort(key=lambda x: x["importance"], reverse=True)

shap_summary_points = []
top_feats = [item["feature"] for item in global_importance[:8]]
for f in top_feats:
    idx = feature_cols.index(f)
    vals = bg_sample[:, idx]
    s_vals = shap_vals[:, idx]
    val_min, val_max = vals.min(), vals.max()
    norm_vals = (vals - val_min) / (val_max - val_min + 1e-6)
    for i in range(len(vals)):
        shap_summary_points.append({
            "feature": f,
            "shap_value": round(float(s_vals[i]), 4),
            "feature_value_normalized": round(float(norm_vals[i]), 3),
            "raw_value": round(float(vals[i]), 1)
        })

# Export
out_dir = r"e:\diagnotech\backend\models"
os.makedirs(out_dir, exist_ok=True)

joblib.dump(prod_model, os.path.join(out_dir, "diabetes_rf_v1.joblib"))
joblib.dump(preprocessor, os.path.join(out_dir, "diabetes_preprocessor.joblib"))
joblib.dump(explainer, os.path.join(out_dir, "diabetes_explainer.joblib"))

metadata = {
    "disease": "diabetes",
    "model_name": "Random Forest Classifier (Balanced)",
    "version": "diabetes_rf_v1.0",
    "algorithm": "RandomForestClassifier",
    "dataset": "CDC BRFSS Diabetes Health Indicators",
    "total_dataset_samples": 253680,
    "training_samples": len(X_train),
    "test_samples": len(X_test),
    "feature_count": len(feature_cols),
    "status": "production",
    "features": feature_cols,
    "metrics": prod_metrics
}
with open(os.path.join(out_dir, "diabetes_metadata.json"), "w") as f:
    json.dump(metadata, f, indent=2)
with open(os.path.join(out_dir, "diabetes_metrics.json"), "w") as f:
    json.dump(prod_metrics, f, indent=2)
with open(os.path.join(out_dir, "diabetes_comparison.json"), "w") as f:
    json.dump({"disease": "diabetes", "models": comparison_results}, f, indent=2)
with open(os.path.join(out_dir, "diabetes_curves.json"), "w") as f:
    json.dump({
        "curves": curve_points,
        "global_importance": global_importance,
        "shap_summary_points": shap_summary_points
    }, f, indent=2)
schema = {
    "disease": "diabetes",
    "features": [{"name": col, "type": "float", "description": col} for col in feature_cols]
}
with open(os.path.join(out_dir, "diabetes_feature_schema.json"), "w") as f:
    json.dump(schema, f, indent=2)

log(f"=== ALL DONE in {time.time()-t0:.2f}s ===")
