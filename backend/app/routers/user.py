from app.schemas.users import UserResponse, UserCreate
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID


router = APIRouter()


@router.get("/users", response_model=UserResponse)
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users
