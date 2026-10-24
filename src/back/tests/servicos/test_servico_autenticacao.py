"""Testes do ServicoAutenticacao: login, emissão e validação do token de sessão."""

from datetime import datetime, timedelta, timezone

import jwt
import pytest
from sqlalchemy.orm import Session

from app.model.instituicao_ensino import InstituicaoEnsino
from app.repository.repositorio_aluno import RepositorioAluno
from app.repository.repositorio_instituicao import RepositorioInstituicao
from app.repository.repositorio_usuario import RepositorioUsuario
from app.service.excecoes import NaoAutenticado
from app.service.servico_aluno import ServicoAluno
from app.service.servico_autenticacao import ServicoAutenticacao
from tests.suporte.fabricas import SENHA_PADRAO, dados_aluno

SEGREDO = "segredo-de-teste"


@pytest.fixture
def servico_aluno(sessao: Session) -> ServicoAluno:
    """Serviço de alunos para criar e excluir usuários nos cenários."""
    return ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))


@pytest.fixture
def aluno(servico_aluno: ServicoAluno, instituicao_padrao: InstituicaoEnsino):
    """Aluno cadastrado, com a senha padrão dos testes."""
    return servico_aluno.cadastrar_aluno(
        dados_aluno(id_instituicao=instituicao_padrao.id_instituicao)
    )


@pytest.fixture
def servico(sessao: Session) -> ServicoAutenticacao:
    """Serviço de autenticação com sessão de 30 minutos."""
    return ServicoAutenticacao(RepositorioUsuario(sessao), SEGREDO, 30)


def test_autenticar_devolve_o_usuario_com_login_e_senha_corretos(servico, aluno):
    """O usuário certo volta quando login e senha conferem."""
    assert servico.autenticar(aluno.login, SENHA_PADRAO).id_usuario == aluno.id_usuario


@pytest.mark.parametrize("login, senha", [("inexistente", SENHA_PADRAO), (None, SENHA_PADRAO)])
def test_autenticar_recusa_login_desconhecido(servico, aluno, login, senha):
    """Login inexistente ou ausente é recusado com a mensagem genérica."""
    with pytest.raises(NaoAutenticado, match="Login ou senha inválidos"):
        servico.autenticar(login, senha)


def test_autenticar_recusa_senha_errada(servico, aluno):
    """A senha errada é recusada com a mesma mensagem do login desconhecido."""
    with pytest.raises(NaoAutenticado, match="Login ou senha inválidos"):
        servico.autenticar(aluno.login, "outraSenha123")


def test_autenticar_recusa_usuario_excluido(servico, servico_aluno, aluno):
    """Quem teve o cadastro excluído não consegue mais entrar."""
    servico_aluno.excluir_aluno(aluno.id_usuario)

    with pytest.raises(NaoAutenticado, match="Login ou senha inválidos"):
        servico.autenticar(aluno.login, SENHA_PADRAO)


def test_token_emitido_identifica_o_dono(servico, aluno):
    """O token emitido para o usuário leva de volta ao mesmo usuário."""
    token = servico.emitir_token(aluno)

    assert servico.identificar_usuario(token).id_usuario == aluno.id_usuario
    assert jwt.decode(token, SEGREDO, algorithms=["HS256"])["tipo"] == "ALUNO"


def test_token_expirado_e_recusado(sessao, aluno):
    """Depois da validade, o token deixa de valer."""
    servico = ServicoAutenticacao(RepositorioUsuario(sessao), SEGREDO, -1)

    with pytest.raises(NaoAutenticado, match="Sessão inválida ou expirada"):
        servico.identificar_usuario(servico.emitir_token(aluno))


def test_token_de_outro_segredo_ou_adulterado_e_recusado(servico, aluno):
    """Token assinado com outro segredo, texto qualquer ou sem dono válido é recusado."""
    agora = datetime.now(timezone.utc)
    carga = {"sub": str(aluno.id_usuario), "exp": agora + timedelta(minutes=5)}
    de_outro_segredo = jwt.encode(carga, "outro-segredo", algorithm="HS256")
    sub_invalido = jwt.encode({**carga, "sub": "abc"}, SEGREDO, algorithm="HS256")
    sem_sub = jwt.encode({"exp": carga["exp"]}, SEGREDO, algorithm="HS256")

    for token in (de_outro_segredo, "isso-nao-e-um-token", sub_invalido, sem_sub):
        with pytest.raises(NaoAutenticado, match="Sessão inválida ou expirada"):
            servico.identificar_usuario(token)


def test_token_de_usuario_excluido_e_recusado(servico, servico_aluno, aluno):
    """O token de quem excluiu o cadastro deixa de valer na hora."""
    token = servico.emitir_token(aluno)
    servico_aluno.excluir_aluno(aluno.id_usuario)

    with pytest.raises(NaoAutenticado, match="Sessão inválida ou expirada"):
        servico.identificar_usuario(token)
