"""Testes das configurações lidas do ambiente."""

import pytest

from app.config import Settings


@pytest.mark.parametrize(
    "entrada",
    [
        "postgres://u:s@host/banco?sslmode=require",
        "postgresql://u:s@host/banco?sslmode=require",
        "postgresql+psycopg://u:s@host/banco?sslmode=require",
    ],
)
def test_endereco_do_banco_sempre_usa_o_driver_psycopg(entrada: str):
    """O endereço copiado do provedor (Neon, Render) funciona sem ajuste manual."""
    configuracao = Settings(DATABASE_URL=entrada)

    assert configuracao.DATABASE_URL == "postgresql+psycopg://u:s@host/banco?sslmode=require"
