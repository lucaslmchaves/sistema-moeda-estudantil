"""Fixtures compartilhadas para execução dos testes unitários e de integração."""

from collections.abc import Generator
from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from controller.dependencias import obter_armazenamento_foto, obter_notificador
from main import app
from model.base import Base
from model.conta import Conta
from model.enums import TipoUsuario
from model.instituicao_ensino import InstituicaoEnsino
from model.professor import Professor
from model.seguranca import hash_senha
from repository.database import get_sessao
from tests.fabricas import SENHA_PADRAO, dados_aluno, dados_empresa, gerar_cpf_valido
from tests.fakes import ArmazenamentoFotoFalso, NotificadorFalso


@pytest.fixture(scope="session")
def engine():
    """Cria engine SQLite em memória com suporte a chaves estrangeiras ativo."""
    eng = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False,
    )

    @event.listens_for(eng, "connect")
    def ativar_chaves_estrangeiras(dbapi_conn, record):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    return eng


@pytest.fixture
def sessao(engine) -> Generator[Session, None, None]:
    """Fornece uma sessão isolada para o teste, recriando as tabelas e fazendo rollback."""
    Base.metadata.create_all(bind=engine)
    session_factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = session_factory()
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def instituicao_padrao(sessao: Session) -> InstituicaoEnsino:
    """Insere e retorna uma instituição de ensino padrão para os testes."""
    inst = InstituicaoEnsino(nome="PUC Minas")
    sessao.add(inst)
    sessao.commit()
    return inst


@pytest.fixture
def notificador() -> NotificadorFalso:
    """Fornece o notificador falso que guarda os e-mails pedidos pela API."""
    return NotificadorFalso()


@pytest.fixture
def armazenamento() -> ArmazenamentoFotoFalso:
    """Fornece o armazenamento falso que guarda em memória as fotos enviadas à API."""
    return ArmazenamentoFotoFalso()


@pytest.fixture
def cliente_api(
    sessao: Session, notificador: NotificadorFalso, armazenamento: ArmazenamentoFotoFalso
) -> Generator[TestClient, None, None]:
    """Fornece TestClient com a sessão, o notificador e o armazenamento de fotos de teste."""
    def sobreposicao_get_sessao() -> Generator[Session, None, None]:
        try:
            yield sessao
            sessao.commit()
        except Exception:
            sessao.rollback()
            raise

    app.dependency_overrides[get_sessao] = sobreposicao_get_sessao
    app.dependency_overrides[obter_notificador] = lambda: notificador
    app.dependency_overrides[obter_armazenamento_foto] = lambda: armazenamento
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture
def entrar(cliente_api: TestClient):
    """Fornece a função que faz o login e devolve o cabeçalho de autorização."""

    def _entrar(login: str, senha: str = SENHA_PADRAO) -> dict[str, str]:
        resposta = cliente_api.post("/autenticacao/entrar", json={"login": login, "senha": senha})
        assert resposta.status_code == 200, resposta.text
        return {"Authorization": f"Bearer {resposta.json()['access_token']}"}

    return _entrar


@pytest.fixture
def cadastrar_aluno(cliente_api: TestClient, instituicao_padrao: InstituicaoEnsino):
    """Fornece a função que cadastra um aluno pela API e devolve os dados com o id."""

    def _cadastrar(**extras) -> dict:
        dados = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, **extras)
        resposta = cliente_api.post("/alunos", json=dados)
        assert resposta.status_code == 201, resposta.text
        return {**dados, "id_usuario": resposta.json()["id_usuario"]}

    return _cadastrar


@pytest.fixture
def cadastrar_empresa(cliente_api: TestClient):
    """Fornece a função que cadastra uma empresa pela API e devolve os dados com o id."""

    def _cadastrar(**extras) -> dict:
        dados = dados_empresa(**extras)
        resposta = cliente_api.post("/empresas", json=dados)
        assert resposta.status_code == 201, resposta.text
        return {**dados, "id_usuario": resposta.json()["id_usuario"]}

    return _cadastrar


@pytest.fixture
def criar_professor(sessao: Session, instituicao_padrao: InstituicaoEnsino):
    """Fornece a função que insere um professor com conta, como a carga inicial faz."""

    def _criar(login: str = "prof.teste", saldo: int = 1000) -> Professor:
        professor = Professor(
            login=login,
            senha_hash=hash_senha(SENHA_PADRAO),
            tipo_usuario=TipoUsuario.PROFESSOR,
            ativo=True,
            nome="Professor Teste",
            cpf=gerar_cpf_valido(),
            departamento="Computação",
            id_instituicao=instituicao_padrao.id_instituicao,
        )
        sessao.add(professor)
        sessao.flush()
        sessao.add(Conta(id_usuario=professor.id_usuario, saldo=saldo))
        sessao.commit()
        return professor

    return _criar
