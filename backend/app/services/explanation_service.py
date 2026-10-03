from typing import List, Dict, Any
import numpy as np

# Feature metadata mapping for human-readable explanations
FEATURE_DESCRIPTIONS = {
    "HighBP": {
        "name": "High Blood Pressure",
        "pos": "Diagnosed high blood pressure elevates strain on vascular walls and metabolic load.",
        "neg": "Normal blood pressure reduces vascular strain."
    },
    "HighChol": {
        "name": "High Cholesterol",
        "pos": "Elevated cholesterol contributes to atherosclerotic plaque accumulation.",
        "neg": "Normal cholesterol levels maintain healthy arterial lumen."
    },
    "CholCheck": {
        "name": "Cholesterol Screening",
        "pos": "Routine screening within past 5 years indicates active monitoring.",
        "neg": "Lack of recent cholesterol check increases undetected lipid risk."
    },
    "BMI": {
        "name": "Body Mass Index (BMI)",
        "pos": "Elevated BMI increases insulin resistance and systemic cardiovascular strain.",
        "neg": "Healthy BMI supports optimal insulin sensitivity and vascular health."
    },
    "Smoker": {
        "name": "Smoking History",
        "pos": "History of smoking damages endothelial lining and impairs glucose homeostasis.",
        "neg": "Non-smoker status preserves endothelial function."
    },
    "Stroke": {
        "name": "History of Stroke",
        "pos": "Prior cerebrovascular event indicates established vascular disease.",
        "neg": "No prior stroke history."
    },
    "HeartDiseaseorAttack": {
        "name": "Cardiovascular Disease / MI",
        "pos": "Established coronary disease is strongly correlated with diabetic complications.",
        "neg": "No history of myocardial infarction or coronary heart disease."
    },
    "Diabetes_binary": {
        "name": "Diabetes History",
        "pos": "Diabetic dysglycemia accelerates micro- and macro-vascular injury.",
        "neg": "Normoglycemic baseline."
    },
    "PhysActivity": {
        "name": "Physical Activity",
        "pos": "Regular exercise enhances peripheral glucose uptake and cardiorespiratory fitness.",
        "neg": "Sedentary lifestyle elevates metabolic and cardiovascular risk."
    },
    "Fruits": {
        "name": "Daily Fruit Consumption",
        "pos": "Dietary fruit provides antioxidant polyphenols and dietary fiber.",
        "neg": "Low fruit intake reduces micronutrient protection."
    },
    "Veggies": {
        "name": "Daily Vegetable Consumption",
        "pos": "High vegetable intake is cardioprotective and supports glycemic control.",
        "neg": "Low vegetable intake."
    },
    "HvyAlcoholConsump": {
        "name": "Heavy Alcohol Consumption",
        "pos": "Heavy alcohol intake triggers hepatic stress and blood pressure fluctuations.",
        "neg": "Moderate or non-drinker profile."
    },
    "GenHlth": {
        "name": "Self-Assessed General Health",
        "pos": "Lower perceived health state strongly correlates with chronic morbidity.",
        "neg": "High perceived health rating reflects favorable physiological reserve."
    },
    "MentHlth": {
        "name": "Poor Mental Health Days",
        "pos": "Chronic psychological stress triggers cortisol release and autonomic imbalance.",
        "neg": "Low mental health burden supports neuroendocrine stability."
    },
    "PhysHlth": {
        "name": "Poor Physical Health Days",
        "pos": "Frequent illness/injury days restrict mobility and physical rehabilitation.",
        "neg": "Robust daily physical wellbeing."
    },
    "DiffWalk": {
        "name": "Mobility Limitation",
        "pos": "Difficulty walking or climbing stairs impedes aerobic conditioning.",
        "neg": "Normal functional mobility."
    },
    "Sex": {
        "name": "Sex (Demographic)",
        "pos": "Biological sex differential in baseline epidemiological incidence.",
        "neg": "Biological sex differential."
    },
    "Age": {
        "name": "Age Tier",
        "pos": "Advancing age is a non-modifiable primary driver of metabolic & vascular stiffening.",
        "neg": "Younger age profile confers vascular compliance and cellular resilience."
    }
}

class ExplanationService:
    @staticmethod
    def generate_explanation(
        feature_names: List[str],
        feature_values: Dict[str, Any],
        shap_values: np.ndarray,
        base_value: float = 0.5
    ) -> Dict[str, Any]:
        """
        Translates raw SHAP outputs into clinically interpretable feature impacts.
        """
        impacts = []
        for i, feat in enumerate(feature_names):
            s_val = float(shap_values[i])
            val = feature_values.get(feat, 0)
            direction = "increases_risk" if s_val > 0 else "decreases_risk"
            magnitude = abs(s_val)
            
            meta = FEATURE_DESCRIPTIONS.get(feat, {
                "name": feat,
                "pos": f"{feat} increases risk factor profile.",
                "neg": f"{feat} mitigates risk factor profile."
            })
            
            desc = meta["pos"] if s_val > 0 else meta["neg"]
            
            impacts.append({
                "feature": feat,
                "display_name": meta["name"],
                "value": val,
                "shap_value": round(s_val, 4),
                "direction": direction,
                "magnitude": round(magnitude, 4),
                "description": desc
            })
            
        # Sort by impact magnitude descending
        impacts.sort(key=lambda x: x["magnitude"], reverse=True)
        
        return {
            "base_value": round(float(base_value), 4),
            "features": impacts
        }

explanation_service = ExplanationService()
