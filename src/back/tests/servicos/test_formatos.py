"""Testes das regras de formato dos cadastros, as mesmas das telas."""

import pytest

from app.service.excecoes import DadoInvalido
from app.service.formatos import (
    curso_valido,
    endereco_valido,
    login_valido,
    nome_completo_valido,
    rg_valido,
)
from app.service.regras_cadastro import validar_senha
from app.service.validadores import validar_email


@pytest.mark.parametrize(
    "regra, texto, esperado",
    [
        (nome_completo_valido, "João D'Ávila", True),
        (nome_completo_valido, "João", False),
        (nome_completo_valido, "João 123", False),
        (rg_valido, "MG-12.345.678", True),
        (rg_valido, "abc", False),
        (endereco_valido, "Rua da Bahia, 1200, Belo Horizonte", True),
        (endereco_valido, "Praça da Liberdade, s/n", True),
        (endereco_valido, "Rua da Bahia, 1eeee", False),
        (curso_valido, "Engenharia de Software", True),
        (curso_valido, "qualquer coisa 123", False),
        (login_valido, "aluno.joao", True),
        (login_valido, "login com espaço", False),
        (validar_email, "aluno@exemplo.edu.br", True),
        (validar_email, "a..b@exemplo.com", False),
    ],
)
def test_regra_de_formato(regra, texto, esperado):
    """Cada regra aceita o formato certo e recusa o errado."""
    assert regra(texto) is esperado


def test_senha_sem_numero_e_recusada():
    """A senha precisa misturar letra e número."""
    with pytest.raises(DadoInvalido, match="uma letra e um número"):
        validar_senha("somenteletras")
