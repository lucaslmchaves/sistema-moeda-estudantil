from repository.armazenamento_foto_local import ArmazenamentoFotoLocal
from repository.database import SessionLocal, engine, get_sessao
from repository.interfaces import (
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
from repository.repositorio_aluno import RepositorioAluno
from repository.repositorio_conta import RepositorioConta
from repository.repositorio_empresa import RepositorioEmpresa
from repository.repositorio_instituicao import RepositorioInstituicao
from repository.repositorio_professor import RepositorioProfessor
from repository.repositorio_transacao import RepositorioTransacao
from repository.repositorio_usuario import RepositorioUsuario
from repository.repositorio_vantagem import RepositorioVantagem

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
