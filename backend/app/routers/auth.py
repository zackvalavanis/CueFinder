from app.schemas.users import LoginRequest, TokenResponse, UserCreate
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth import verify_password, create_access_token, hash_password
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.requests import Request
from starlette.responses import RedirectResponse
from app.models.user import User
from app.utils.auth import create_access_token
import os
from app.config import settings


router = APIRouter()

oauth = OAuth()
oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


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


@router.get("/auth/google")
async def google_login(request: Request):
    return await oauth.google.authorize_redirect(request, settings.GOOGLE_REDIRECT_URI)


@router.get("/auth/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    userinfo = token.get("userinfo")

    if not userinfo:
        raise HTTPException(
            status_code=400, detail="Failed to get user info from Google"
        )

    email = userinfo["email"]
    first_name = userinfo.get("given_name", "")
    last_name = userinfo.get("family_name", "")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            email=email, first_name=first_name, last_name=last_name, hashed_password=""
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    access_token = create_access_token({"sub": user.email})
    return RedirectResponse(f"http://localhost:5173/auth/callback?token={access_token}")
