from app.schemas.users import UserResponse, UserCreate, UserUpdate
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.auth import get_current_user
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from uuid import UUID
from app.utils.auth import hash_password, get_current_user
import os
import shutil


router = APIRouter()
UPLOAD_FOLDER = "uploads/profiles"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


@router.patch("/users/me", response_model=UserResponse)
def update_user(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/users/me", response_model=UserResponse)
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


@router.post("/users/me/profile-photo")
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 1. FIX: Guard against missing or empty filenames
    if not file.filename or "." not in file.filename:
        raise HTTPException(status_code=400, detail="Invalid file filename.")

    # Block unsafe file extensions
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["png", "jpg", "jpeg", "webp"]:
        raise HTTPException(
            status_code=400, detail="Only PNG, JPG, or WEBP files are allowed."
        )

    # 2. Prevent naming collisions by using the User UUID string
    safe_filename = f"user_{current_user.id}.{ext}"
    destination_path = os.path.join(UPLOAD_FOLDER, safe_filename)

    # 3. Stream and write the raw binary chunks to your hard drive
    try:
        with open(destination_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    # 4. Save the file path string into your user column
    db_path = f"/uploads/profiles/{safe_filename}"
    current_user.profile_photo = db_path
    db.commit()

    return {"status": "success", "profile_photo_url": db_path}
