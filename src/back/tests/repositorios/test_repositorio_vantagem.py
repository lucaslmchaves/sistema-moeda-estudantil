"""Testes de persistência e consultas do RepositorioVantagem."""

import pytest
from sqlalchemy.orm import Session

from model.empresa_parceira import EmpresaParceira
from model.enums import TipoUsuario
from model.vantagem import Vantagem
from repository.repositorio_empresa import RepositorioEmpresa
from repository.repositorio_vantagem import RepositorioVantagem


def _empresa(sessao: Session, sufixo: str) -> EmpresaParceira:
    """Grava uma empresa parceira com dados únicos pelo sufixo."""
    empresa = EmpresaParceira(
        login=f"empresa.{sufixo}",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.EMPRESA_PARCEIRA,
        ativo=True,
        nome=f"Empresa {sufixo}",
        email=f"{sufixo}@empresa.com",
        cnpj=f"1234567800{sufixo:>04}",
    )
    return RepositorioEmpresa(sessao).salvar(empresa)


def _vantagem(id_empresa: int, descricao: str) -> Vantagem:
    """Monta uma vantagem de 10 moedas para a empresa."""
    return Vantagem(id_empresa=id_empresa, descricao=descricao, foto="/uploads/x.png", custo=10)


@pytest.fixture
def repo(sessao: Session) -> RepositorioVantagem:
    """Repositório ligado ao banco de teste."""
    return RepositorioVantagem(sessao)


def test_salvar_e_buscar_por_id(repo, sessao):
    """A vantagem salva recebe id e é encontrada pelo identificador."""
    empresa = _empresa(sessao, "1")

    vantagem = repo.salvar(_vantagem(empresa.id_usuario, "Café"))

    assert vantagem.id_vantagem is not None
    assert repo.buscar_por_id(vantagem.id_vantagem).descricao == "Café"
    assert repo.buscar_por_id(999) is None


def test_listar_traz_as_ativas_da_mais_recente_para_a_mais_antiga(repo, sessao):
    """O catálogo vem do id maior para o menor."""
    empresa = _empresa(sessao, "1")
    primeira = repo.salvar(_vantagem(empresa.id_usuario, "primeira"))
    segunda = repo.salvar(_vantagem(empresa.id_usuario, "segunda"))

    assert [v.id_vantagem for v in repo.listar()] == [segunda.id_vantagem, primeira.id_vantagem]


def test_listar_por_empresa_traz_so_as_da_empresa(repo, sessao):
    """A consulta por empresa não mistura as vantagens de outras empresas."""
    a, b = _empresa(sessao, "1"), _empresa(sessao, "2")
    da_a = repo.salvar(_vantagem(a.id_usuario, "da A"))
    repo.salvar(_vantagem(b.id_usuario, "da B"))

    assert [v.id_vantagem for v in repo.listar_por_empresa(a.id_usuario)] == [da_a.id_vantagem]


def test_marcar_excluida_tira_a_vantagem_das_consultas(repo, sessao):
    """A exclusão lógica preenche deletado_em e esconde a vantagem."""
    empresa = _empresa(sessao, "1")
    vantagem = repo.salvar(_vantagem(empresa.id_usuario, "Café"))

    assert repo.marcar_excluida(vantagem) is True

    assert vantagem.deletado_em is not None
    assert repo.buscar_por_id(vantagem.id_vantagem) is None
    assert repo.listar() == []


def test_vantagem_de_empresa_excluida_nao_aparece(repo, sessao):
    """Quando a empresa é excluída, as vantagens dela somem das consultas."""
    empresa = _empresa(sessao, "1")
    vantagem = repo.salvar(_vantagem(empresa.id_usuario, "Café"))

    RepositorioEmpresa(sessao).marcar_excluido(empresa)

    assert repo.buscar_por_id(vantagem.id_vantagem) is None
    assert repo.listar() == []
    assert repo.listar_por_empresa(empresa.id_usuario) == []
