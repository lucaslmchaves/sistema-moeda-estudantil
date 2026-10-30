"""Testes unitários da funcionalidade de extrato para Aluno e Professor."""

from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.model.aluno import Aluno
from app.model.empresa_parceira import EmpresaParceira
from app.model.enums import TipoUsuario
from app.model.envio_moedas import EnvioMoedas
from app.model.instituicao_ensino import InstituicaoEnsino
from app.model.professor import Professor
from app.model.resgate_vantagem import ResgateVantagem
from app.model.vantagem import Vantagem


def test_extrato_vazio_quando_nao_ha_transacoes(sessao: Session, instituicao_padrao: InstituicaoEnsino):
    """Verifica se o extrato retorna lista vazia quando nenhuma transação foi realizada."""
    prof = Professor(
        login="prof.extrato.vazio",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.PROFESSOR,
        ativo=True,
        nome="Professor Vazio",
        cpf="11144477735",
        departamento="Computação",
        id_instituicao=instituicao_padrao.id_instituicao,
    )
    aluno = Aluno(
        login="aluno.extrato.vazio",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.ALUNO,
        ativo=True,
        nome="Aluno Vazio",
        cpf="22255588846",
        email="vazio@aluno.com",
        rg="MG-00",
        endereco="Rua Vazia",
        curso="ES",
        id_instituicao=instituicao_padrao.id_instituicao,
    )
    sessao.add_all([prof, aluno])
    sessao.commit()

    assert prof.extrato() == []
    assert aluno.extrato() == []


def test_extrato_aluno_e_professor_com_ordenacao_decrescente(sessao: Session, instituicao_padrao: InstituicaoEnsino):
    """Garante a unificação e ordenação decrescente por data/hora do extrato."""
    prof = Professor(
        login="prof.extrato.ordem",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.PROFESSOR,
        ativo=True,
        nome="Professor Ordem",
        cpf="11144477735",
        departamento="Computação",
        id_instituicao=instituicao_padrao.id_instituicao,
    )
    aluno = Aluno(
        login="aluno.extrato.ordem",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.ALUNO,
        ativo=True,
        nome="Aluno Ordem",
        cpf="22255588846",
        email="ordem@aluno.com",
        rg="MG-99",
        endereco="Rua Ordem",
        curso="ES",
        id_instituicao=instituicao_padrao.id_instituicao,
    )
    empresa = EmpresaParceira(
        login="empresa.extrato.ordem",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.EMPRESA_PARCEIRA,
        ativo=True,
        nome="Livraria Ordem",
        email="empresa@ordem.com",
        cnpj="00000000000191",
    )
    sessao.add_all([prof, aluno, empresa])
    sessao.commit()

    vantagem = Vantagem(
        id_empresa=empresa.id_usuario,
        descricao="Desconto de 20%",
        foto="http://foto.jpg",
        custo=50,
    )
    sessao.add(vantagem)
    sessao.commit()

    envio = EnvioMoedas(
        id_professor=prof.id_usuario,
        id_aluno=aluno.id_usuario,
        valor=100,
        mensagem="Parabéns pela dedicação",
        data_hora=datetime(2026, 1, 10, 10, 0, 0, tzinfo=timezone.utc),
    )
    resgate = ResgateVantagem(
        id_aluno=aluno.id_usuario,
        id_vantagem=vantagem.id_vantagem,
        valor=50,
        codigo="CUPOM-1234",
        data_hora=datetime(2026, 1, 15, 14, 30, 0, tzinfo=timezone.utc),
    )
    sessao.add_all([envio, resgate])
    sessao.commit()

    sessao.expire_all()
    aluno_db = sessao.get(Aluno, aluno.id_usuario)
    prof_db = sessao.get(Professor, prof.id_usuario)

    extrato_aluno = aluno_db.extrato()
    assert len(extrato_aluno) == 2
    assert extrato_aluno[0].id_transacao == resgate.id_transacao
    assert extrato_aluno[1].id_transacao == envio.id_transacao

    extrato_prof = prof_db.extrato()
    assert len(extrato_prof) == 1
    assert extrato_prof[0].id_transacao == envio.id_transacao
