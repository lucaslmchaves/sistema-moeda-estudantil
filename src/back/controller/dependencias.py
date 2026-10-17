"""Raiz de composição: monta cada serviço com os repositórios concretos da sessão."""

from fastapi import Depends
from sqlalchemy.orm import Session

from repository.database import get_sessao
from repository.repositorio_aluno import RepositorioAluno
from repository.repositorio_empresa import RepositorioEmpresa
from repository.repositorio_instituicao import RepositorioInstituicao
from service.servico_aluno import ServicoAluno
from service.servico_empresa import ServicoEmpresa
from service.servico_instituicao import ServicoInstituicao


def obter_servico_aluno(sessao: Session = Depends(get_sessao)) -> ServicoAluno:
    """Monta o serviço de alunos com os repositórios da sessão da requisição."""
    return ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))


def obter_servico_empresa(sessao: Session = Depends(get_sessao)) -> ServicoEmpresa:
    """Monta o serviço de empresas com o repositório da sessão da requisição."""
    return ServicoEmpresa(RepositorioEmpresa(sessao))


def obter_servico_instituicao(sessao: Session = Depends(get_sessao)) -> ServicoInstituicao:
    """Monta o serviço de instituições com o repositório da sessão da requisição."""
    return ServicoInstituicao(RepositorioInstituicao(sessao))
