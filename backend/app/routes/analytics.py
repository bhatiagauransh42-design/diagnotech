from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Model Analytics & Quantum Benchmarks"])

@router.get("/comparison/{disease}")
def get_comparison(disease: str):
    """
    Returns comparative evaluation metrics across 5 candidate algorithms:
    Logistic Regression, Decision Tree, Random Forest, SVM, and XGBoost.
    """
    if disease not in ["diabetes", "cardiovascular", "cvd"]:
        raise HTTPException(status_code=404, detail="Disease must be 'diabetes' or 'cardiovascular'")
    return analytics_service.get_model_comparison(disease)

@router.get("/curves/{disease}")
def get_curves(disease: str):
    """
    Returns ROC and Precision-Recall curve coordinates, plus global SHAP feature importance rankings.
    """
    if disease not in ["diabetes", "cardiovascular", "cvd"]:
        raise HTTPException(status_code=404, detail="Disease must be 'diabetes' or 'cardiovascular'")
    return analytics_service.get_model_curves(disease)

@router.get("/quantum")
def get_quantum_benchmark():
    """
    Returns comparative Quantum Machine Learning benchmark:
    QSVC with 6-qubit ZZFeatureMap fidelity kernel vs Classical Random Forest and XGBoost baselines.
    """
    return analytics_service.get_quantum_benchmark()

@router.get("/data/{disease}/preview")
def get_dataset_preview(disease: str, limit: int = 100):
    """
    Returns JSON preview of the 15,000-record CDC dataset containing first N rows, columns, and metadata.
    """
    if disease not in ["diabetes", "cardiovascular", "cvd"]:
        raise HTTPException(status_code=404, detail="Disease must be 'diabetes' or 'cardiovascular'")
    return analytics_service.get_dataset_preview(disease, limit=limit)

@router.get("/data/{disease}")
def get_training_data(
    disease: str,
    request: Request,
    download: bool = False,
    format: str = "auto",
    view: str = ""
):
    """
    Returns the genuine 15,000-record CDC BRFSS training & evaluation dataset:
    - If viewed directly in browser (or format=html / view=html): renders interactive web dataset viewer with search & column definitions.
    - If format=json: returns JSON preview with metadata and sample rows.
    - If download=True, format=csv, or requested as file download: delivers full CSV dataset.
    """
    if disease not in ["diabetes", "cardiovascular", "cvd"]:
        raise HTTPException(status_code=404, detail="Disease must be 'diabetes' or 'cardiovascular'")
    
    disease_norm = "cardiovascular" if disease in ["cardiovascular", "cvd"] else "diabetes"
    fpath = analytics_service.get_dataset_file(disease_norm)
    if not fpath.exists():
        raise HTTPException(status_code=404, detail=f"Dataset file {fpath.name} not found on server")

    if format == "json":
        return analytics_service.get_dataset_preview(disease_norm)

    accept_header = request.headers.get("accept", "")
    wants_html = (view == "html") or (format == "html") or (format == "auto" and not download and "text/html" in accept_header)

    if wants_html:
        html_content = analytics_service.get_dataset_viewer_html(disease_norm)
        return HTMLResponse(content=html_content, status_code=200)

    disease_label = "diabetes" if disease_norm == "diabetes" else "cardiovascular"
    filename = f"cdc_{disease_label}_training_dataset_15000.csv"
    return FileResponse(
        path=str(fpath),
        media_type="text/csv",
        filename=filename,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/evidence/metadata")
def get_evidence_metadata():
    """
    Returns structured catalog of peer-reviewed research papers, training datasets, and mathematical proof formulations.
    """
    return analytics_service.get_evidence_metadata()

@router.get("/evidence", response_class=HTMLResponse)
def get_evidence_page():
    """
    Returns the complete standalone HTML dossier documenting research papers, training datasets, and empirical proofs.
    """
    html_content = analytics_service.get_evidence_html()
    return HTMLResponse(content=html_content, status_code=200)

