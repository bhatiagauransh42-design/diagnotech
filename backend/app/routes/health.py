from fastapi import APIRouter
from datetime import datetime, timezone
from backend.app.schemas.responses import HealthStatus
from backend.app.services.quantum_ml_service import quantum_ml_service
from backend.app.services.ai_service import ai_service
from backend.app.core.config import settings

router = APIRouter(tags=["Health & Status"])

@router.get("/health", response_model=HealthStatus)
def get_system_health():
    """
    Returns platform health status, Quantum Kernel readiness, and External AI status.
    """
    diab_ready = quantum_ml_service.is_ready("diabetes")
    cvd_ready = quantum_ml_service.is_ready("cardiovascular") or quantum_ml_service.is_ready("cvd")

    return HealthStatus(
        status="healthy",
        version=settings.VERSION,
        models_loaded={
            "diabetes_qksvm": diab_ready,
            "cardiovascular_qksvm": cvd_ready
        },
        quantum_ready=diab_ready and cvd_ready,
        ai_provider=ai_service.provider,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
