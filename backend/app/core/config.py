import os
import secrets
import logging
from typing import Optional
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(BASE_DIR, ".env")

# Force load environment variables from the .env file into os.environ
if os.path.exists(env_path):
    load_dotenv(env_path, override=True)
else:
    logger.warning(f".env file not found at {env_path}")

class Settings(BaseSettings):
    PROJECT_NAME: str = "MindCare API"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "sqlite:///./mindcare.db"
    GEMINI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(env_file=env_path, extra="ignore")

settings = Settings()

if not settings.GEMINI_API_KEY:
    logger.error("Startup Validation Error: GEMINI_API_KEY is not configured on the server.")
else:
    logger.info("Startup Validation Success: GEMINI_API_KEY is loaded.")
