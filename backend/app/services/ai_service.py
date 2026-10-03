"""
External AI Service for Diagnotech.
Provides secure, server-side external AI integration for:
1. Medical document understanding & parameter extraction into strict JSON.
2. Clinical prediction explanations in user's selected language.
3. Educational health Q&A assistance in user's selected language.

Supported Providers: Google Gemini, Groq, OpenAI / OpenAI-compatible,
with a robust Clinical Rule-Based Fallback for offline/zero-API-key resilience.
"""

import os
import re
import json
import httpx
from typing import Dict, Any, Optional
from backend.app.core.config import settings

class AIService:
    def __init__(self):
        self.api_key = settings.AI_API_KEY
        self.provider = settings.MODEL_PROVIDER
        self.model_name = settings.MODEL_NAME
        self.base_url = settings.AI_BASE_URL
        self._detect_provider()

    def _detect_provider(self):
        """Auto-detect provider if set to 'auto'"""
        if self.provider == "auto":
            if self.api_key.startswith("sk-or-v1-") or "openrouter" in (self.base_url or "").lower():
                self.provider = "openrouter"
                if not self.model_name:
                    self.model_name = "openai/gpt-4o-mini"
            elif self.api_key.startswith("gsk_"):
                self.provider = "groq"
                if not self.model_name:
                    self.model_name = "llama-3.3-70b-versatile"
            elif self.api_key.startswith("AIza"):
                self.provider = "gemini"
                if not self.model_name:
                    self.model_name = "gemini-1.5-flash"
            elif self.api_key.startswith("sk-"):
                self.provider = "openai"
                if not self.model_name:
                    self.model_name = "gpt-4o-mini"
            else:
                self.provider = "fallback"
        
        if not self.model_name:
            if self.provider == "gemini":
                self.model_name = "gemini-1.5-flash"
            elif self.provider == "groq":
                self.model_name = "llama-3.3-70b-versatile"
            elif self.provider == "openrouter":
                self.model_name = "openai/gpt-4o-mini"
            elif self.provider == "openai":
                self.model_name = "gpt-4o-mini"
            else:
                self.model_name = "clinical-rule-engine-v2"

    async def _call_llm(self, system_prompt: str, user_prompt: str, json_mode: bool = False) -> str:
        """Invokes external AI API with timeout and error fallback"""
        if not self.api_key or self.provider == "fallback":
            raise ValueError("No external AI API key configured, routing to clinical rule fallback.")

        async with httpx.AsyncClient(timeout=25.0) as client:
            if self.provider == "gemini":
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [
                        {"role": "user", "parts": [{"text": f"{system_prompt}\n\n{user_prompt}"}]}
                    ],
                    "generationConfig": {
                        "temperature": 0.2,
                        "responseMimeType": "application/json" if json_mode else "text/plain"
                    }
                }
                resp = await client.post(url, json=payload)
                resp.raise_for_status()
                data = resp.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]

            elif self.provider in ["groq", "openai", "openrouter"]:
                if self.provider == "groq":
                    endpoint = self.base_url or "https://api.groq.com/openai/v1/chat/completions"
                elif self.provider == "openrouter":
                    endpoint = self.base_url or "https://openrouter.ai/api/v1/chat/completions"
                else:
                    endpoint = self.base_url or "https://api.openai.com/v1/chat/completions"

                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                if self.provider == "openrouter":
                    headers["HTTP-Referer"] = "https://diagnotech.health"
                    headers["X-Title"] = "Diagnotech Health AI Assistant"

                payload = {
                    "model": self.model_name,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.2
                }
                if json_mode:
                    payload["response_format"] = {"type": "json_object"}

                resp = await client.post(endpoint, json=payload, headers=headers)
                resp.raise_for_status()
                data = resp.json()
                return data["choices"][0]["message"]["content"]
            else:
                raise ValueError(f"Unknown provider {self.provider}")

    # =========================================================================
    # Task A: Medical Report Understanding & Structured Extraction
    # =========================================================================
    async def extract_medical_report_data(self, document_text: str) -> Dict[str, Any]:
        """
        Converts unstructured report text into strict structured medical JSON.
        Fields: age, bmi, glucose, hba1c, systolic_bp, diastolic_bp, cholesterol, smoking, stroke, heart_disease.
        """
        system_prompt = (
            "You are an expert clinical medical laboratory data extraction assistant. "
            "Extract patient biometrics and laboratory findings from the given medical report text into a strictly valid JSON object. "
            "RULES:\n"
            "1. ONLY extract values explicitly stated or clearly indicated in the report.\n"
            "2. DO NOT fabricate, invent, or assume values that are not present. If a field is not found, set its value to null.\n"
            "3. Normalize all numeric values to standard medical units:\n"
            "   - Glucose: fasting blood sugar in mg/dL (if mmol/L, multiply by 18.0182)\n"
            "   - HbA1c: percentage (e.g. 6.5)\n"
            "   - Blood Pressure: systolic_bp and diastolic_bp in mmHg\n"
            "   - Cholesterol: total cholesterol in mg/dL (if mmol/L, multiply by 38.67)\n"
            "   - BMI: kg/m²\n"
            "   - Age: years as number\n"
            "   - Boolean fields: smoking (true/false/null), stroke (true/false/null), heart_disease (true/false/null).\n"
            "Output schema:\n"
            "{\n"
            '  "age": float or null,\n'
            '  "gender": "male" or "female" or null,\n'
            '  "bmi": float or null,\n'
            '  "glucose": float or null,\n'
            '  "hba1c": float or null,\n'
            '  "systolic_bp": float or null,\n'
            '  "diastolic_bp": float or null,\n'
            '  "cholesterol": float or null,\n'
            '  "smoking": boolean or null,\n'
            '  "stroke": boolean or null,\n'
            '  "heart_disease": boolean or null,\n'
            '  "physical_activity": boolean or null,\n'
            '  "notes": "short summary of extracted clinical findings"\n'
            "}"
        )

        try:
            raw_json_str = await self._call_llm(system_prompt, document_text, json_mode=True)
            clean_str = re.sub(r"^```json\s*", "", raw_json_str.strip())
            clean_str = re.sub(r"\s*```$", "", clean_str)
            parsed = json.loads(clean_str)
            parsed["extractor"] = f"external_ai_{self.provider}"
            return parsed
        except Exception as e:
            # Resilient clinical regex & rule extraction fallback
            return self._heuristic_extract_medical_data(document_text)

    def _heuristic_extract_medical_data(self, text: str) -> Dict[str, Any]:
        """
        Rule-based medical regex extractor when external API is unreachable.
        Adheres to strict clinical extraction without inventing values.
        """
        data: Dict[str, Any] = {
            "age": None,
            "gender": None,
            "bmi": None,
            "glucose": None,
            "hba1c": None,
            "systolic_bp": None,
            "diastolic_bp": None,
            "cholesterol": None,
            "smoking": None,
            "stroke": None,
            "heart_disease": None,
            "physical_activity": None,
            "notes": "Extracted via Diagnotech Clinical NLP Rule Parser (Resilient Fallback)",
            "extractor": "clinical_rule_engine"
        }

        # Age
        age_match = re.search(r"\b(?:age|years? old|y/o)[\s:=]*(\d{1,3})\b", text, re.IGNORECASE)
        if age_match:
            val = float(age_match.group(1))
            if 1 <= val <= 115:
                data["age"] = val

        # Gender
        if re.search(r"\b(?:sex|gender)[\s:=]*(?:male|m)\b|\bmale patient\b", text, re.IGNORECASE):
            data["gender"] = "male"
        elif re.search(r"\b(?:sex|gender)[\s:=]*(?:female|f)\b|\bfemale patient\b", text, re.IGNORECASE):
            data["gender"] = "female"

        # BMI
        bmi_match = re.search(r"\b(?:bmi|body mass index)[\s:=]*(\d{2}(?:\.\d{1,2})?)\b", text, re.IGNORECASE)
        if bmi_match:
            data["bmi"] = float(bmi_match.group(1))

        # Blood Pressure (e.g. 135/85 mmHg)
        bp_match = re.search(r"\b(?:bp|blood pressure)[\s:=]*(\d{2,3})[\s/]+(\d{2,3})\b", text, re.IGNORECASE)
        if bp_match:
            data["systolic_bp"] = float(bp_match.group(1))
            data["diastolic_bp"] = float(bp_match.group(2))
        else:
            sys_m = re.search(r"\b(?:systolic|sbp)[\s:=]*(\d{2,3})\b", text, re.IGNORECASE)
            dia_m = re.search(r"\b(?:diastolic|dbp)[\s:=]*(\d{2,3})\b", text, re.IGNORECASE)
            if sys_m: data["systolic_bp"] = float(sys_m.group(1))
            if dia_m: data["diastolic_bp"] = float(dia_m.group(1))

        # Fasting Glucose (mg/dL or mmol/L)
        glu_match = re.search(r"\b(?:glucose|fasting blood sugar|fbs)[\s:=]*(\d{2,3}(?:\.\d{1,2})?)\s*(mg/dl|mmol/l)?\b", text, re.IGNORECASE)
        if glu_match:
            val = float(glu_match.group(1))
            unit = glu_match.group(2)
            if unit and "mmol" in unit.lower():
                val = round(val * 18.0182, 1)
            data["glucose"] = val

        # HbA1c (%)
        hba1c_match = re.search(r"\b(?:hba1c|glycated hemoglobin|a1c)[\s:=]*(\d{1,2}(?:\.\d{1,2})?)\s*%?\b", text, re.IGNORECASE)
        if hba1c_match:
            data["hba1c"] = float(hba1c_match.group(1))

        # Total Cholesterol
        chol_match = re.search(r"\b(?:total cholesterol|cholesterol|chol)[\s:=]*(\d{2,3}(?:\.\d{1,2})?)\s*(mg/dl|mmol/l)?\b", text, re.IGNORECASE)
        if chol_match:
            val = float(chol_match.group(1))
            unit = chol_match.group(2)
            if unit and "mmol" in unit.lower():
                val = round(val * 38.67, 1)
            data["cholesterol"] = val

        # Smoking
        if re.search(r"\b(?:smoker|smoking|tobacco)[\s:=]*(?:yes|current|active|heavy)\b", text, re.IGNORECASE):
            data["smoking"] = True
        elif re.search(r"\b(?:smoker|smoking)[\s:=]*(?:no|never|none|non-smoker)\b", text, re.IGNORECASE):
            data["smoking"] = False

        # Stroke / Heart Disease
        if re.search(r"\b(?:stroke|cva|transient ischemic attack)\b", text, re.IGNORECASE):
            data["stroke"] = True
        if re.search(r"\b(?:myocardial infarction|heart attack|coronary artery disease|cad|chd)\b", text, re.IGNORECASE):
            data["heart_disease"] = True

        return data

    # =========================================================================
    # Task B: Multilingual AI Prediction Explanation
    # =========================================================================
    async def explain_prediction(
        self,
        disease: str,
        risk_category: str,
        probability: float,
        model_version: str,
        top_factors: list,
        language: str = "en"
    ) -> str:
        """
        Generates a concise, responsible medical AI narrative explaining the Quantum ML prediction.
        Strictly describes supplied features without hallucinating diagnoses or certainties.
        """
        lang_instruction = f"Provide the explanation strictly in the language: '{language}'." if language != "en" else "Provide the explanation in English."
        
        system_prompt = (
            "You are a clinical decision support explainability engine for Diagnotech. "
            "Explain the Quantum Kernel Machine Learning screening result in clear, objective clinical language. "
            "CONSTRAINTS:\n"
            "- Do NOT diagnose any condition or disease.\n"
            "- Do NOT invent unsupplied medical tests, symptoms, or lab values.\n"
            "- Clearly state that the result is an algorithmic probabilistic screening estimate.\n"
            "- Highlight the specific biometrics that contributed most significantly to this patient's profile.\n"
            f"- {lang_instruction}\n"
            "- Keep the explanation under 140 words, structured as 2 concise paragraphs."
        )

        factors_summary = ", ".join([f"{f['display_name']} ({f['direction'].replace('_', ' ')})" for f in top_factors[:4]])
        user_prompt = (
            f"Screening condition: {disease.title()}\n"
            f"Model Version: {model_version} (Quantum Kernel + Classical SVM)\n"
            f"Predicted Risk Tier: {risk_category} (Calibrated Probability: {probability:.1%})\n"
            f"Primary Contributory Risk Factors: {factors_summary}\n"
            f"Target Language: {language}"
        )

        try:
            return await self._call_llm(system_prompt, user_prompt, json_mode=False)
        except Exception:
            # Resilient localized template fallback
            return self._heuristic_explanation(disease, risk_category, probability, top_factors, language)

    def _heuristic_explanation(
        self,
        disease: str,
        risk_category: str,
        probability: float,
        top_factors: list,
        language: str
    ) -> str:
        """Template-based explanation when external AI is unavailable"""
        factor_names = [f.get("display_name", f.get("feature", "")) for f in top_factors[:3]]
        factors_str = ", ".join(factor_names) if factor_names else "patient biometrics"

        if language == "hi":
            return (
                f"डायग्नोप्लेटफॉर्म के क्वांटम कर्नेल एमएल मॉडल ने आपके दर्ज बायोमेट्रिक्स के आधार पर {disease} के लिए "
                f"'{risk_category}' जोखिम श्रेणी (संभाव्यता {probability:.1%}) का अनुमान लगाया है। "
                f"इस मूल्यांकन में मुख्य प्रभावकारी कारक रहे: {factors_str}। "
                f"यह केवल एक प्रारंभिक एल्गोरिद्मिक स्क्रीनिंग है, कोई अंतिम चिकित्सा निदान नहीं। कृपया सटीक चिकित्सकीय जांच के लिए योग्य डॉक्टर से परामर्श करें।"
            )
        elif language == "es":
            return (
                f"El modelo Quantum Kernel ML estimó una categoría de riesgo '{risk_category}' ({probability:.1%}) para {disease} "
                f"basándose en los biométricos procesados, principalmente influenciado por: {factors_str}. "
                f"Este resultado es una estimación probabilística de apoyo clínico y no reemplaza el diagnóstico médico profesional."
            )
        elif language == "fr":
            return (
                f"Le modèle Quantum Kernel ML a calculé une catégorie de risque '{risk_category}' ({probability:.1%}) pour {disease}, "
                f"principalement influencée par: {factors_str}. "
                f"Ceci constitue une aide au dépistage précoce et non un diagnostic médical définitif."
            )
        else:
            return (
                f"The Quantum Kernel Support Vector model produced a '{risk_category}' predicted risk profile "
                f"(calibrated probability {probability:.1%}) for {disease}, driven primarily by the patient's "
                f"specific biometric profile, notably {factors_str}. "
                f"This screening assessment reflects mathematical non-linear risk correlation from CDC surveillance data "
                f"and is intended for early clinical decision support, not standalone medical diagnosis."
            )

    # =========================================================================
    # Task C: Educational Health Questions System
    # =========================================================================
    async def answer_health_question(self, question: str, language: str = "en") -> Dict[str, Any]:
        """
        Answers general health education questions (HbA1c, BP, BMI, etc.) in the requested language.
        Does not perform autonomous diagnosis.
        """
        system_prompt = (
            "You are Diagnotech's health education assistant. Provide clear, accurate, easy-to-understand educational explanations. "
            "TOPICS: Blood glucose, HbA1c, BMI, blood pressure, cholesterol, heart disease, diabetes basics, lifestyle prevention. "
            "CONSTRAINTS:\n"
            "- Explain the clinical meaning, standard reference ranges, and healthy habits.\n"
            "- Do NOT diagnose individual users or prescribe medications.\n"
            "- Always maintain an encouraging and professional tone.\n"
            f"- Respond strictly in language: '{language}'.\n"
            "- Keep response concise (under 160 words)."
        )

        try:
            reply = await self._call_llm(system_prompt, question, json_mode=False)
            return {
                "question": question,
                "language": language,
                "response": reply,
                "provider": self.provider,
                "disclaimer": settings.DISCLAIMER
            }
        except Exception:
            return self._heuristic_question_answer(question, language)

    def _heuristic_question_answer(self, question: str, language: str) -> Dict[str, Any]:
        q_lower = question.lower()
        
        # Knowledge Base lookup for common health questions
        if "hba1c" in q_lower or "a1c" in q_lower:
            if language == "hi":
                resp = "HbA1c (ग्लाइकेटेड हीमोग्लोबिन) परीक्षण पिछले 2 से 3 महीनों के औसत रक्त शर्करा स्तर को मापता है। सामान्य स्तर 5.7% से कम होता है, 5.7% से 6.4% प्रीडायबिटीज को दर्शाता है, और 6.5% या अधिक मधुमेह की ओर इशारा करता है।"
            else:
                resp = "HbA1c (Glycated Hemoglobin) reflects average blood glucose levels over the past 2–3 months. A normal level is below 5.7%, 5.7% to 6.4% indicates prediabetes, and 6.5% or higher on two separate tests indicates diabetes."
        elif "blood pressure" in q_lower or "bp" in q_lower or "systolic" in q_lower:
            if language == "hi":
                resp = "रक्तचाप धमनियों की दीवारों पर रक्त के दबाव को मापता है। सामान्य रक्तचाप 120/80 mmHg से कम होता है। सिस्टोलिक (ऊपरी) 130 या डायस्टोलिक (निचला) 80 से अधिक होने पर उच्च रक्तचाप (हाइपरटेंशन) माना जाता है।"
            else:
                resp = "Blood pressure measures the force of blood pushing against artery walls. Normal blood pressure is under 120/80 mmHg. Elevated blood pressure is 120-129/<80, and hypertension Stage 1 begins at 130/80 mmHg."
        elif "bmi" in q_lower or "body mass" in q_lower:
            if language == "hi":
                resp = "बीएमआई (बॉडी मास इंडेक्स) वजन और ऊंचाई का अनुपात है: सामान्य वजन 18.5–24.9, अधिक वजन 25.0–29.9, और 30 या उससे अधिक मोटापा माना जाता है।"
            else:
                resp = "Body Mass Index (BMI) evaluates weight relative to height: Normal weight is 18.5–24.9 kg/m², overweight is 25.0–29.9, and obesity is 30.0 or higher."
        elif "cholesterol" in q_lower or "lipid" in q_lower:
            if language == "hi":
                resp = "कोलेस्ट्रॉल रक्त में पाया जाने वाला वसायुक्त पदार्थ है। कुल कोलेस्ट्रॉल 200 mg/dL से कम होना चाहिए। एलडीएल (खराब) कम और एचडीएल (अच्छा) कोलेस्ट्रॉल अधिक होना हृदय स्वास्थ्य के लिए बेहतर है।"
            else:
                resp = "Total cholesterol measures all cholesterol in your blood. Optimal total cholesterol is below 200 mg/dL. High LDL ('bad' cholesterol) promotes plaque buildup, while higher HDL ('good' cholesterol) is protective."
        else:
            if language == "hi":
                resp = f"यह एक सामान्य स्वास्थ्य शिक्षा प्रश्न है। संतुलित आहार, नियमित व्यायाम, वजन नियंत्रण और समय पर डॉक्टर से जांच करवाना मधुमेह और हृदय रोगों के जोखिम को काफी कम करता है।"
            else:
                resp = "Maintaining balanced nutrition (whole grains, vegetables, lean protein), achieving 150 minutes/week of moderate physical activity, avoiding tobacco, and scheduling routine annual screenings are foundational for preventing both type 2 diabetes and cardiovascular disease."

        return {
            "question": question,
            "language": language,
            "response": resp,
            "provider": "clinical_knowledge_base",
            "disclaimer": settings.DISCLAIMER
        }

ai_service = AIService()
