import os
from fastapi import FastAPI
from app.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS, settings
from app.routers.user import router as user_router
from app.routers.p_table import router as p_tables_router
from app.routers.auth import router as auth_router
from app.routers.search import router as search_router
from app.routers.match import router as matches_router
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

app.include_router(user_router)
app.include_router(p_tables_router)
app.include_router(auth_router)
app.include_router(search_router)
app.include_router(matches_router)

# ✅ Only mount if directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/health")
def health():
    return {"status": "ok", "port": os.environ.get("PORT", "NOT SET")}
