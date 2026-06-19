from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from uuid import UUID
from app.schemas.p_tables import PTablesResponse
from typing import List, Optional


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str


class UserPublic(BaseModel):
    id: UUID
    profile_phot: str | None = None
    first_name: str
    last_name: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UserResponse(UserBase):
    id: UUID
    first_name: str
    last_name: str
    created_at: datetime
    updated_at: datetime
    p_tables: List[PTablesResponse] = []
    profile_photo: str | None = None
    model_config = ConfigDict(from_attributes=True)


class UserCreate(UserBase):
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    first_name: str
    last_name: str
