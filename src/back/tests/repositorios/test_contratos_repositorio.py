"""Testes dos contratos: os repositórios concretos realizam as interfaces dos serviços."""

import pytest
from sqlalchemy.orm import Session

from repository.armazenamento_foto_local import ArmazenamentoFotoLocal
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
from tests.fakes import (
    ArmazenamentoFotoFalso,
    RepositorioAlunoFalso,
    RepositorioEmpresaFalso,
    RepositorioInstituicaoFalso,
)


@pytest.mark.parametrize(
    "interface",
    [
        IRepositorioAluno,
        IRepositorioEmpresa,
        IRepositorioInstituicao,
        IRepositorioUsuario,
        IRepositorioProfessor,
        IRepositorioConta,
        IRepositorioVantagem,
        IRepositorioTransacao,
        IArmazenamentoFoto,
    ],
)
def test_interface_e_abstrata_e_nao_pode_ser_instanciada(interface):
    """Uma interface não vira objeto."""
    with pytest.raises(TypeError):
        interface()


def test_repositorios_concretos_realizam_as_interfaces(sessao: Session):
    """Cada repositório do ORM obedece ao contrato do seu serviço."""
    assert isinstance(RepositorioAluno(sessao), IRepositorioAluno)
    assert isinstance(RepositorioEmpresa(sessao), IRepositorioEmpresa)
    assert isinstance(RepositorioInstituicao(sessao), IRepositorioInstituicao)
    assert isinstance(RepositorioUsuario(sessao), IRepositorioUsuario)
    assert isinstance(RepositorioProfessor(sessao), IRepositorioProfessor)
    assert isinstance(RepositorioConta(sessao), IRepositorioConta)
    assert isinstance(RepositorioVantagem(sessao), IRepositorioVantagem)
    assert isinstance(RepositorioTransacao(sessao), IRepositorioTransacao)
    assert isinstance(ArmazenamentoFotoLocal("uploads"), IArmazenamentoFoto)


def test_repositorios_falsos_dos_testes_tambem_realizam_as_interfaces():
    """Os falsos em memória seguem o mesmo contrato dos reais."""
    assert isinstance(RepositorioAlunoFalso(), IRepositorioAluno)
    assert isinstance(RepositorioEmpresaFalso(), IRepositorioEmpresa)
    assert isinstance(RepositorioInstituicaoFalso(), IRepositorioInstituicao)
    assert isinstance(ArmazenamentoFotoFalso(), IArmazenamentoFoto)
