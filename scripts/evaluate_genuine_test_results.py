import os
import sys
import json
import time
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from xgboost import XGBClassifier
from sklearn.metrics import roc_curve, precision_recall_curve, roc_auc_score

BASE_DIR = r"e:\diagnotech"
sys.path.insert(0, BASE_DIR)
from ml.common.metrics import compute_all_metrics
from ml.common.preprocessing import CDCPreprocessor

OUT_DIR = os.path.join(BASE_DIR, "backend", "models")
os.makedirs(OUT_DIR, exist_ok=True)

def evaluate_disease(disease_key, csv_path, target_col, prod_model_name):
    print(f"\n==================================================", flush=True)
    print(f"  Evaluating Genuine Test Results: {disease_key.upper()}", flush=True)
    print(f"==================================================", flush=True)
    
    t0 = time.time()
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} records from {csv_path}", flush=True)
    
    feature_cols = [c for c in df.columns if c != target_col]
    X = df[feature_cols]
    y = df[target_col]
    
    # 80/20 Stratified train/test split with seed 42
    X_train_df, X_test_df, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Stratified Split: {len(X_train_df)} Training Samples, {len(X_test_df)} Unseen Test Samples", flush=True)
    
    # Preprocess with CDC standard scaling
    preprocessor = CDCPreprocessor(feature_names=feature_cols)
    X_train = preprocessor.fit_transform(X_train_df)
    X_test = preprocessor.transform(X_test_df)
    
    # Suite of 5 standard candidate clinical algorithms
    candidates = {
        "Logistic Regression": LogisticRegression(max_iter=300, random_state=42, class_weight="balanced"),
        "Decision Tree": DecisionTreeClassifier(max_depth=6, random_state=42, class_weight="balanced"),
        "Random Forest": RandomForestClassifier(n_estimators=80, max_depth=8, random_state=42, class_weight="balanced", n_jobs=1),
        "Support Vector Machine": CalibratedClassifierCV(LinearSVC(max_iter=1000, random_state=42, class_weight="balanced")),
        "XGBoost": XGBClassifier(n_estimators=80, max_depth=4, learning_rate=0.08, eval_metric="logloss", random_state=42, n_jobs=1)
    }
    
    comparison_results = []
    trained_models = {}
    
    for name, model in candidates.items():
        t_model = time.time()
        print(f"Training and testing {name} on unseen holdout test cohort...", flush=True)
        model.fit(X_train, y_train)
        trained_models[name] = model
        
        y_pred = model.predict(X_test)
        if hasattr(model, "predict_proba"):
            y_prob = model.predict_proba(X_test)[:, 1]
        elif hasattr(model, "decision_function"):
            df_vals = model.decision_function(X_test)
            y_prob = 1.0 / (1.0 + np.exp(-df_vals))
        else:
            y_prob = y_pred.astype(float)
            
        metrics = compute_all_metrics(y_test, y_pred, y_prob)
        metrics["name"] = name
        comparison_results.append(metrics)
        print(f"  -> {name}: Acc={metrics['accuracy']:.4f}, Prec={metrics['precision']:.4f}, Recall={metrics['recall']:.4f}, Spec={metrics['specificity']:.4f}, F1={metrics['f1']:.4f}, ROC-AUC={metrics['roc_auc']:.4f} in {time.time()-t_model:.2f}s", flush=True)
    
    # Identify Production Model metrics
    prod_model = trained_models[prod_model_name]
    y_test_pred = prod_model.predict(X_test)
    y_test_prob = prod_model.predict_proba(X_test)[:, 1]
    prod_metrics = compute_all_metrics(y_test, y_test_pred, y_test_prob)
    
    # Calculate ROC and Precision-Recall curve coordinates
    fpr, tpr, _ = roc_curve(y_test, y_test_prob)
    prec, rec, _ = precision_recall_curve(y_test, y_test_prob)
    auc_score = float(roc_auc_score(y_test, y_test_prob))
    
    # Downsample points for efficient SVG web rendering (20-30 points)
    step_roc = max(1, len(fpr) // 25)
    roc_points = [{"fpr": round(float(fpr[i]), 4), "tpr": round(float(tpr[i]), 4)} for i in range(0, len(fpr), step_roc)]
    if roc_points[-1]["fpr"] != 1.0 or roc_points[-1]["tpr"] != 1.0:
        roc_points.append({"fpr": 1.0, "tpr": 1.0})
        
    step_pr = max(1, len(rec) // 25)
    pr_points = [{"recall": round(float(rec[i]), 4), "precision": round(float(prec[i]), 4)} for i in range(0, len(rec), step_pr)]
    
    # Flat lists for simple frontend SVG mapping
    fpr_list = [round(float(p["fpr"]), 4) for p in roc_points]
    tpr_list = [round(float(p["tpr"]), 4) for p in roc_points]
    rec_list = [round(float(p["recall"]), 4) for p in pr_points]
    prec_list = [round(float(p["precision"]), 4) for p in pr_points]
    
    # Feature importances from production model
    if hasattr(prod_model, "feature_importances_"):
        importances = prod_model.feature_importances_
    elif hasattr(prod_model, "coef_"):
        importances = np.abs(prod_model.coef_[0])
    else:
        importances = np.ones(len(feature_cols)) / len(feature_cols)
        
    total_imp = np.sum(importances) + 1e-6
    global_importance = [
        {"feature": f, "importance": round(float(imp / total_imp), 4)}
        for f, imp in zip(feature_cols, importances)
    ]
    global_importance.sort(key=lambda x: x["importance"], reverse=True)
    
    # Combined Curves payload compatible with both formats
    curves_payload = {
        "curves": {
            "roc": {
                "fpr": fpr_list,
                "tpr": tpr_list,
                "auc": round(auc_score, 4)
            },
            "pr": {
                "recall": rec_list,
                "precision": prec_list,
                "auc": round(float(np.trapz(prec_list[::-1], rec_list[::-1])), 4)
            },
            "roc_curve": roc_points,
            "pr_curve": pr_points
        },
        "global_importance": global_importance,
        "shap_summary_points": []
    }
    
    # Governance Metadata
    metadata_payload = {
        "disease": disease_key,
        "model_name": prod_model_name,
        "version": f"{disease_key}_v1.0",
        "algorithm": type(prod_model).__name__,
        "dataset": f"CDC BRFSS ({disease_key.upper()} Epidemiological Cohort)",
        "total_dataset_samples": len(df),
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "feature_count": len(feature_cols),
        "status": "production",
        "features": feature_cols,
        "metrics": prod_metrics
    }
    
    comparison_payload = {
        "disease": disease_key,
        "test_cohort_size": len(X_test),
        "training_cohort_size": len(X_train),
        "evaluation_protocol": "Stratified 80/20 Holdout Test Cohort (Genuine Unseen Evaluation)",
        "models": comparison_results
    }
    
    # Export with multiple filename aliases for seamless server retrieval
    aliases = [disease_key]
    if disease_key == "diabetes":
        aliases.append("diab")
    elif disease_key == "cardiovascular":
        aliases.append("cvd")
        
    for alias in aliases:
        with open(os.path.join(OUT_DIR, f"{alias}_comparison.json"), "w", encoding="utf-8") as f:
            json.dump(comparison_payload, f, indent=2)
        with open(os.path.join(OUT_DIR, f"{alias}_curves.json"), "w", encoding="utf-8") as f:
            json.dump(curves_payload, f, indent=2)
        with open(os.path.join(OUT_DIR, f"{alias}_metrics.json"), "w", encoding="utf-8") as f:
            json.dump(prod_metrics, f, indent=2)
        with open(os.path.join(OUT_DIR, f"{alias}_metadata.json"), "w", encoding="utf-8") as f:
            json.dump(metadata_payload, f, indent=2)
            
    print(f"Exported artifacts for {disease_key} (aliases: {aliases}) in {time.time()-t0:.2f}s", flush=True)
    return comparison_payload, prod_metrics

if __name__ == "__main__":
    t_start = time.time()
    
    # 1. Diabetes Evaluation
    diab_comp, diab_metrics = evaluate_disease(
        disease_key="diabetes",
        csv_path=os.path.join(BASE_DIR, "datasets", "diabetes", "cdc_diabetes.csv"),
        target_col="Diabetes_binary",
        prod_model_name="Random Forest"
    )
    
    # 2. Cardiovascular Evaluation
    cvd_comp, cvd_metrics = evaluate_disease(
        disease_key="cardiovascular",
        csv_path=os.path.join(BASE_DIR, "datasets", "cardiovascular", "cdc_cvd.csv"),
        target_col="HeartDiseaseorAttack",
        prod_model_name="XGBoost"
    )
    
    print("\n==================================================", flush=True)
    print("  GENUINE TEST EVALUATION SUMMARY", flush=True)
    print("==================================================", flush=True)
    print("DIABETES (Random Forest vs 3,000 Unseen Test Patients):")
    print(json.dumps(diab_metrics, indent=2))
    print("\nCARDIOVASCULAR (XGBoost vs 3,000 Unseen Test Patients):")
    print(json.dumps(cvd_metrics, indent=2))
    print(f"\nTotal Pipeline Execution: {time.time()-t_start:.2f}s", flush=True)
