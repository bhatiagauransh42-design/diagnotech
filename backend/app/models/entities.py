"""
SQLAlchemy ORM models for Diagnotech clinical database schema.
Implements: Users, Reports, MedicalData, Predictions, AIInteractions, ModelMetadata.
"""

from datetime import datetime, timezone
import uuid
from sqlalchemy import (
    Column, String, Float, Integer, DateTime,
    ForeignKey, Text
)
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    user_id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    language = Column(String(10), default="en", nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")
    ai_interactions = relationship("AIInteraction", back_populates="user", cascade="all, delete-orphan")

class Report(Base):
    __tablename__ = "reports"

    report_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    file_reference = Column(String(500), nullable=False)
    file_type = Column(String(100), nullable=False)
    upload_time = Column(DateTime, default=utc_now, nullable=False)
    processing_status = Column(String(50), default="pending", nullable=False) # pending, processed, failed

    user = relationship("User", back_populates="reports")
    medical_data = relationship("MedicalData", back_populates="report", cascade="all, delete-orphan")

class MedicalData(Base):
    __tablename__ = "medical_data"

    medical_data_id = Column(String(36), primary_key=True, default=generate_uuid)
    report_id = Column(String(36), ForeignKey("reports.report_id"), nullable=True)
    feature_name = Column(String(100), nullable=False)
    feature_value = Column(Float, nullable=False)
    unit = Column(String(50), nullable=True)
    source = Column(String(50), default="manual", nullable=False) # "manual" or "report_ai_extraction"
    created_at = Column(DateTime, default=utc_now, nullable=False)

    report = relationship("Report", back_populates="medical_data")

class Prediction(Base):
    __tablename__ = "predictions"

    prediction_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    disease_type = Column(String(50), nullable=False) # "diabetes", "cardiovascular", "combined"
    prediction = Column(String(50), nullable=False) # "lower_risk" (0) or "higher_risk" (1)
    score = Column(Float, nullable=False) # SVM continuous decision value / calibrated probability
    model_version = Column(String(100), nullable=False) # e.g. "QKSVM-DIABETES-v1"
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="predictions")

class AIInteraction(Base):
    __tablename__ = "ai_interactions"

    interaction_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    question = Column(Text, nullable=False)
    language = Column(String(10), default="en", nullable=False)
    response = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="ai_interactions")

class ModelMetadata(Base):
    __tablename__ = "model_metadata"

    model_version = Column(String(100), primary_key=True)
    dataset_version = Column(String(100), nullable=False)
    feature_list = Column(Text, nullable=False) # JSON encoded list of features
    preprocessing_version = Column(String(100), nullable=False)
    model_type = Column(String(100), default="Quantum Kernel + Classical SVM", nullable=False)
    training_date = Column(DateTime, default=utc_now, nullable=False)
