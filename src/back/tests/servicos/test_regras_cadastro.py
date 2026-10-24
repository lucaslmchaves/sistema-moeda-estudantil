"""Testes das regras de cadastro compartilhadas pelos serviços."""

import pytest

from app.model.aluno import Aluno
from app.service.excecoes import Conflito, DadoInvalido
from app.service.regras_cadastro import (
    exigir_texto,
    garantir_login_livre,
    garantir_unico,
    validar_e_normalizar_cnpj,
    validar_e_normalizar_cpf,
    validar_e_normalizar_email,
    validar_senha,
)


def test_exigir_texto_remove_espacos_das_pontas():
    """Devolve o texto limpo."""
    assert exigir_texto("nome", "  Ana  ") == "Ana"


@pytest.mark.parametrize("valor", ["", "   ", None])
def test_exigir_texto_vazio_levanta_dado_invalido_com_rotulo_em_portugues(valor):
    """A mensagem cita o rótulo em português do campo."""
    with pytest.raises(DadoInvalido, match="O campo endereço não pode ficar vazio"):
        exigir_texto("endereco", valor)


def test_validar_senha_preserva_espacos_digitados():
    """A senha nunca é alterada."""
    assert validar_senha("  senha com espaço  ") == "  senha com espaço  "


@pytest.mark.parametrize("senha", ["", "        ", None])
def test_validar_senha_vazia_levanta_dado_invalido(senha):
    """Recusa senha vazia ou só com espaços."""
    with pytest.raises(DadoInvalido, match="A senha não pode ser vazia"):
        validar_senha(senha)


@pytest.mark.parametrize("senha", ["curta", "x" * 73])
def test_validar_senha_fora_do_tamanho_levanta_dado_invalido(senha):
    """Recusa senha com menos de 8 ou mais de 72 caracteres."""
    with pytest.raises(DadoInvalido, match="entre 8 e 72 caracteres"):
        validar_senha(senha)


def test_validar_senha_nova_usa_mensagem_de_nova_senha():
    """Na troca de senha a mensagem fala em nova senha."""
    with pytest.raises(DadoInvalido, match="A nova senha deve conter"):
        validar_senha("curta", nova=True)


def test_validar_email_normaliza_e_recusa_formato_invalido():
    """Devolve em minúsculas ou recusa."""
    assert validar_e_normalizar_email("  Ana@Teste.COM ") == "ana@teste.com"
    with pytest.raises(DadoInvalido, match="E-mail inválido"):
        validar_e_normalizar_email("sem-arroba")


def test_validar_cpf_devolve_so_digitos_e_recusa_invalido():
    """Aceita máscara e recusa dígitos errados."""
    assert validar_e_normalizar_cpf("529.982.247-25") == "52998224725"
    with pytest.raises(DadoInvalido, match="CPF inválido"):
        validar_e_normalizar_cpf("111.111.111-11")


def test_validar_cnpj_devolve_so_digitos_e_recusa_invalido():
    """Aceita máscara e recusa dígitos errados."""
    assert validar_e_normalizar_cnpj("11.444.777/0001-61") == "11444777000161"
    with pytest.raises(DadoInvalido, match="CNPJ inválido"):
        validar_e_normalizar_cnpj("11.111.111/1111-11")


def test_garantir_unico_ignora_o_proprio_registro():
    """O registro encontrado só conflita se for de outro usuário."""
    dono = Aluno(id_usuario=7)

    garantir_unico(None, "CPF")
    garantir_unico(dono, "CPF", id_proprio=7)
    with pytest.raises(Conflito, match="O CPF informado já está cadastrado"):
        garantir_unico(dono, "CPF", id_proprio=8)


def test_garantir_login_livre_recusa_login_existente():
    """Login já usado levanta Conflito."""
    garantir_login_livre(None)
    with pytest.raises(Conflito, match="login informado já está em uso"):
        garantir_login_livre(Aluno(id_usuario=1))
