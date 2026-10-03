from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.services.user_service import user_service
from backend.app.services.database_service import database_service
from backend.app.schemas.auth import (
    UserRegisterRequest, UserLoginRequest,
    UserResponse, TokenResponse
)

router = APIRouter(prefix="/auth", tags=["User Authentication & Profiles"])

@router.post("/register", response_model=TokenResponse)
def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """Registers a new user profile with language preference."""
    try:
        user = user_service.register_user(
            db=db,
            name=req.name,
            email=str(req.email),
            password=req.password,
            language=req.language or "en"
        )
        token = user_service.create_access_token({"sub": user.user_id, "email": user.email})
        return TokenResponse(
            access_token=token,
            user=UserResponse(
                user_id=user.user_id,
                name=user.name,
                email=user.email,
                language=user.language,
                created_at=user.created_at.isoformat()
            )
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    """Authenticates user and returns JWT token."""
    user = user_service.authenticate_user(db, email=str(req.email), password=req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = user_service.create_access_token({"sub": user.user_id, "email": user.email})
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            user_id=user.user_id,
            name=user.name,
            email=user.email,
            language=user.language,
            created_at=user.created_at.isoformat()
        )
    )

@router.post("/logout")
def logout():
    """Stateless JWT logout confirmation."""
    return {"message": "Successfully logged out."}

@router.get("/me", response_model=UserResponse)
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Returns profile for currently authenticated user."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token.")

    token = authorization.split(" ")[1]
    payload = user_service.decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Token expired or invalid.")

    user = database_service.get_user_by_id(db, payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return UserResponse(
        user_id=user.user_id,
        name=user.name,
        email=user.email,
        language=user.language,
        created_at=user.created_at.isoformat()
    )
