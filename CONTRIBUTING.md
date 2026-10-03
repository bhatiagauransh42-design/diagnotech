# Contributing to DiagnoTech

Thank you for your interest in contributing to **DiagnoTech** — the Next-Generation Explainable AI & Quantum Clinical Decision Support Platform!

We welcome contributions from clinicians, machine learning researchers, quantum computing specialists, and software engineers.

---

## 🛠️ Development Setup

### 1. Prerequisites
- **Node.js** (v18+ recommended) & `npm`
- **Python** (v3.11 or v3.12 recommended)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/bhatiagauransh42-design/diagnotech.git
cd diagnotech
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will start at `http://localhost:5173`.

### 4. Backend Setup
```bash
# In the repository root
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run_server.py
```
The FastAPI application will start at `http://localhost:8000`. Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

### 5. Retraining ML Models & Regenerating Benchmarks
```bash
python scripts/train_all.py
```
This trains:
1. Balanced Random Forest for Type-2 Diabetes (`diabetes_rf_v1.joblib`)
2. Gradient Boosted Decision Trees for Cardiovascular Disease (`cvd_xgb_v1.joblib`)
3. TreeSHAP attribution explainers
4. 6-Qubit QSVC ZZFeatureMap quantum kernel state benchmarks

---

## 🩺 Contribution Guidelines

1. **Maintain Epidemiological & Clinical Rigor**: All biometric features and thresholds must adhere to CDC BRFSS specifications and clinical consensus standards.
2. **Transparent XAI**: Every predictive output must maintain zero-leakage TreeSHAP local attributions and confidence calibration.
3. **Branching Workflow**:
   - Create a descriptive branch: `feature/quantum-kernel-optimization` or `fix/roc-curve-rendering`.
   - Commit with clear, conventional messages (`feat:`, `fix:`, `docs:`, `refactor:`).
4. **Code Quality**:
   - Ensure `npm run build` passes without errors.
   - Run python validation scripts (`python test_backend_endpoints.py`).

---

## 📄 License
By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
