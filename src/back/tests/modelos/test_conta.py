"""Testes unitários de operações e regras de saldo da Conta."""

import pytest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.model.aluno import Aluno
from app.model.conta import Conta
from app.model.enums import TipoUsuario
from app.model.instituicao_ensino import InstituicaoEnsino


def test_consultar_saldo_retorna_valor_atual():
    """Valida se o método consultar_saldo devolve o saldo exato configurado."""
    conta = Conta(id_usuario=1, saldo=100)
    assert conta.consultar_saldo() == 100


def test_tem_saldo_avalia_cobertura_corretamente():
    """Verifica se tem_saldo aceita valores menores ou iguais e rejeita superiores."""
    conta = Conta(id_usuario=1, saldo=100)
    assert conta.tem_saldo(50) is True
    assert conta.tem_saldo(100) is True
    assert conta.tem_saldo(101) is False


def test_creditar_incrementa_saldo_quando_valor_positivo():
    """Garante que creditar adiciona moedas e retorna True para valores estritamente positivos."""
    conta = Conta(id_usuario=1, saldo=100)
    assert conta.creditar(50) is True
    assert conta.consultar_saldo() == 150


def test_creditar_falha_com_valor_zero_ou_negativo():
    """Verifica que creditar retorna False e mantém o saldo inalterado em valores inválidos."""
    conta = Conta(id_usuario=1, saldo=100)
    assert conta.creditar(0) is False
    assert conta.creditar(-20) is False
    assert conta.consultar_saldo() == 100


def test_debitar_decrementa_saldo_quando_ha_cobertura():
    """Verifica se debitar subtrai o montante quando o saldo é suficiente."""
    conta = Conta(id_usuario=1, saldo=100)
    assert conta.debitar(70) is True
    assert conta.consultar_saldo() == 30


def test_debitar_falha_sem_alterar_saldo_quando_insuficiente():
    """Garante que tentativa de débito superior ao saldo retorna False sem modificação."""
    conta = Conta(id_usuario=1, saldo=100)
    assert conta.debitar(150) is False
    assert conta.consultar_saldo() == 100


def test_debitar_falha_com_valor_zero_ou_negativo():
    """Verifica que debitar valores menores ou iguais a zero é rejeitado."""
    conta = Conta(id_usuario=1, saldo=100)
    assert conta.debitar(0) is False
    assert conta.debitar(-10) is False
    assert conta.consultar_saldo() == 100


def test_constraint_saldo_negativo_impede_persistencia(sessao: Session, instituicao_padrao: InstituicaoEnsino):
    """Testa se a restrição CHECK impede que contas com saldo negativo sejam salvas no banco."""
    aluno = Aluno(
        login="aluno.saldo.neg",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.ALUNO,
        ativo=True,
        nome="Aluno Saldo",
        cpf="11144477735",
        email="saldo@teste.com",
        rg="MG-000",
        endereco="Rua 0",
        curso="ES",
        id_instituicao=instituicao_padrao.id_instituicao,
    )
    sessao.add(aluno)
    sessao.commit()

    conta_invalida = Conta(id_usuario=aluno.id_usuario, saldo=-100)
    sessao.add(conta_invalida)
    with pytest.raises(IntegrityError):
        sessao.commit()
