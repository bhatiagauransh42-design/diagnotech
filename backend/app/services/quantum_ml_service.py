"""
Quantum Machine Learning Service for Diagnotech.
Implements the hybrid Quantum Kernel + Classical SVM (QSVC) inference pipeline:
Raw Features -> Validation & Imputation -> Standardization -> Feature Selection
-> Dimensionality Reduction (PCA 6 qubits) -> Quantum Angle Scaling [0, pi]
-> ZZFeatureMap Quantum Kernel Matrix -> Classical SVM Classifier.
"""

import os
import joblib
import numpy as np
from pathlib import Path
from typing import Dict, Any, Tuple, List, Optional
from ml.quantum.feature_map import compute_zz_quantum_kernel
from backend.app.core.config import settings

class QuantumMLService:
    def __init__(self):
        self.artifacts: Dict[str, Any] = {}
        self.load_artifacts()

    def load_artifacts(self):
        models_dir = settings.MODELS_DIR
        for disease, filename in [
            ("diabetes", "diabetes_qksvm_v1.joblib"),
            ("cardiovascular", "cardiovascular_qksvm_v1.joblib"),
            ("cvd", "cvd_qksvm_v1.joblib")
        ]:
            fpath = models_dir / filename
            if fpath.exists():
                try:
                    self.artifacts[disease] = joblib.load(fpath)
                    print(f"[OK] Quantum ML Service loaded {disease.upper()} artifact ({filename}).")
                except Exception as e:
                    print(f"[WARN] Could not load QKSVM artifact {fpath}: {e}")

    def is_ready(self, disease: str) -> bool:
        return disease in self.artifacts

    def _determine_risk_tier(self, probability: float) -> Tuple[str, str]:
        if probability < 0.35:
            return "Low", "#10B981"       # Emerald green
        elif probability < 0.65:
            return "Moderate", "#F59E0B"  # Amber
        else:
            return "High", "#EF4444"      # Crimson red

    def predict(self, disease: str, input_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes genuine Quantum Kernel + Classical SVM inference.
        """
        disease_key = "cardiovascular" if disease in ["cardiovascular", "cvd"] else "diabetes"
        if disease_key not in self.artifacts:
            # Fallback reload attempt
            self.load_artifacts()
            if disease_key not in self.artifacts:
                raise RuntimeError(f"Quantum ML Model for {disease} is not loaded.")

        artifact = self.artifacts[disease_key]
        feature_order = artifact["feature_order"]
        raw_scaler = artifact["raw_scaler"]
        selector = artifact["selector"]
        pca = artifact["pca"]
        quantum_scaler = artifact["quantum_scaler"]
        classifier = artifact["classifier"]
        X_train_q = artifact["support_vectors_quantum"]
        model_version = artifact["model_version"]

        # 1. Feature extraction with clinical baseline defaults for missing fields
        defaults = {
            "HighBP": 0, "HighChol": 0, "CholCheck": 1, "BMI": 24.5,
            "Smoker": 0, "Stroke": 0, "HeartDiseaseorAttack": 0,
            "Diabetes_binary": 0, "PhysActivity": 1, "Fruits": 1,
            "Veggies": 1, "HvyAlcoholConsump": 0, "GenHlth": 2,
            "MentHlth": 0, "PhysHlth": 0, "DiffWalk": 0, "Sex": 1, "Age": 5
        }
        
        row = []
        for feat in feature_order:
            val = input_dict.get(feat)
            if val is None or val == "":
                val = defaults.get(feat, 0)
            row.append(float(val))

        X_raw = np.array([row], dtype=np.float64)

        # 2. Standardization
        X_scaled = raw_scaler.transform(X_raw)

        # 3. Feature Selection
        X_selected = selector.transform(X_scaled)

        # 4. Dimensionality Reduction (PCA to 6 qubits)
        X_pca = pca.transform(X_selected)

        # 5. Quantum Angle Scaling to [0, pi]
        X_q = quantum_scaler.transform(X_pca)

        # 6. Quantum Kernel Matrix Evaluation against training support vectors
        # Shape: (1, n_support_vectors)
        K_test = compute_zz_quantum_kernel(X_q, X_train_q)

        # 7. Classical SVM Evaluation
        pred_class = int(classifier.predict(K_test)[0])
        
        # Determine calibrated probability and continuous score
        if hasattr(classifier, "predict_proba"):
            probs = classifier.predict_proba(K_test)[0]
            prob = float(probs[1])
        else:
            decision = float(classifier.decision_function(K_test)[0])
            prob = float(1.0 / (1.0 + np.exp(-decision)))

        prob = min(0.98, max(0.02, round(prob, 4)))
        risk_cat, risk_color = self._determine_risk_tier(prob)
        prediction_label = "higher_risk" if pred_class == 1 else "lower_risk"

        return {
            "disease": disease,
            "prediction": pred_class,
            "prediction_label": prediction_label,
            "score": round(prob, 4), # continuous risk score
            "probability": round(prob, 4), # calibrated probability
            "risk_category": risk_cat,
            "risk_color": risk_color,
            "model_name": "Quantum Support Vector Classifier (QSVC)",
            "model_version": model_version,
            "quantum_methodology": {
                "quantum_feature_map": "ZZFeatureMap (Second-Order Pauli Expansion)",
                "qubits": artifact.get("n_qubits", 6),
                "kernel": "Quantum State Fidelity Kernel",
                "classifier": "Support Vector Classifier with Precomputed Kernel"
            },
            "metrics": artifact.get("metrics", {})
        }

quantum_ml_service = QuantumMLService()
