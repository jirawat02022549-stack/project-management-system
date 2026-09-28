from pydantic import BaseModel
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "ProjectFlow"
    database_url: str = "sqlite:///./projectflow.db"
    jwt_secret: str = "super-secret-projectflow-jwt-key-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    host: str = "0.0.0.0"
    port: int = 8000

    class Config:
        env_file = ".env"


settings = Settings()
