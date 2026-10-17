"""Testes unitários das regras de negócio e validações do ServicoAluno."""

from unittest.mock import MagicMock
import pytest
from sqlalchemy import select
from sqlalchemy.orm import Session

from model.conta import Conta
from model.instituicao_ensino import InstituicaoEnsino
from model.usuario import Usuario
from repository.repositorio_aluno import RepositorioAluno
from repository.repositorio_instituicao import RepositorioInstituicao
from service.excecoes import Conflito, DadoInvalido, NaoEncontrado
from service.servico_aluno import ServicoAluno
from tests.fabricas import dados_aluno


def test_cadastrar_aluno_com_dados_validos_cria_usuario_e_conta(
    sessao: Session, instituicao_padrao: InstituicaoEnsino
):
    """Garante a persistência atômica do aluno e criação da conta com saldo zero."""
    servico = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))
    payload = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao)

    aluno = servico.cadastrar_aluno(payload)
    sessao.commit()

    assert aluno.id_usuario is not None
    assert aluno.autenticar(payload["senha"]) is True
    conta = sessao.execute(select(Conta).where(Conta.id_usuario == aluno.id_usuario)).scalar_one()
    assert conta.saldo == 0


def test_cadastrar_aluno_com_cpf_invalido_levanta_dado_invalido(
    sessao: Session, instituicao_padrao: InstituicaoEnsino
):
    """Rejeita cadastros de alunos cujos dígitos verificadores do CPF sejam matematicamente inconsistentes."""
    servico = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))
    payload = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, cpf="111.111.111-11")

    with pytest.raises(DadoInvalido, match="CPF inválido"):
        servico.cadastrar_aluno(payload)


def test_cadastrar_aluno_com_email_invalido_levanta_dado_invalido(
    sessao: Session, instituicao_padrao: InstituicaoEnsino
):
    """Rejeita e-mails sem formatação adequada com arroba e domínio."""
    servico = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))
    payload = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, email="sem_arroba_email")

    with pytest.raises(DadoInvalido, match="E-mail inválido"):
        servico.cadastrar_aluno(payload)


def test_cadastrar_aluno_com_senha_curta_ou_espacos_levanta_dado_invalido(
    sessao: Session, instituicao_padrao: InstituicaoEnsino
):
    """Impede senhas com menos de 8 caracteres ou compostas unicamente por espaços em branco."""
    servico = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))

    with pytest.raises(DadoInvalido, match="8 e 72 caracteres"):
        servico.cadastrar_aluno(dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, senha="curta"))

    with pytest.raises(DadoInvalido, match="senha não pode ser vazia"):
        servico.cadastrar_aluno(dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, senha="        "))


def test_cadastrar_aluno_com_instituicao_inexistente_levanta_dado_invalido(sessao: Session):
    """Impede vinculação de aluno a identificador de instituição que não existe na base."""
    servico = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))
    payload = dados_aluno(id_instituicao=9999)

    with pytest.raises(DadoInvalido, match="instituição de ensino"):
        servico.cadastrar_aluno(payload)


def test_cadastrar_aluno_com_campos_vazios_levanta_dado_invalido(
    sessao: Session, instituicao_padrao: InstituicaoEnsino
):
    """Rejeita campos de texto compostos apenas por espaços após a limpeza."""
    servico = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))
    payload = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, nome="   ")

    with pytest.raises(DadoInvalido, match="O campo nome não pode ficar vazio"):
        servico.cadastrar_aluno(payload)


def test_cadastrar_aluno_com_login_duplicado_levanta_conflito(
    sessao: Session, instituicao_padrao: InstituicaoEnsino
):
    """Garante que a tentativa de cadastrar o mesmo identificador de login lança Conflito."""
    servico = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))
    p1 = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao)
    servico.cadastrar_aluno(p1)
    sessao.commit()

    p2 = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, login=p1["login"])
    with pytest.raises(Conflito, match="login informado já está em uso"):
        servico.cadastrar_aluno(p2)


def test_cadastrar_aluno_com_cpf_com_e_sem_mascara_levanta_conflito(
    sessao: Session, instituicao_padrao: InstituicaoEnsino
):
    """Assegura que variações com ou sem pontuação no CPF colidam na verificação de unicidade."""
    servico = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))
    p1 = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, cpf="529.982.247-25")
    servico.cadastrar_aluno(p1)
    sessao.commit()

    p2 = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, cpf="52998224725")
    with pytest.raises(Conflito, match="CPF informado já está cadastrado"):
        servico.cadastrar_aluno(p2)


def test_cadastrar_aluno_com_email_case_insensitive_levanta_conflito(
    sessao: Session, instituicao_padrao: InstituicaoEnsino
):
    """Garante que e-mails com letras maiúsculas e minúsculas sejam tratados como idênticos."""
    servico = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))
    p1 = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, email="Aluno.CASE@Teste.Com")
    servico.cadastrar_aluno(p1)
    sessao.commit()

    p2 = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, email="aluno.case@teste.com")
    with pytest.raises(Conflito, match="e-mail informado já está cadastrado"):
        servico.cadastrar_aluno(p2)


def test_cadastrar_aluno_falha_na_conta_garante_atomicidade(
    sessao: Session, instituicao_padrao: InstituicaoEnsino
):
    """Assegura que a transação sofre rollback completo se a abertura da conta bancária falhar."""
    repo_aluno = RepositorioAluno(sessao)
    repo_inst = RepositorioInstituicao(sessao)
    repo_aluno.salvar_conta = MagicMock(side_effect=RuntimeError("Falha simulada na conta"))
    servico = ServicoAluno(repo_aluno, repo_inst)

    payload = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, login="aluno.atomico")
    with pytest.raises(RuntimeError):
        try:
            servico.cadastrar_aluno(payload)
        except Exception:
            sessao.rollback()
            raise

    usuario_db = sessao.execute(select(Usuario).where(Usuario.login == "aluno.atomico")).scalar_one_or_none()
    assert usuario_db is None


def test_atualizar_aluno_preserva_login_e_atualiza_campos(
    sessao: Session, instituicao_padrao: InstituicaoEnsino
):
    """Valida se a atualização preserva o login inalterado e atualiza nome e senha com sucesso."""
    servico = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))
    aluno = servico.cadastrar_aluno(dados_aluno(id_instituicao=instituicao_padrao.id_instituicao))
    sessao.commit()

    login_original = aluno.login
    servico.atualizar_aluno(aluno.id_usuario, {"nome": "Nome Modificado", "senha": "novaSenhaSegura123"})
    sessao.commit()

    atualizado = servico.buscar_aluno(aluno.id_usuario)
    assert atualizado.nome == "Nome Modificado"
    assert atualizado.login == login_original
    assert atualizado.autenticar("novaSenhaSegura123") is True


def test_excluir_aluno_aplica_exclusao_logica_e_retorna_true(
    sessao: Session, instituicao_padrao: InstituicaoEnsino
):
    """Garante que a exclusão lógica retorna True e torna o aluno inacessível nas buscas e listagens."""
    servico = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))
    aluno = servico.cadastrar_aluno(dados_aluno(id_instituicao=instituicao_padrao.id_instituicao))
    sessao.commit()

    sucesso = servico.excluir_aluno(aluno.id_usuario)
    assert sucesso is True
    sessao.commit()

    with pytest.raises(NaoEncontrado):
        servico.buscar_aluno(aluno.id_usuario)
    assert len(servico.listar_alunos()) == 0
