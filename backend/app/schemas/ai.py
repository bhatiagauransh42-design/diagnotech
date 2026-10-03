from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class QuestionRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=500, description="Educational health query")
    language: str = Field("en", description="Target language (en, hi, es, fr, de, bn)")
    user_id: Optional[str] = None

class QuestionResponse(BaseModel):
    question: str
    language: str
    response: str
    provider: str
    disclaimer: str

class ExplainResultRequest(BaseModel):
    disease: str
    risk_category: str
    probability: float
    model_version: str
    top_factors: List[Dict[str, Any]]
    language: str = "en"
    user_id: Optional[str] = None

class ExplainResultResponse(BaseModel):
    disease: str
    language: str
    explanation: str
    model_version: str
