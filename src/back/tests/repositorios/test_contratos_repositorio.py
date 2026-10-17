"""Testes dos contratos: os repositórios concretos realizam as interfaces dos serviços."""

import pytest
from sqlalchemy.orm import Session

from repository.interfaces import IRepositorioAluno, IRepositorioEmpresa, IRepositorioInstituicao
from repository.repositorio_aluno import RepositorioAluno
from repository.repositorio_empresa import RepositorioEmpresa
from repository.repositorio_instituicao import RepositorioInstituicao
from tests.fakes import RepositorioAlunoFalso, RepositorioEmpresaFalso, RepositorioInstituicaoFalso


@pytest.mark.parametrize(
    "interface", [IRepositorioAluno, IRepositorioEmpresa, IRepositorioInstituicao]
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


def test_repositorios_falsos_dos_testes_tambem_realizam_as_interfaces():
    """Os falsos em memória seguem o mesmo contrato dos reais."""
    assert isinstance(RepositorioAlunoFalso(), IRepositorioAluno)
    assert isinstance(RepositorioEmpresaFalso(), IRepositorioEmpresa)
    assert isinstance(RepositorioInstituicaoFalso(), IRepositorioInstituicao)
