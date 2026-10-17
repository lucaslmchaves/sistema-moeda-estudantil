"""Testes unitários de autenticação e integridade da entidade Usuario."""

import pytest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from model.aluno import Aluno
from model.enums import TipoUsuario
from model.instituicao_ensino import InstituicaoEnsino
from model.usuario import Usuario
from model.seguranca import hash_senha


def test_autenticar_com_senha_correta_retorna_true():
    """Garante que a senha correta valida com sucesso contra o hash bcrypt."""
    senha_plana = "minhasenha123"
    usuario = Usuario(
        login="usuario.teste",
        senha_hash=hash_senha(senha_plana),
        tipo_usuario=TipoUsuario.ALUNO,
        ativo=True,
    )
    assert usuario.autenticar("minhasenha123") is True


def test_autenticar_com_senha_incorreta_retorna_false():
    """Garante que senhas incorretas, vazias ou com caixa diferente retornam False."""
    usuario = Usuario(
        login="usuario.teste2",
        senha_hash=hash_senha("senhaValida123"),
        tipo_usuario=TipoUsuario.ALUNO,
        ativo=True,
    )
    assert usuario.autenticar("senhaIncorreta") is False
    assert usuario.autenticar("") is False
    assert usuario.autenticar("SenhaValida123") is False


def test_constraint_cpf_duplicado_lanca_integridade(sessao: Session, instituicao_padrao: InstituicaoEnsino):
    """Testa se a restrição UNIQUE do CPF é imposta pelo banco de dados."""
    aluno1 = Aluno(
        login="aluno.cpf.um",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.ALUNO,
        ativo=True,
        nome="Aluno Um",
        cpf="11144477735",
        email="um@teste.com",
        rg="MG-1",
        endereco="Rua 1",
        curso="ES",
        id_instituicao=instituicao_padrao.id_instituicao,
    )
    sessao.add(aluno1)
    sessao.commit()

    aluno2 = Aluno(
        login="aluno.cpf.dois",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.ALUNO,
        ativo=True,
        nome="Aluno Dois",
        cpf="11144477735",
        email="dois@teste.com",
        rg="MG-2",
        endereco="Rua 2",
        curso="ES",
        id_instituicao=instituicao_padrao.id_instituicao,
    )
    sessao.add(aluno2)
    with pytest.raises(IntegrityError):
        sessao.commit()
