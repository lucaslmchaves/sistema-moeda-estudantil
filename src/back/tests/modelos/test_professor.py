"""Testes unitários das operações específicas da entidade Professor."""

from app.model.conta import Conta
from app.model.enums import TipoUsuario
from app.model.professor import Professor


def test_professor_receber_credito_semestral_incrementa_saldo():
    """Valida se o crédito semestral adiciona exatamente 1000 moedas ao saldo da conta."""
    conta = Conta(id_usuario=10, saldo=500)
    professor = Professor(
        id_usuario=10,
        login="prof.teste",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.PROFESSOR,
        ativo=True,
        nome="Professor Teste",
        cpf="11144477735",
        departamento="Computação",
        id_instituicao=1,
    )
    professor.conta = conta

    assert professor.CREDITO_SEMESTRAL == 1000
    assert professor.receber_credito_semestral() is True
    assert conta.consultar_saldo() == 1500


def test_professor_receber_credito_semestral_sem_conta_retorna_false():
    """Verifica que o método retorna False de forma segura quando o professor não possui conta vinculada."""
    professor = Professor(
        id_usuario=11,
        login="prof.sem.conta",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.PROFESSOR,
        ativo=True,
        nome="Professor Sem Conta",
        cpf="22255588846",
        departamento="Computação",
        id_instituicao=1,
    )
    assert professor.receber_credito_semestral() is False
