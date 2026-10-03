from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.ai_service import ai_service
from backend.app.services.database_service import database_service
from backend.app.schemas.ai import (
    QuestionRequest, QuestionResponse,
    ExplainResultRequest, ExplainResultResponse
)

router = APIRouter(prefix="/ai", tags=["AI Assistant & Clinical Explanations"])

@router.post("/question", response_model=QuestionResponse)
async def ask_health_question(
    req: QuestionRequest,
    db: Session = Depends(get_db)
):
    """
    General educational health Q&A powered by External AI:
    Answers queries regarding biomarkers (HbA1c, glucose, BP, cholesterol, BMI),
    reference ranges, and lifestyle habits in the requested language.
    Does NOT perform autonomous medical diagnosis.
    """
    try:
        result = await ai_service.answer_health_question(
            question=req.question,
            language=req.language
        )
        # Record interaction to DB
        try:
            database_service.record_ai_interaction(
                db=db,
                question=req.question,
                response=result["response"],
                language=req.language,
                user_id=req.user_id
            )
        except Exception:
            pass

        return QuestionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process health question: {str(e)}")

@router.post("/explain-result", response_model=ExplainResultResponse)
async def explain_prediction_result(req: ExplainResultRequest):
    """
    Generates a localized external AI narrative explanation of a Quantum ML screening result.
    Strictly describes supplied features without hallucinating test results or certainties.
    """
    try:
        narrative = await ai_service.explain_prediction(
            disease=req.disease,
            risk_category=req.risk_category,
            probability=req.probability,
            model_version=req.model_version,
            top_factors=req.top_factors,
            language=req.language
        )
        return ExplainResultResponse(
            disease=req.disease,
            language=req.language,
            explanation=narrative,
            model_version=req.model_version
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate clinical explanation: {str(e)}")
