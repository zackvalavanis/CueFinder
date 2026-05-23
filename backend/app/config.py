from pydantic_settings import BaseSettings

CORS_ORIGINS = [
  "http://localhost:5173", 
   "http://localhost:5174"
]


class Settings(BaseSettings): 
  DATABASE_URL: str
  SECRET_KEY: str
  ALGORITHM: str = "HS256"
  
  class Config: 
    env_file = ".env"

settings = Settings()



