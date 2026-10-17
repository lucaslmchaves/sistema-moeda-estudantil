"""Fixtures compartilhadas para execução dos testes unitários e de integração."""

from collections.abc import Generator
from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from model.base import Base
from model.instituicao_ensino import InstituicaoEnsino
from repository.database import get_sessao


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
def cliente_api(sessao: Session) -> Generator[TestClient, None, None]:
    """Fornece TestClient com a dependência get_sessao sobreposta para a sessão de teste."""
    def sobreposicao_get_sessao() -> Generator[Session, None, None]:
        try:
            yield sessao
            sessao.commit()
        except Exception:
            sessao.rollback()
            raise

    app.dependency_overrides[get_sessao] = sobreposicao_get_sessao
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()
