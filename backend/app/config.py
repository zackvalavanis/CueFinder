from pydantic_settings import BaseSettings
from pydantic import ConfigDict

CORS_ORIGINS = ["http://localhost:5173", "http://localhost:5174"]


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    model_config = ConfigDict(env_file=".env")


settings = Settings()
