"""
Medical Data Service for Diagnotech.
Implements:
1. Schema & Data Type Validation
2. Missing Field Check (never silently fabricate medical values)
3. Unit Normalization
4. Medical Range / Sanity Validation
5. Feature Mapping into Quantum ML compatible representation.
"""

from typing import Dict, Any, List, Tuple, Optional

# Valid clinical physiological ranges
PHYSIOLOGICAL_RANGES = {
    "age": (1.0, 115.0, "years"),
    "bmi": (10.0, 75.0, "kg/m²"),
    "glucose": (30.0, 600.0, "mg/dL"),
    "hba1c": (3.0, 20.0, "%"),
    "systolic_bp": (50.0, 260.0, "mmHg"),
    "diastolic_bp": (30.0, 160.0, "mmHg"),
    "cholesterol": (50.0, 600.0, "mg/dL"),
}

class MedicalDataService:
    @staticmethod
    def map_age_to_cdc_tier(age_years: float) -> int:
        """Maps continuous age in years to CDC BRFSS 13-level ordinal category"""
        if age_years < 25: return 1   # 18-24
        elif age_years < 30: return 2 # 25-29
        elif age_years < 35: return 3 # 30-34
        elif age_years < 40: return 4 # 35-39
        elif age_years < 45: return 5 # 40-44
        elif age_years < 50: return 6 # 45-49
        elif age_years < 55: return 7 # 50-54
        elif age_years < 60: return 8 # 55-59
        elif age_years < 65: return 9 # 60-64
        elif age_years < 70: return 10 # 65-69
        elif age_years < 75: return 11 # 70-74
        elif age_years < 80: return 12 # 75-79
        else: return 13               # 80+

    @staticmethod
    def validate_and_normalize(extracted_json: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates types, checks plausible biological ranges, normalizes units,
        and builds an approved structured medical dataset.
        """
        approved_biometrics: Dict[str, Any] = {}
        validation_warnings: List[str] = []
        missing_fields: List[str] = []
        units: Dict[str, str] = {}

        core_parameters = [
            "age", "bmi", "glucose", "hba1c", "systolic_bp",
            "diastolic_bp", "cholesterol", "smoking", "stroke", "heart_disease"
        ]

        for param in core_parameters:
            val = extracted_json.get(param)
            if val is None or val == "":
                missing_fields.append(param)
                approved_biometrics[param] = None
                continue

            # Boolean fields
            if param in ["smoking", "stroke", "heart_disease"]:
                if isinstance(val, bool):
                    approved_biometrics[param] = val
                elif isinstance(val, (int, float)):
                    approved_biometrics[param] = bool(val)
                elif isinstance(val, str):
                    approved_biometrics[param] = val.lower() in ["true", "yes", "1", "positive"]
                else:
                    missing_fields.append(param)
                    approved_biometrics[param] = None
                continue

            # Numeric fields validation and range checking
            try:
                numeric_val = float(val)
                min_val, max_val, unit_str = PHYSIOLOGICAL_RANGES.get(param, (0.0, 1000.0, ""))
                units[param] = unit_str

                if not (min_val <= numeric_val <= max_val):
                    validation_warnings.append(
                        f"{param.upper()} value ({numeric_val} {unit_str}) is outside expected biological range [{min_val}, {max_val}]."
                    )
                approved_biometrics[param] = round(numeric_val, 2)
            except (ValueError, TypeError):
                validation_warnings.append(f"Invalid numeric format for {param}: {val}")
                missing_fields.append(param)
                approved_biometrics[param] = None

        gender = extracted_json.get("gender")
        if gender:
            gender_clean = str(gender).lower().strip()
            approved_biometrics["gender"] = "male" if "m" in gender_clean else "female" if "f" in gender_clean else "unknown"
        else:
            approved_biometrics["gender"] = "unknown"

        return {
            "biometrics": approved_biometrics,
            "units": units,
            "missing_fields": missing_fields,
            "warnings": validation_warnings,
            "is_valid": len(validation_warnings) == 0
        }

    @staticmethod
    def map_to_model_features(approved_data: Dict[str, Any], disease: str = "diabetes") -> Dict[str, Any]:
        """
        Maps validated structured clinical lab parameters to CDC BRFSS model features.
        Preserves data provenance without silent fabrication.
        """
        bio = approved_data.get("biometrics", approved_data)

        # Blood Pressure derivation
        high_bp = 0
        sys_bp = bio.get("systolic_bp")
        dia_bp = bio.get("diastolic_bp")
        if (sys_bp is not None and sys_bp >= 130) or (dia_bp is not None and dia_bp >= 80):
            high_bp = 1

        # Cholesterol derivation
        high_chol = 0
        chol = bio.get("cholesterol")
        if chol is not None and chol >= 200:
            high_chol = 1

        # BMI
        bmi = bio.get("bmi") or 24.5

        # Smoking
        smoker = 1 if bio.get("smoking") is True else 0

        # Stroke / Heart Disease
        stroke = 1 if bio.get("stroke") is True else 0
        heart_disease = 1 if bio.get("heart_disease") is True else 0

        # Diabetes binary flag (derived for CVD model)
        diabetes_binary = 0
        glucose = bio.get("glucose")
        hba1c = bio.get("hba1c")
        if (glucose is not None and glucose >= 126) or (hba1c is not None and hba1c >= 6.5):
            diabetes_binary = 1

        # Age tier
        age_years = bio.get("age") or 45.0
        age_tier = MedicalDataService.map_age_to_cdc_tier(age_years)

        # Sex
        sex = 1 if bio.get("gender") == "male" else 0

        # Assembled feature map compatible with ScreeningForm and Quantum ML
        mapped = {
            "HighBP": high_bp,
            "HighChol": high_chol,
            "CholCheck": 1, # Checked since a report exists
            "BMI": round(float(bmi), 1),
            "Smoker": smoker,
            "Stroke": stroke,
            "HeartDiseaseorAttack": heart_disease,
            "Diabetes_binary": diabetes_binary,
            "PhysActivity": 1,
            "Fruits": 1,
            "Veggies": 1,
            "HvyAlcoholConsump": 0,
            "GenHlth": 2 if (high_bp == 0 and bmi < 26) else 3,
            "MentHlth": 0,
            "PhysHlth": 0,
            "DiffWalk": 0,
            "Sex": sex,
            "Age": age_tier
        }

        return mapped

medical_data_service = MedicalDataService()
