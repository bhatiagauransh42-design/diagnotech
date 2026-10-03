from fastapi import APIRouter
from typing import List, Dict
from pydantic import BaseModel
from backend.app.services.language_service import language_service

router = APIRouter(prefix="/language", tags=["Multilingual Processing"])

class LanguageProcessRequest(BaseModel):
    text: str
    target_language: str

class LanguageProcessResponse(BaseModel):
    original_text: str
    target_language: str
    processed_text: str

@router.get("/supported", response_model=List[Dict[str, str]])
def get_supported_languages():
    """Returns list of supported internationalization languages."""
    return language_service.get_supported_languages()

@router.post("/process", response_model=LanguageProcessResponse)
def process_language(req: LanguageProcessRequest):
    """Echoes or adapts language request."""
    return LanguageProcessResponse(
        original_text=req.text,
        target_language=req.target_language,
        processed_text=req.text
    )
