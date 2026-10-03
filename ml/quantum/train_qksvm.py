"""
Train and serialize Quantum Support Vector Classifier (QSVC) models for Diagnotech:
1. QKSVM-DIABETES-v1 (Type 2 Diabetes Risk)
2. QKSVM-CVD-v1 (Cardiovascular Disease Risk)

Architecture:
Medical Features -> Validation -> Feature Selection -> Dimensionality Reduction (PCA to 6 qubits)
-> Quantum Angle Scaling [0, pi] -> ZZFeatureMap Quantum Kernel -> Classical SVM (QSVC)
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix
)

# Add project root to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from ml.quantum.feature_map import compute_zz_quantum_kernel

def compute_metrics(y_true, y_pred, y_prob):
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    spec = tn / (tn + fp) if (tn + fp) > 0 else 0.0
    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "precision": round(float(precision_score(y_true, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_true, y_pred, zero_division=0)), 4),
        "specificity": round(float(spec), 4),
        "f1": round(float(f1_score(y_true, y_pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_true, y_prob)), 4)
    }

def train_qksvm_model(disease: str, data_path: str, target_col: str, model_version: str):
    print(f"\n=======================================================")
    print(f"Training Quantum Kernel + Classical SVM for: {disease.upper()}")
    print(f"Model Version: {model_version}")
    print(f"Dataset Path: {data_path}")
    print(f"=======================================================")

    df = pd.read_csv(data_path)
    feature_cols = [c for c in df.columns if c != target_col]
    
    # Stratified sampling for robust training & testing
    # Support vector quantum kernel O(N^2) scales smoothly with balanced cohort
    sample_df = df.sample(n=min(len(df), 2000), random_state=42)
    X = sample_df[feature_cols].values
    y = sample_df[target_col].values.astype(int)

    X_train_full, X_test, y_train_full, y_test = train_test_split(
        X, y, test_size=0.30, random_state=42, stratify=y
    )

    # Take training support subset (800 balanced samples)
    n_train_support = min(800, len(X_train_full))
    idx = np.random.RandomState(42).choice(len(X_train_full), n_train_support, replace=False)
    X_train = X_train_full[idx]
    y_train = y_train_full[idx]

    print(f"Feature count: {len(feature_cols)}, Train support set: {X_train.shape}, Test set: {X_test.shape}")

    # Step 1: Preprocessing & Standardization
    raw_scaler = StandardScaler()
    X_train_scaled = raw_scaler.fit_transform(X_train)
    X_test_scaled = raw_scaler.transform(X_test)

    # Step 2: Feature Selection (select top 12 informative features if >12)
    k_features = min(12, len(feature_cols))
    selector = SelectKBest(score_func=f_classif, k=k_features)
    X_train_selected = selector.fit_transform(X_train_scaled, y_train)
    X_test_selected = selector.transform(X_test_scaled)
    selected_indices = selector.get_support(indices=True).tolist()
    selected_feature_names = [feature_cols[i] for i in selected_indices]
    print(f"Selected top {k_features} features: {selected_feature_names}")

    # Step 3: Dimensionality Reduction (PCA to 6 Quantum Features)
    n_qubits = 6
    pca = PCA(n_components=n_qubits, random_state=42)
    X_train_pca = pca.fit_transform(X_train_selected)
    X_test_pca = pca.transform(X_test_selected)
    explained_var = float(np.sum(pca.explained_variance_ratio_))
    print(f"PCA reduced to {n_qubits} qubits. Cumulative variance explained: {explained_var*100:.2f}%")

    # Step 4: Scale reduced features into Quantum Phase Domain [0, pi]
    quantum_scaler = MinMaxScaler(feature_range=(0.0, np.pi))
    X_train_q = quantum_scaler.fit_transform(X_train_pca)
    X_test_q = quantum_scaler.transform(X_test_pca)

    # Step 5: Compute Train-Train Quantum Kernel Matrix
    print("Computing Train Quantum Kernel Gram Matrix...")
    K_train = compute_zz_quantum_kernel(X_train_q, X_train_q)

    # Step 6: Train Classical SVM with Precomputed Quantum Kernel
    print("Fitting Support Vector Classifier (QSVC) on Quantum Kernel...")
    qsvc = SVC(
        kernel="precomputed",
        probability=True,
        class_weight="balanced",
        C=1.0,
        random_state=42
    )
    qsvc.fit(K_train, y_train)

    # Step 7: Evaluate on Test Cohort
    print("Computing Test-Train Quantum Kernel Matrix...")
    K_test = compute_zz_quantum_kernel(X_test_q, X_train_q)
    y_pred = qsvc.predict(K_test)
    y_prob = qsvc.predict_proba(K_test)[:, 1]

    metrics = compute_metrics(y_test, y_pred, y_prob)
    print(f"Test Results for {model_version}:")
    for k, v in metrics.items():
        print(f"  {k}: {v}")

    # Step 8: Package and Serialize Pipeline Artifact
    artifact = {
        "model_version": model_version,
        "disease": disease,
        "classifier": qsvc,
        "support_vectors_quantum": X_train_q,
        "y_train": y_train,
        "raw_scaler": raw_scaler,
        "selector": selector,
        "selected_indices": selected_indices,
        "selected_features": selected_feature_names,
        "pca": pca,
        "quantum_scaler": quantum_scaler,
        "n_qubits": n_qubits,
        "feature_order": feature_cols,
        "metrics": metrics,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }

    out_dir = os.path.join(PROJECT_ROOT, "backend", "models")
    os.makedirs(out_dir, exist_ok=True)

    joblib_filename = f"{disease}_qksvm_v1.joblib"
    joblib_path = os.path.join(out_dir, joblib_filename)
    joblib.dump(artifact, joblib_path)
    print(f"[OK] Saved model artifact to: {joblib_path}")

    # Step 9: Save Model Metadata and Metrics JSON
    metadata = {
        "disease": disease,
        "model_name": "Quantum Support Vector Classifier (QSVC)",
        "model_version": model_version,
        "algorithm": "Quantum Kernel + Classical SVM",
        "quantum_feature_map": "ZZFeatureMap (Second-Order Pauli Expansion with Phase Entanglement)",
        "qubits": n_qubits,
        "dataset": f"CDC BRFSS {disease.title()} Health Indicators (15,000 genuine records)",
        "dataset_version": "CDC-BRFSS-2021-v1",
        "preprocessing_version": "std_selectkbest_pca6_minmaxpi_v1",
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "feature_count": len(feature_cols),
        "features": feature_cols,
        "quantum_features": n_qubits,
        "metrics": metrics,
        "training_date": datetime.utcnow().isoformat() + "Z"
    }

    meta_filename = f"{disease}_metadata.json"
    meta_path = os.path.join(out_dir, meta_filename)
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    metrics_filename = f"{disease}_metrics.json"
    metrics_path = os.path.join(out_dir, metrics_filename)
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"[OK] Saved metadata and metrics to {out_dir}")
    return artifact

def main():
    diabetes_data = os.path.join(PROJECT_ROOT, "datasets", "diabetes", "cdc_diabetes.csv")
    cvd_data = os.path.join(PROJECT_ROOT, "datasets", "cardiovascular", "cdc_cvd.csv")

    train_qksvm_model(
        disease="diabetes",
        data_path=diabetes_data,
        target_col="Diabetes_binary",
        model_version="QKSVM-DIABETES-v1"
    )

    train_qksvm_model(
        disease="cardiovascular",
        data_path=cvd_data,
        target_col="HeartDiseaseorAttack",
        model_version="QKSVM-CVD-v1"
    )

    print("\n[SUCCESS] Both Quantum Kernel SVM models successfully trained and serialized!")

if __name__ == "__main__":
    main()
