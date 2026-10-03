"""
Language & Multilingual Service for Diagnotech.
Supports internationalization of user recommendations, risk descriptions,
and AI explanation narratives while keeping the numerical Quantum ML pipeline
strictly language-independent.
"""

from typing import Dict, Any, List

SUPPORTED_LANGUAGES = {
    "en": {"code": "en", "name": "English", "native": "English"},
    "hi": {"code": "hi", "name": "Hindi", "native": "हिन्दी"},
    "es": {"code": "es", "name": "Spanish", "native": "Español"},
    "fr": {"code": "fr", "name": "French", "native": "Français"},
    "de": {"code": "de", "name": "German", "native": "Deutsch"},
    "bn": {"code": "bn", "name": "Bengali", "native": "বাংলা"}
}

# Localized standard clinical recommendations
RECOMMENDATIONS_TRANSLATIONS = {
    "hi": {
        "High": "व्यापक चिकित्सीय परीक्षण (HbA1c / लिपिड प्रोफाइल) के लिए प्राथमिकता के आधार पर डॉक्टर से परामर्श लें।",
        "Moderate": "सक्रिय जीवनशैली अपनाएं: सप्ताह में 150 मिनट मध्यम एरोबिक व्यायाम और आहार नियंत्रण।",
        "Low": "नियमित वार्षिक निवारक स्वास्थ्य जांच जारी रखें।",
        "bp": "घर पर नियमित रक्तचाप निगरानी (दैनिक सुबह/शाम का रिकॉर्ड) रखें।",
        "bmi": "वजन प्रबंधन और योग्य पोषण विशेषज्ञ (डाइटिशियन) से परामर्श लें।",
        "smoke": "धूम्रपान छोड़ने के लिए डॉक्टरी परामर्श और थेरेपी अपनाएं।"
    },
    "es": {
        "High": "Se recomienda consulta médica prioritaria para evaluación diagnóstica integral (HbA1c / perfil lipídico).",
        "Moderate": "Intervención estructurada en estilo de vida: 150 min/semana de ejercicio aeróbico y nutrición óptima.",
        "Low": "Mantenga su calendario de chequeos médicos preventivos anuales.",
        "bp": "Protocolo de monitoreo domiciliario de la presión arterial.",
        "bmi": "Terapia nutricional médica y control de peso.",
        "smoke": "Asesoramiento para dejar de fumar basado en evidencia."
    },
    "fr": {
        "High": "Consultation clinique prioritaire recommandée pour un bilan diagnostique complet (HbA1c / profil lipidique).",
        "Moderate": "Optimisation du mode de vie : 150 min/semaine d'exercice aérobie et alimentation saine.",
        "Low": "Poursuivez le calendrier habituel des bilans de santé annuels préventifs.",
        "bp": "Surveillance tensionnelle quotidienne à domicile.",
        "bmi": "Prise en charge nutritionnelle et gestion du poids.",
        "smoke": "Accompagnement au sevrage tabagique."
    },
    "de": {
        "High": "Vorrangige klinische Konsultation für umfassende Diagnostik empfohlen (HbA1c / Lipidprofil).",
        "Moderate": "Strukturierte Lebensstilintervention: 150 Min./Woche aerobes Training und ausgewogene Ernährung.",
        "Low": "Regelmäßige jährliche präventive Routineuntersuchungen beibehalten.",
        "bp": "Tägliches Blutdruckmonitoring zu Hause empfohlen.",
        "bmi": "Medizinische Ernährungstherapie und Gewichtsmanagement.",
        "smoke": "Evidenzbasierte Tabakentwöhnungsberatung."
    },
    "bn": {
        "High": "সম্পূর্ণ ডায়াগনস্টিক পরীক্ষার (HbA1c / লিপিড প্যানেল) জন্য অবিলম্বে বিশেষজ্ঞ চিকিৎসকের পরামর্শ নিন।",
        "Moderate": "জীবনযাত্রা নিয়ন্ত্রণ করুন: সপ্তাহে ১৫০ মিনিট ব্যায়াম এবং সুষম খাদ্যাভ্যাস।",
        "Low": "নিয়মিত বার্ষিক স্বাস্থ্য পরীক্ষা বজায় রাখুন।",
        "bp": "নিয়মিত রক্তচাপ পর্যবেক্ষণ করুন।",
        "bmi": "ওজন নিয়ন্ত্রণ ও পুষ্টিবিদের পরামর্শ গ্রহণ করুন।",
        "smoke": "ধূমপান ত্যাগের জন্য চিকিৎসকের সাহায্য নিন।"
    }
}

class LanguageService:
    @staticmethod
    def get_supported_languages() -> List[Dict[str, str]]:
        return list(SUPPORTED_LANGUAGES.values())

    @staticmethod
    def is_supported(lang_code: str) -> bool:
        return lang_code.lower() in SUPPORTED_LANGUAGES

    @staticmethod
    def get_localized_recommendations(
        risk_category: str,
        data_dict: Dict[str, Any],
        language: str = "en"
    ) -> List[str]:
        """Returns clinical recommendations localized to the target language"""
        lang = language.lower()
        if lang not in RECOMMENDATIONS_TRANSLATIONS:
            # English standard default
            recs = [
                "Priority clinical consultation recommended for comprehensive diagnostic workup (HbA1c / Lipid panel)."
                if risk_category == "High" else
                "Structured lifestyle intervention: 150 min/week moderate aerobic activity and dietary optimization."
                if risk_category == "Moderate" else
                "Maintain routine annual preventive health check-up schedule."
            ]
            if data_dict.get("HighBP") == 1:
                recs.append("Daily automated blood pressure logging (target < 130/80 mmHg).")
            if data_dict.get("BMI", 25) >= 30.0:
                recs.append("Structured metabolic weight-management program and registered dietitian referral.")
            if data_dict.get("Smoker") == 1:
                recs.append("Enrollment in evidence-based tobacco cessation therapy.")
            return recs

        trans = RECOMMENDATIONS_TRANSLATIONS[lang]
        recs = [trans.get(risk_category, trans["Low"])]
        if data_dict.get("HighBP") == 1:
            recs.append(trans["bp"])
        if data_dict.get("BMI", 25) >= 30.0:
            recs.append(trans["bmi"])
        if data_dict.get("Smoker") == 1:
            recs.append(trans["smoke"])

        return recs

language_service = LanguageService()
