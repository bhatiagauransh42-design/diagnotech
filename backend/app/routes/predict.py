from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any
from backend.app.schemas.diabetes import DiabetesInput
from backend.app.schemas.cardiovascular import CardiovascularInput
from backend.app.schemas.responses import PredictionResponse
from backend.app.services.prediction_service import prediction_service

router = APIRouter(prefix="/predict", tags=["Screening & Quantum Prediction"])

@router.post("/diabetes", response_model=PredictionResponse)
async def screen_diabetes(
    data: DiabetesInput,
    language: str = Query("en", description="Target language: en, hi, es, fr, de, bn"),
    user_id: Optional[str] = Query(None, description="Optional authenticated user ID")
):
    """
    Screen patient for Type 2 Diabetes risk via Quantum Kernel + Classical SVM (QSVC)
    with ZZFeatureMap 6-qubit phase mapping.
    Returns calibrated probability, continuous score, local SHAP impacts,
    and external AI clinical explanation in requested language.
    """
    try:
        return await prediction_service.predict_diabetes(data, language=language, user_id=user_id, source="manual")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error during diabetes screening: {str(e)}")

@router.post("/cardiovascular", response_model=PredictionResponse)
async def screen_cardiovascular(
    data: CardiovascularInput,
    language: str = Query("en", description="Target language: en, hi, es, fr, de, bn"),
    user_id: Optional[str] = Query(None, description="Optional authenticated user ID")
):
    """
    Screen patient for Cardiovascular Disease risk via Quantum Kernel + Classical SVM (QSVC)
    with ZZFeatureMap 6-qubit phase mapping.
    Returns calibrated probability, continuous score, local SHAP impacts,
    and external AI clinical explanation in requested language.
    """
    try:
        return await prediction_service.predict_cardiovascular(data, language=language, user_id=user_id, source="manual")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error during CVD screening: {str(e)}")

@router.post("/cvd", response_model=PredictionResponse)
async def screen_cvd(
    data: CardiovascularInput,
    language: str = Query("en", description="Target language: en, hi, es, fr, de, bn"),
    user_id: Optional[str] = Query(None, description="Optional authenticated user ID")
):
    """
    Standard alias for Cardiovascular Disease screening (QKSVM-CVD-v1).
    """
    return await screen_cardiovascular(data, language=language, user_id=user_id)

class CombinedInput(DiabetesInput, CardiovascularInput):
    pass

@router.post("/combined")
async def screen_combined(
    data: DiabetesInput,
    language: str = Query("en", description="Target language: en, hi, es, fr, de, bn"),
    user_id: Optional[str] = Query(None, description="Optional authenticated user ID")
):
    """
    Dual-disease screening evaluating Type 2 Diabetes and CVD simultaneously
    using both QKSVM-DIABETES-v1 and QKSVM-CVD-v1 models.
    """
    try:
        # Convert common input into both schema representations
        cvd_dict = data.model_dump()
        cvd_dict["Diabetes_binary"] = 0
        cvd_input = CardiovascularInput(**cvd_dict)
        return await prediction_service.predict_combined(
            diabetes_input=data,
            cvd_input=cvd_input,
            language=language,
            user_id=user_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Combined screening error: {str(e)}")
