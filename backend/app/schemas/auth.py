from pydantic import BaseModel, Field
from typing import Optional

class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=1)
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    language: Optional[str] = "en"

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    user_id: str
    name: str
    email: str
    language: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
