from app.repository.armazenamento_foto_local import ArmazenamentoFotoLocal
from app.repository.database import SessionLocal, engine, get_sessao
from app.repository.interfaces import (
    IArmazenamentoFoto,
    IRepositorioAluno,
    IRepositorioConta,
    IRepositorioEmpresa,
    IRepositorioInstituicao,
    IRepositorioProfessor,
    IRepositorioTransacao,
    IRepositorioUsuario,
    IRepositorioVantagem,
)
from app.repository.repositorio_aluno import RepositorioAluno
from app.repository.repositorio_conta import RepositorioConta
from app.repository.repositorio_empresa import RepositorioEmpresa
from app.repository.repositorio_instituicao import RepositorioInstituicao
from app.repository.repositorio_professor import RepositorioProfessor
from app.repository.repositorio_transacao import RepositorioTransacao
from app.repository.repositorio_usuario import RepositorioUsuario
from app.repository.repositorio_vantagem import RepositorioVantagem

__all__ = [
    "engine",
    "SessionLocal",
    "get_sessao",
    "IArmazenamentoFoto",
    "IRepositorioAluno",
    "IRepositorioConta",
    "IRepositorioEmpresa",
    "IRepositorioInstituicao",
    "IRepositorioProfessor",
    "IRepositorioTransacao",
    "IRepositorioUsuario",
    "IRepositorioVantagem",
    "ArmazenamentoFotoLocal",
    "RepositorioAluno",
    "RepositorioConta",
    "RepositorioEmpresa",
    "RepositorioInstituicao",
    "RepositorioProfessor",
    "RepositorioTransacao",
    "RepositorioUsuario",
    "RepositorioVantagem",
]
