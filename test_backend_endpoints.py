import sys
sys.stdout.reconfigure(encoding='utf-8')

import asyncio
import io
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_all():
    print("--- 1. Testing GET /health ---")
    res = client.get("/api/v1/health")
    assert res.status_code == 200, res.text
    print("Health:", res.json())

    print("\n--- 2. Testing GET /api/v1/language/supported ---")
    res = client.get("/api/v1/language/supported")
    assert res.status_code == 200
    print("Supported Languages Count:", len(res.json()))

    print("\n--- 3. Testing POST /api/v1/predict/diabetes (English) ---")
    payload = {
        "HighBP": 1, "HighChol": 1, "CholCheck": 1, "BMI": 31.4,
        "Smoker": 0, "Stroke": 0, "HeartDiseaseorAttack": 0,
        "PhysActivity": 1, "Fruits": 1, "Veggies": 1, "HvyAlcoholConsump": 0,
        "GenHlth": 3, "MentHlth": 2, "PhysHlth": 2, "DiffWalk": 0,
        "Sex": 1, "Age": 7
    }
    res = client.post("/api/v1/predict/diabetes?language=en", json=payload)
    assert res.status_code == 200, res.text
    d_json = res.json()
    print("Model Version:", d_json["model_version"])
    print("Risk Tier:", d_json["risk_category"], "| Calibrated Probability:", d_json["probability"], "| Score:", d_json["score"])
    print("AI Explanation (EN):", d_json["ai_explanation"][:120], "...")

    print("\n--- 4. Testing POST /api/v1/predict/diabetes (Hindi) ---")
    res = client.post("/api/v1/predict/diabetes?language=hi", json=payload)
    assert res.status_code == 200
    d_hi = res.json()
    print("AI Explanation (HI preview):", d_hi["ai_explanation"][:100], "...")
    print("Localized Recs (HI):", len(d_hi["clinical_recommendations"]))

    print("\n--- 5. Testing POST /api/v1/predict/cvd ---")
    cvd_payload = {
        "HighBP": 1, "HighChol": 1, "CholCheck": 1, "BMI": 33.2,
        "Smoker": 1, "Stroke": 0, "Diabetes_binary": 1,
        "PhysActivity": 0, "Fruits": 0, "Veggies": 1, "HvyAlcoholConsump": 0,
        "GenHlth": 4, "MentHlth": 5, "PhysHlth": 10, "DiffWalk": 1,
        "Sex": 1, "Age": 10
    }
    res = client.post("/api/v1/predict/cvd?language=en", json=cvd_payload)
    assert res.status_code == 200, res.text
    cvd_json = res.json()
    print("CVD Model Version:", cvd_json["model_version"])
    print("CVD Risk:", cvd_json["risk_category"], "| Prob:", cvd_json["probability"])

    print("\n--- 6. Testing POST /api/v1/predict/combined ---")
    res = client.post("/api/v1/predict/combined?language=en", json=payload)
    assert res.status_code == 200
    comb_json = res.json()
    print("Combined Overall Risk:", comb_json["overall_risk_category"], "| Score:", comb_json["overall_risk_score"])

    print("\n--- 7. Testing POST /api/v1/ai/question (Educational Assistant) ---")
    res = client.post("/api/v1/ai/question", json={"question": "What is HbA1c and how does it relate to diabetes?", "language": "en"})
    assert res.status_code == 200
    print("AI Q&A Response:", res.json()["response"][:140], "...")

    print("\n--- 8. Testing POST /api/v1/reports/analyze ---")
    sample_pdf_text = (
        "METABOLIC LAB REPORT - GENERAL HOSPITAL\n"
        "Patient: John Doe, Age: 52 y/o, Sex: Male\n"
        "BMI: 29.8 kg/m2\n"
        "Blood Pressure: 142/90 mmHg\n"
        "Fasting Blood Glucose: 138 mg/dL\n"
        "HbA1c: 6.9 %\n"
        "Total Cholesterol: 224 mg/dL\n"
        "Smoking: Non-smoker\n"
        "Clinical impression: Mild hyperlipidemia and impaired fasting glucose."
    )
    from reportlab.pdfgen import canvas
    buf = io.BytesIO()
    c = canvas.Canvas(buf)
    for i, line in enumerate(sample_pdf_text.split("\n")):
        c.drawString(100, 750 - (i * 25), line)
    c.save()
    buf.seek(0)

    files = {"file": ("patient_lab_report.pdf", buf.read(), "application/pdf")}
    res = client.post("/api/v1/reports/analyze", files=files)
    assert res.status_code == 200, res.text
    rep_json = res.json()
    print("Report ID:", rep_json["report_id"])
    print("Extracted Biometrics:", rep_json["extracted_biometrics"])
    print("Mapped Form Features:", rep_json["mapped_form_data"])

    print("\n--- 9. Testing Auth (Register + Login) ---")
    import time
    auth_email = f"test_doc_{int(time.time())}@diagnotech.org"
    reg_res = client.post("/api/v1/auth/register", json={
        "name": "Dr. Sarah Mitchell",
        "email": auth_email,
        "password": "SecurePassword123!",
        "language": "en"
    })
    assert reg_res.status_code == 200, reg_res.text
    print("Registered user:", reg_res.json()["user"]["name"])

    print("\n--- 10. Testing GET /api/v1/models ---")
    res = client.get("/api/v1/models")
    assert res.status_code == 200
    print("Models count:", len(res.json()))

    print("\n[ALL 10 BACKEND VERIFICATION CHECKS PASSED SUCCESSFULLY!]")

if __name__ == "__main__":
    test_all()
