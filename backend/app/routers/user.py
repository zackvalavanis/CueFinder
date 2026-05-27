from app.schemas.users import UserResponse, UserCreate
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.auth import get_current_user
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from app.utils.auth import hash_password


router = APIRouter()


@router.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


@router.get("users/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/users", response_model=UserResponse)
def create_user(new_user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        first_name=new_user.first_name,
        last_name=new_user.last_name,
        email=new_user.email,
        hashed_password=hash_password(new_user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
