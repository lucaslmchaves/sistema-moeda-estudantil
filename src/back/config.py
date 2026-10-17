from typing import Union
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações da aplicação lidas de variáveis de ambiente."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/moeda_estudantil"
    CORS_ORIGINS: Union[list[str], str] = (
        "http://localhost:3000,http://localhost:5173,http://localhost:8000"
    )

    @property
    def cors_origins_list(self) -> list[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        return [orig.strip() for orig in self.CORS_ORIGINS.split(",") if orig.strip()]


settings = Settings()
