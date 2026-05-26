from app.schemas.users import UserResponse, UserCreate
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.auth import get_current_user
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID


router = APIRouter()


@router.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


@router.get("users/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
