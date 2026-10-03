import json
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from backend.app.core.config import settings
from backend.app.services.quantum_ml_service import quantum_ml_service

router = APIRouter(prefix="/models", tags=["Model Governance & Metadata"])

@router.get("", response_model=List[Dict[str, Any]])
def list_production_models():
    """
    Returns registered primary models in the production registry.
    """
    models_info = [
        {
            "disease": "diabetes",
            "model_name": "Quantum Support Vector Classifier (QSVC)",
            "version": "QKSVM-DIABETES-v1",
            "architecture": "Quantum Kernel + Classical SVM",
            "quantum_feature_map": "ZZFeatureMap (6 qubits)",
            "loaded": quantum_ml_service.is_ready("diabetes"),
            "status": "production" if quantum_ml_service.is_ready("diabetes") else "offline/fallback"
        },
        {
            "disease": "cardiovascular",
            "model_name": "Quantum Support Vector Classifier (QSVC)",
            "version": "QKSVM-CVD-v1",
            "architecture": "Quantum Kernel + Classical SVM",
            "quantum_feature_map": "ZZFeatureMap (6 qubits)",
            "loaded": quantum_ml_service.is_ready("cardiovascular") or quantum_ml_service.is_ready("cvd"),
            "status": "production" if (quantum_ml_service.is_ready("cardiovascular") or quantum_ml_service.is_ready("cvd")) else "offline/fallback"
        }
    ]
    return models_info

@router.get("/diabetes")
def get_diabetes_model_info():
    """
    Returns metadata, training parameters, and performance validation metrics for QKSVM-DIABETES-v1.
    """
    meta_path = settings.MODELS_DIR / "diabetes_metadata.json"
    if meta_path.exists():
        with open(meta_path, "r") as f:
            return json.load(f)
    return {
        "disease": "diabetes",
        "model_name": "Quantum Support Vector Classifier (QSVC)",
        "version": "QKSVM-DIABETES-v1",
        "status": "ready"
    }

@router.get("/cardiovascular")
def get_cardiovascular_model_info():
    """
    Returns metadata, training parameters, and performance validation metrics for QKSVM-CVD-v1.
    """
    meta_path = settings.MODELS_DIR / "cardiovascular_metadata.json"
    if meta_path.exists():
        with open(meta_path, "r") as f:
            return json.load(f)
    return {
        "disease": "cardiovascular",
        "model_name": "Quantum Support Vector Classifier (QSVC)",
        "version": "QKSVM-CVD-v1",
        "status": "ready"
    }

@router.post("/reload")
def reload_models():
    """
    Hot-reloads quantum model weights from artifact directory.
    """
    quantum_ml_service.load_artifacts()
    return {
        "status": "reloaded",
        "models_loaded": {
            "diabetes": quantum_ml_service.is_ready("diabetes"),
            "cardiovascular": quantum_ml_service.is_ready("cardiovascular") or quantum_ml_service.is_ready("cvd")
        }
    }
