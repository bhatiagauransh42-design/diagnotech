from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class ExtractedBiometrics(BaseModel):
    age: Optional[float] = None
    gender: Optional[str] = None
    bmi: Optional[float] = None
    glucose: Optional[float] = None
    hba1c: Optional[float] = None
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    cholesterol: Optional[float] = None
    smoking: Optional[bool] = None
    stroke: Optional[bool] = None
    heart_disease: Optional[bool] = None
    physical_activity: Optional[bool] = None

class ReportAnalysisResponse(BaseModel):
    report_id: str
    filename: str
    file_type: str
    processing_status: str
    extracted_biometrics: ExtractedBiometrics
    units: Dict[str, str]
    missing_fields: List[str]
    warnings: List[str]
    mapped_form_data: Dict[str, Any]
    extractor: str
    summary_notes: Optional[str] = None
