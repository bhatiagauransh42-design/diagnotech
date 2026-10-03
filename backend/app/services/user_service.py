"""
User & Authentication Service for Diagnotech.
Handles registration, login token verification, and guest profile management.
"""

import hashlib
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from backend.app.core.config import settings
from backend.app.models.entities import User
from backend.app.services.database_service import database_service

class UserService:
    @staticmethod
    def hash_password(password: str) -> str:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return UserService.hash_password(plain_password) == hashed_password

    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRATION_HOURS)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    @staticmethod
    def decode_token(token: str) -> Optional[Dict[str, Any]]:
        try:
            return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        except Exception:
            return None

    @staticmethod
    def register_user(db: Session, name: str, email: str, password: str, language: str = "en") -> User:
        existing = database_service.get_user_by_email(db, email)
        if existing:
            raise ValueError(f"User with email {email} already registered.")
        hashed = UserService.hash_password(password)
        return database_service.create_user(db, name=name, email=email, password_hash=hashed, language=language)

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        user = database_service.get_user_by_email(db, email)
        if not user or not user.password_hash:
            return None
        if not UserService.verify_password(password, user.password_hash):
            return None
        return user

user_service = UserService()
