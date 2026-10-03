from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.services.document_service import document_service
from backend.app.services.ai_service import ai_service
from backend.app.services.medical_data_service import medical_data_service
from backend.app.services.database_service import database_service
from backend.app.schemas.reports import ReportAnalysisResponse, ExtractedBiometrics

router = APIRouter(prefix="/reports", tags=["Medical Report Processing"])

@router.post("/upload")
async def upload_report(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Validates and securely stores an uploaded medical document (PDF / Image).
    Returns unique report_id and processing reference.
    """
    try:
        file_id, saved_path = await document_service.save_secure_temp(file)
        report = database_service.create_report(
            db=db,
            file_reference=file_id,
            file_type=file.content_type or "application/octet-stream",
            user_id=user_id,
            processing_status="uploaded"
        )
        return {
            "report_id": report.report_id,
            "file_id": file_id,
            "filename": file.filename,
            "status": "uploaded",
            "message": "File validated and queued for external AI extraction."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload report: {str(e)}")

@router.post("/analyze", response_model=ReportAnalysisResponse)
async def analyze_report(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Direct end-to-end report processing:
    1. Secure validation & temporary storage
    2. Text extraction from document (PDF / Image)
    3. External AI medical parameter extraction (strict JSON schema)
    4. Unit normalization & physiological sanity validation
    5. CDC model feature mapping
    6. Database audit persistence
    """
    file_id, saved_path = await document_service.save_secure_temp(file)
    try:
        # Create report record
        report = database_service.create_report(
            db=db,
            file_reference=file_id,
            file_type=file.content_type or "application/octet-stream",
            user_id=user_id,
            processing_status="processing"
        )

        # Extract text content
        text_content = document_service.extract_text(saved_path)
        if not text_content:
            text_content = f"Medical Document {file.filename} with patient clinical metrics."

        # External AI Structured Extraction
        extracted_raw = await ai_service.extract_medical_report_data(text_content)

        # Validation & Normalization
        val_result = medical_data_service.validate_and_normalize(extracted_raw)
        approved_biometrics = val_result["biometrics"]
        units = val_result["units"]
        missing_fields = val_result["missing_fields"]
        warnings = val_result["warnings"]

        # Map to standard screening form parameters
        mapped_form = medical_data_service.map_to_model_features(val_result)

        # Save extracted features to database
        try:
            numeric_features = {k: v for k, v in approved_biometrics.items() if isinstance(v, (int, float))}
            database_service.save_medical_features(
                db=db,
                features=numeric_features,
                source="report_ai_extraction",
                report_id=report.report_id,
                units=units
            )
            database_service.update_report_status(db, report.report_id, "processed")
        except Exception as db_err:
            print(f"[WARN] Failed to save extracted features to DB: {db_err}")

        # Securely remove temporary file
        document_service.cleanup_temp_file(saved_path)

        return ReportAnalysisResponse(
            report_id=report.report_id,
            filename=file.filename or "medical_report",
            file_type=file.content_type or "application/pdf",
            processing_status="processed",
            extracted_biometrics=ExtractedBiometrics(**approved_biometrics),
            units=units,
            missing_fields=missing_fields,
            warnings=warnings,
            mapped_form_data=mapped_form,
            extractor=extracted_raw.get("extractor", "external_ai"),
            summary_notes=extracted_raw.get("notes")
        )
    except HTTPException:
        document_service.cleanup_temp_file(saved_path)
        raise
    except Exception as e:
        document_service.cleanup_temp_file(saved_path)
        raise HTTPException(status_code=500, detail=f"Error analyzing medical report: {str(e)}")

@router.get("/{report_id}")
def get_report_status(report_id: str, db: Session = Depends(get_db)):
    """Retrieves report status and extracted medical data from database."""
    report = database_service.get_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return {
        "report_id": report.report_id,
        "processing_status": report.processing_status,
        "file_type": report.file_type,
        "upload_time": report.upload_time.isoformat(),
        "extracted_features": [
            {
                "feature_name": d.feature_name,
                "feature_value": d.feature_value,
                "unit": d.unit,
                "source": d.source
            }
            for d in report.medical_data
        ]
    }
