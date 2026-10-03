"""
Database session and connection management for Diagnotech.
Uses SQLite for local, embedded, zero-setup storage.
"""

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

STORAGE_DIR = Path("/tmp/storage") if os.getenv("VERCEL") else (Path(__file__).resolve().parent.parent.parent / "storage")
try:
    os.makedirs(STORAGE_DIR, exist_ok=True)
except Exception:
    pass

DB_PATH = STORAGE_DIR / "diagnotech.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# Thread-safe SQLite engine with check_same_thread=False for FastAPI concurrency
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def init_db():
    """Ensure all database tables are created"""
    import backend.app.models.entities # Ensure models are registered
    Base.metadata.create_all(bind=engine)

def get_db():
    """FastAPI Dependency for database session injection"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
