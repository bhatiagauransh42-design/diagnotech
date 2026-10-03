from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class FeatureImpact(BaseModel):
    feature: str
    display_name: str
    value: Any
    shap_value: float
    direction: str  # "increases_risk" or "decreases_risk"
    magnitude: float
    description: str

class PredictionExplanation(BaseModel):
    base_value: float
    features: List[FeatureImpact]

class ModelMetricsSummary(BaseModel):
    accuracy: float
    precision: float
    recall: float
    specificity: float
    f1: float
    roc_auc: float

class PredictionResponse(BaseModel):
    disease: str
    prediction: int
    prediction_label: Optional[str] = "higher_risk"
    score: float # Continuous decision function / ranking score
    probability: float # Calibrated probabilistic risk estimate [0, 1]
    risk_category: str  # "Low", "Moderate", "High"
    risk_color: str     # Green, Amber, Red
    model_name: str
    model_version: str # e.g. "QKSVM-DIABETES-v1" or "QKSVM-CVD-v1"
    explanation: PredictionExplanation
    ai_explanation: Optional[str] = None
    language: Optional[str] = "en"
    quantum_methodology: Optional[Dict[str, Any]] = None
    model_metrics: Optional[ModelMetricsSummary] = None
    clinical_recommendations: List[str]
    disclaimer: str
    source: Optional[str] = "manual"
    timestamp: str

class HealthStatus(BaseModel):
    status: str
    version: str
    models_loaded: Dict[str, bool]
    quantum_ready: bool = True
    ai_provider: str = "auto"
    timestamp: str

class ModelMetadataResponse(BaseModel):
    disease: str
    model_name: str
    version: str
    algorithm: str
    dataset: str
    training_samples: int
    test_samples: int
    feature_count: int
    features: List[str]
    quantum_features: Optional[int] = 6
    metrics: Dict[str, Any]
