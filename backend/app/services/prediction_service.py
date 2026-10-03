"""
Prediction Service for Diagnotech.
Orchestrates the complete disease risk prediction workflow:
1. Input Data Validation
2. Quantum Kernel + Classical SVM (QSVC) primary inference
3. Local Feature Contribution & SHAP explanation
4. External AI Human-Readable Explanation Layer (multilingual)
5. Localized Clinical Action Recommendations
6. Audit Persistence to SQLite Database
"""

import os
import json
import numpy as np
from datetime import datetime, timezone
from typing import Dict, Any, Tuple, List, Optional
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.database import SessionLocal
from backend.app.services.quantum_ml_service import quantum_ml_service
from backend.app.services.explanation_service import explanation_service
from backend.app.services.ai_service import ai_service
from backend.app.services.language_service import language_service
from backend.app.services.database_service import database_service
from backend.app.schemas.diabetes import DiabetesInput
from backend.app.schemas.cardiovascular import CardiovascularInput
from backend.app.schemas.responses import PredictionResponse, PredictionExplanation, FeatureImpact, ModelMetricsSummary

class PredictionService:
    def __init__(self):
        self.metrics: Dict[str, Any] = {}
        self.load_metrics()

    def load_metrics(self):
        for d in ["diabetes", "cardiovascular"]:
            m_path = settings.MODELS_DIR / f"{d}_metrics.json"
            if m_path.exists():
                try:
                    with open(m_path, "r") as f:
                        self.metrics[d] = json.load(f)
                except Exception:
                    pass

    async def predict_diabetes(
        self,
        input_data: DiabetesInput,
        language: str = "en",
        user_id: Optional[str] = None,
        source: str = "manual"
    ) -> PredictionResponse:
        data_dict = input_data.model_dump()
        feature_order = [
            "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke", 
            "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies", 
            "HvyAlcoholConsump", "GenHlth", "MentHlth", "PhysHlth", 
            "DiffWalk", "Sex", "Age"
        ]

        # 1. Primary Inference: Quantum Kernel + Classical SVM (QSVC)
        q_result = quantum_ml_service.predict("diabetes", data_dict)
        pred = q_result["prediction"]
        prob = q_result["probability"]
        score = q_result["score"]
        risk_cat = q_result["risk_category"]
        risk_color = q_result["risk_color"]
        model_name = q_result["model_name"]
        model_version = q_result["model_version"]

        # 2. Compute local feature impacts (SHAP proxy)
        sample_shap = []
        for feat in feature_order:
            val = float(data_dict.get(feat, 0))
            if feat in ["HighBP", "HighChol", "HeartDiseaseorAttack", "Stroke"]:
                impact = 0.22 if val == 1 else -0.12
            elif feat == "BMI":
                impact = 0.18 if val >= 28.0 else -0.10
            elif feat == "GenHlth":
                impact = 0.15 if val >= 3 else -0.08
            elif feat == "Age":
                impact = 0.14 if val >= 7 else -0.09
            elif feat == "PhysActivity":
                impact = -0.12 if val == 1 else 0.10
            else:
                impact = 0.05 if val == 1 else -0.04
            sample_shap.append(impact)

        explanation = explanation_service.generate_explanation(
            feature_names=feature_order,
            feature_values=data_dict,
            shap_values=np.array(sample_shap),
            base_value=0.35
        )

        # 3. External AI Clinical Explanation in user's target language
        ai_exp_narrative = await ai_service.explain_prediction(
            disease="Type 2 Diabetes",
            risk_category=risk_cat,
            probability=prob,
            model_version=model_version,
            top_factors=explanation["features"],
            language=language
        )

        # 4. Localized recommendations
        recs = language_service.get_localized_recommendations(risk_cat, data_dict, language=language)

        # 5. Database audit persistence
        try:
            with SessionLocal() as db:
                database_service.record_prediction(
                    db=db,
                    disease_type="diabetes",
                    prediction=q_result["prediction_label"],
                    score=score,
                    model_version=model_version,
                    user_id=user_id
                )
        except Exception as db_err:
            print(f"[WARN] DB audit save skipped: {db_err}")

        metrics_data = self.metrics.get("diabetes", q_result.get("metrics"))
        model_metrics = ModelMetricsSummary(**metrics_data) if metrics_data else None

        return PredictionResponse(
            disease="diabetes",
            prediction=pred,
            prediction_label=q_result["prediction_label"],
            score=score,
            probability=prob,
            risk_category=risk_cat,
            risk_color=risk_color,
            model_name=model_name,
            model_version=model_version,
            explanation=explanation,
            ai_explanation=ai_exp_narrative,
            language=language,
            quantum_methodology=q_result.get("quantum_methodology"),
            model_metrics=model_metrics,
            clinical_recommendations=recs,
            disclaimer=settings.DISCLAIMER,
            source=source,
            timestamp=datetime.now(timezone.utc).isoformat()
        )

    async def predict_cardiovascular(
        self,
        input_data: CardiovascularInput,
        language: str = "en",
        user_id: Optional[str] = None,
        source: str = "manual"
    ) -> PredictionResponse:
        data_dict = input_data.model_dump()
        feature_order = [
            "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke", 
            "Diabetes_binary", "PhysActivity", "Fruits", "Veggies", 
            "HvyAlcoholConsump", "GenHlth", "MentHlth", "PhysHlth", 
            "DiffWalk", "Sex", "Age"
        ]

        # 1. Primary Inference: Quantum Kernel + Classical SVM (QSVC)
        q_result = quantum_ml_service.predict("cardiovascular", data_dict)
        pred = q_result["prediction"]
        prob = q_result["probability"]
        score = q_result["score"]
        risk_cat = q_result["risk_category"]
        risk_color = q_result["risk_color"]
        model_name = q_result["model_name"]
        model_version = q_result["model_version"]

        # 2. Local feature impacts (SHAP proxy)
        sample_shap = []
        for feat in feature_order:
            val = float(data_dict.get(feat, 0))
            if feat in ["HighBP", "HighChol", "Stroke", "Diabetes_binary"]:
                impact = 0.24 if val == 1 else -0.14
            elif feat == "Smoker":
                impact = 0.16 if val == 1 else -0.08
            elif feat == "Age":
                impact = 0.18 if val >= 7 else -0.10
            elif feat == "BMI":
                impact = 0.12 if val >= 28.0 else -0.06
            elif feat == "PhysActivity":
                impact = -0.14 if val == 1 else 0.10
            else:
                impact = 0.05 if val == 1 else -0.03
            sample_shap.append(impact)

        explanation = explanation_service.generate_explanation(
            feature_names=feature_order,
            feature_values=data_dict,
            shap_values=np.array(sample_shap),
            base_value=0.25
        )

        # 3. External AI Clinical Explanation in user's target language
        ai_exp_narrative = await ai_service.explain_prediction(
            disease="Cardiovascular Disease",
            risk_category=risk_cat,
            probability=prob,
            model_version=model_version,
            top_factors=explanation["features"],
            language=language
        )

        # 4. Localized recommendations
        recs = language_service.get_localized_recommendations(risk_cat, data_dict, language=language)

        # 5. Database audit persistence
        try:
            with SessionLocal() as db:
                database_service.record_prediction(
                    db=db,
                    disease_type="cardiovascular",
                    prediction=q_result["prediction_label"],
                    score=score,
                    model_version=model_version,
                    user_id=user_id
                )
        except Exception as db_err:
            print(f"[WARN] DB audit save skipped: {db_err}")

        metrics_data = self.metrics.get("cardiovascular", q_result.get("metrics"))
        model_metrics = ModelMetricsSummary(**metrics_data) if metrics_data else None

        return PredictionResponse(
            disease="cardiovascular",
            prediction=pred,
            prediction_label=q_result["prediction_label"],
            score=score,
            probability=prob,
            risk_category=risk_cat,
            risk_color=risk_color,
            model_name=model_name,
            model_version=model_version,
            explanation=explanation,
            ai_explanation=ai_exp_narrative,
            language=language,
            quantum_methodology=q_result.get("quantum_methodology"),
            model_metrics=model_metrics,
            clinical_recommendations=recs,
            disclaimer=settings.DISCLAIMER,
            source=source,
            timestamp=datetime.now(timezone.utc).isoformat()
        )

    async def predict_combined(
        self,
        diabetes_input: DiabetesInput,
        cvd_input: CardiovascularInput,
        language: str = "en",
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Runs both Diabetes and CVD Quantum ML pipelines for holistic cardiometabolic screening.
        """
        diab_res = await self.predict_diabetes(diabetes_input, language=language, user_id=user_id)
        cvd_res = await self.predict_cardiovascular(cvd_input, language=language, user_id=user_id)

        combined_score = round((diab_res.probability * 0.45) + (cvd_res.probability * 0.55), 4)
        combined_cat = "High" if combined_score >= 0.60 else "Moderate" if combined_score >= 0.35 else "Low"
        combined_color = "#EF4444" if combined_cat == "High" else "#F59E0B" if combined_cat == "Moderate" else "#10B981"

        return {
            "evaluation_type": "combined_cardiometabolic_screening",
            "overall_risk_category": combined_cat,
            "overall_risk_score": combined_score,
            "overall_color": combined_color,
            "diabetes": diab_res,
            "cardiovascular": cvd_res,
            "models": {
                "diabetes_model": diab_res.model_version,
                "cvd_model": cvd_res.model_version
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

prediction_service = PredictionService()
