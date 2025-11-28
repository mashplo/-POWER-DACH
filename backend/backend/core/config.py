try:
    from pydantic_settings import BaseSettings
except ImportError:
    # Compat fallback for environments without pydantic-settings installed yet
    from pydantic import BaseModel as BaseSettings  # type: ignore


class Settings(BaseSettings):
    PROJECT_NAME: str = "Proteinas API"
    DATABASE_URL: str | None = None
    SECRET_KEY: str | None = None
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"


settings = Settings()
