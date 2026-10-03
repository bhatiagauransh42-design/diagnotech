import os
from pathlib import Path
from typing import List

try:
    from dotenv import load_dotenv
    _CONFIG_DIR = Path(__file__).resolve().parent.parent.parent
    load_dotenv(_CONFIG_DIR.parent / ".env")
    load_dotenv(_CONFIG_DIR / ".env")
    load_dotenv(_CONFIG_DIR.parent / ".env.local")
except ImportError:
    pass

class Settings:
    PROJECT_NAME: str = "Diagnotech AI Screening & Clinical Decision Support"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "2.0.0"
    
    # Base paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    MODELS_DIR: Path = BASE_DIR / "models"
    DATASETS_DIR: Path = BASE_DIR.parent / "datasets"
    STORAGE_DIR: Path = Path("/tmp/storage") if os.getenv("VERCEL") else (BASE_DIR / "storage")
    TEMP_UPLOADS_DIR: Path = STORAGE_DIR / "temp_reports"
    
    # AI API Configuration (Never exposed to frontend)
    AI_API_KEY: str = os.getenv(
        "AI_API_KEY",
        os.getenv(
            "OPENROUTER_API_KEY",
            os.getenv(
                "GEMINI_API_KEY",
                os.getenv(
                    "GROQ_API_KEY",
                    os.getenv("OPENAI_API_KEY", "")
                )
            )
        )
    )
    MODEL_PROVIDER: str = os.getenv("MODEL_PROVIDER", "auto").lower() # "openrouter", "gemini", "groq", "openai", or "auto"
    MODEL_NAME: str = os.getenv("MODEL_NAME", "")
    AI_BASE_URL: str = os.getenv("AI_BASE_URL", "")
    
    # Upload limits
    MAX_UPLOAD_SIZE_MB: int = 15
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".png", ".jpg", ".jpeg", ".webp"]
    
    # JWT / Auth Secret
    JWT_SECRET: str = os.getenv("JWT_SECRET", "diagnotech-quantum-ai-secure-secret-key-2026")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # Disclaimer
    DISCLAIMER: str = (
        "Diagnotech is an AI-assisted screening and decision-support system. "
        "Outputs represent probabilistic risk estimates and should not be used as a standalone medical diagnosis. "
        "Always consult a qualified healthcare provider for clinical evaluation."
    )

settings = Settings()
# Ensure required storage dirs exist
try:
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    os.makedirs(settings.TEMP_UPLOADS_DIR, exist_ok=True)
except Exception:
    pass

