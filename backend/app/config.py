from pydantic_settings import BaseSettings

CORS_ORIGINS = ["http://localhost:5173", "http://localhost:5174"]


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCES_TOKEN_EXPIRE_MINUTES = int = 1440

    class Config:
        env_file = ".env"


settings = Settings()
