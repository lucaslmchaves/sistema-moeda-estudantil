"""Testes dos validadores de documentos e e-mail."""

import pytest

from app.service.validadores import (
    normalizar_cnpj,
    normalizar_cpf,
    normalizar_email,
    validar_cnpj,
    validar_cpf,
    validar_email,
)


@pytest.mark.parametrize("cpf", ["529.982.247-25", "52998224725", "390.533.447-05"])
def test_validar_cpf_aceita_cpfs_validos_com_ou_sem_mascara(cpf):
    """Aceita CPFs com dígitos verificadores corretos."""
    assert validar_cpf(cpf) is True


@pytest.mark.parametrize(
    "cpf", ["", "123", "111.111.111-11", "529.982.247-26", "abcdefghijk", "5299822472"]
)
def test_validar_cpf_recusa_cpfs_invalidos(cpf):
    """Recusa vazio, curto, repetido e com dígito errado."""
    assert validar_cpf(cpf) is False


@pytest.mark.parametrize("cnpj", ["11.444.777/0001-61", "11444777000161", "11.222.333/0001-81"])
def test_validar_cnpj_aceita_cnpjs_validos_com_ou_sem_mascara(cnpj):
    """Aceita CNPJs com dígitos verificadores corretos."""
    assert validar_cnpj(cnpj) is True


@pytest.mark.parametrize("cnpj", ["", "123", "11.111.111/1111-11", "11.444.777/0001-62"])
def test_validar_cnpj_recusa_cnpjs_invalidos(cnpj):
    """Recusa vazio, curto, repetido e com dígito errado."""
    assert validar_cnpj(cnpj) is False


@pytest.mark.parametrize("email", ["ana@teste.com", "a.b-c@dominio.com.br", "ana+aluno@gmail.com"])
def test_validar_email_aceita_formatos_comuns(email):
    """Aceita e-mails de formato comum."""
    assert validar_email(email) is True


@pytest.mark.parametrize("email", ["", "sem-arroba", "@sem-usuario.com", "ana@", "ana@dominio"])
def test_validar_email_recusa_formatos_invalidos(email):
    """Recusa e-mails sem usuário, domínio ou arroba."""
    assert validar_email(email) is False


def test_normalizadores_tiram_pontuacao_e_padronizam_caixa():
    """CPF e CNPJ ficam só com dígitos e o e-mail em minúsculas."""
    assert normalizar_cpf("529.982.247-25") == "52998224725"
    assert normalizar_cnpj("11.444.777/0001-61") == "11444777000161"
    assert normalizar_email("  Ana@Teste.COM ") == "ana@teste.com"
