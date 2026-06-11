from app.schemas.users import LoginRequest, TokenResponse, UserCreate
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth import verify_password, create_access_token, hash_password


router = APIRouter()


@router.post("/auth/login", response_model=TokenResponse)
def login(auth: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == auth.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(auth.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    first_name = user.first_name

    return {
        "access_token": token,
        "token_type": "bearer",
        "first_name": first_name,
        "last_name": user.last_name,
    }
