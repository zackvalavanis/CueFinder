from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from uuid import UUID
from app.schemas.p_tables import PTablesResponse
from typing import List


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str


class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    p_tables: List[PTablesResponse] = []

    model_config = ConfigDict(from_attributes=True)


class UserCreate(UserBase):
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
