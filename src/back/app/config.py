from typing import Union
from pydantic import field_validator
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

    JWT_SEGREDO: str = "troque-este-segredo-no-arquivo-env-por-um-texto-longo"
    JWT_EXPIRA_MINUTOS: int = 120

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORTA: int = 587
    SMTP_USUARIO: str = ""
    SMTP_SENHA: str = ""
    EMAIL_REMETENTE: str = ""

    @field_validator("DATABASE_URL")
    @classmethod
    def usar_driver_psycopg(cls, url: str) -> str:
        """Aceita o endereço como os provedores o entregam (postgres:// ou postgresql://)."""
        for inicio in ("postgres://", "postgresql://"):
            if url.startswith(inicio):
                return "postgresql+psycopg://" + url.removeprefix(inicio)
        return url

    @property
    def cors_origins_list(self) -> list[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        return [orig.strip() for orig in self.CORS_ORIGINS.split(",") if orig.strip()]


settings = Settings()
