"""Tipos anotados reutilizáveis com restrições de comprimento para validação Pydantic."""

from typing import Annotated
from pydantic import StringConstraints

from app.service.regras_cadastro import SENHA_TAMANHO_MAXIMO, SENHA_TAMANHO_MINIMO

TipoNome = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=150)]
TipoEmail = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=150)]
TipoCpf = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=14)]
TipoRg = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=20)]
TipoEndereco = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)
]
TipoCurso = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
TipoLogin = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=60)]
TipoCnpj = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=18)]
TipoSenha = Annotated[
    str,
    StringConstraints(
        strip_whitespace=False, min_length=SENHA_TAMANHO_MINIMO, max_length=SENHA_TAMANHO_MAXIMO
    ),
]


def validar_senha_sem_espacos(v: str | None) -> str | None:
    """Rejeita senhas preenchidas exclusivamente por caracteres de espaço em branco."""
    if v is not None and not v.strip():
        raise ValueError("A senha não pode ser vazia ou conter apenas espaços.")
    return v
