"""
Database Service layer providing CRUD and persistence operations
for Users, Reports, Medical Data, Predictions, AI Interactions, and Model Metadata.
"""

import json
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.models.entities import (
    User, Report, MedicalData, Prediction, AIInteraction, ModelMetadata, utc_now
)

class DatabaseService:
    @staticmethod
    def create_user(db: Session, name: str, email: str, password_hash: Optional[str] = None, language: str = "en") -> User:
        user = User(name=name, email=email, password_hash=password_hash, language=language)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        return db.query(User).filter(User.user_id == user_id).first()

    @staticmethod
    def create_report(
        db: Session,
        file_reference: str,
        file_type: str,
        user_id: Optional[str] = None,
        processing_status: str = "pending"
    ) -> Report:
        report = Report(
            user_id=user_id,
            file_reference=file_reference,
            file_type=file_type,
            processing_status=processing_status
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

    @staticmethod
    def update_report_status(db: Session, report_id: str, status: str) -> Optional[Report]:
        report = db.query(Report).filter(Report.report_id == report_id).first()
        if report:
            report.processing_status = status
            db.commit()
            db.refresh(report)
        return report

    @staticmethod
    def get_report(db: Session, report_id: str) -> Optional[Report]:
        return db.query(Report).filter(Report.report_id == report_id).first()

    @staticmethod
    def save_medical_features(
        db: Session,
        features: Dict[str, float],
        source: str = "manual",
        report_id: Optional[str] = None,
        units: Optional[Dict[str, str]] = None
    ) -> List[MedicalData]:
        units = units or {}
        entries = []
        for feat_name, feat_val in features.items():
            if feat_val is not None:
                entry = MedicalData(
                    report_id=report_id,
                    feature_name=feat_name,
                    feature_value=float(feat_val),
                    unit=units.get(feat_name, ""),
                    source=source
                )
                db.add(entry)
                entries.append(entry)
        db.commit()
        return entries

    @staticmethod
    def record_prediction(
        db: Session,
        disease_type: str,
        prediction: str,
        score: float,
        model_version: str,
        user_id: Optional[str] = None
    ) -> Prediction:
        pred = Prediction(
            user_id=user_id,
            disease_type=disease_type,
            prediction=prediction,
            score=float(score),
            model_version=model_version
        )
        db.add(pred)
        db.commit()
        db.refresh(pred)
        return pred

    @staticmethod
    def record_ai_interaction(
        db: Session,
        question: str,
        response: str,
        language: str = "en",
        user_id: Optional[str] = None
    ) -> AIInteraction:
        interaction = AIInteraction(
            user_id=user_id,
            question=question,
            response=response,
            language=language
        )
        db.add(interaction)
        db.commit()
        db.refresh(interaction)
        return interaction

    @staticmethod
    def register_model_metadata(
        db: Session,
        model_version: str,
        dataset_version: str,
        feature_list: List[str],
        preprocessing_version: str,
        model_type: str = "Quantum Kernel + Classical SVM"
    ) -> ModelMetadata:
        existing = db.query(ModelMetadata).filter(ModelMetadata.model_version == model_version).first()
        if existing:
            existing.dataset_version = dataset_version
            existing.feature_list = json.dumps(feature_list)
            existing.preprocessing_version = preprocessing_version
            existing.model_type = model_type
            db.commit()
            db.refresh(existing)
            return existing
        else:
            meta = ModelMetadata(
                model_version=model_version,
                dataset_version=dataset_version,
                feature_list=json.dumps(feature_list),
                preprocessing_version=preprocessing_version,
                model_type=model_type
            )
            db.add(meta)
            db.commit()
            db.refresh(meta)
            return meta

database_service = DatabaseService()
