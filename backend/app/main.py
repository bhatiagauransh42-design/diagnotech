from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.database import engine, Base, SessionLocal, init_db
from backend.app.models.entities import ModelMetadata
from backend.app.services.database_service import database_service
from backend.app.routes import (
    health, predict, models, analytics,
    reports, ai, auth, language
)

# Initialize database schema immediately on import
init_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist
    init_db()
    
    # Register production quantum model metadata in DB
    try:
        with SessionLocal() as db:
            database_service.register_model_metadata(
                db=db,
                model_version="QKSVM-DIABETES-v1",
                dataset_version="CDC-BRFSS-2021-v1",
                feature_list=[
                    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke",
                    "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies",
                    "HvyAlcoholConsump", "GenHlth", "MentHlth", "PhysHlth",
                    "DiffWalk", "Sex", "Age"
                ],
                preprocessing_version="std_selectkbest_pca6_minmaxpi_v1",
                model_type="Quantum Kernel + Classical SVM"
            )
            database_service.register_model_metadata(
                db=db,
                model_version="QKSVM-CVD-v1",
                dataset_version="CDC-BRFSS-2021-v1",
                feature_list=[
                    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke",
                    "Diabetes_binary", "PhysActivity", "Fruits", "Veggies",
                    "HvyAlcoholConsump", "GenHlth", "MentHlth", "PhysHlth",
                    "DiffWalk", "Sex", "Age"
                ],
                preprocessing_version="std_selectkbest_pca6_minmaxpi_v1",
                model_type="Quantum Kernel + Classical SVM"
            )
    except Exception as e:
        print(f"[WARN] Could not seed model metadata to DB: {e}")

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Explainable AI Screening & Clinical Decision Support System for "
        "Diabetes and Cardiovascular Disease, powered by Quantum Kernel Support Vector Classifiers "
        "(QSVC 6-qubit ZZFeatureMap) with External AI Document Understanding, Multilingual Processing, "
        "and Local Interpretability."
    ),
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(predict.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(language.router, prefix=settings.API_V1_STR)
app.include_router(models.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)

@app.get("/docs", include_in_schema=False)
def docs_redirect():
    return RedirectResponse(url=f"{settings.API_V1_STR}/docs")

@app.get("/redoc", include_in_schema=False)
def redoc_redirect():
    return RedirectResponse(url=f"{settings.API_V1_STR}/redoc")

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "architecture": "Quantum Kernel + Classical SVM + External AI Layer",
        "api_docs": f"{settings.API_V1_STR}/docs",
        "health_check": f"{settings.API_V1_STR}/health",
        "disclaimer": settings.DISCLAIMER
    }
