from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Marketing AI Backend"
    app_env: str = "development"
    debug: bool = True
    api_prefix: str = ""

    jwt_secret_key: str = Field(default="change-me-stage-secret-key-32chars-min")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db: str = "marketing_ai"

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    text_provider: Literal["mock", "anthropic", "ollama"] = "mock"
    image_provider: Literal["mock", "pollinations"] = "pollinations"
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-3-5-haiku-latest"
    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "llama3.2"
    llm_timeout_seconds: float = 120.0
    llm_max_retries: int = 2
    default_temperature: float = 0.7
    default_max_tokens: int = 1024

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
