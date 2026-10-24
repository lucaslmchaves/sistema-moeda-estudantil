"""Testes de persistência e consultas do RepositorioEmpresa."""

from sqlalchemy.orm import Session

from model.empresa_parceira import EmpresaParceira
from model.enums import TipoUsuario
from repository.repositorio_empresa import RepositorioEmpresa


def test_repositorio_empresa_crud_e_consultas(sessao: Session):
    """Testa salvar, buscar por id/cnpj/email/login, e exclusão lógica."""
    repo = RepositorioEmpresa(sessao)

    empresa = EmpresaParceira(
        login="empresa.repo",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.EMPRESA_PARCEIRA,
        ativo=True,
        nome="Empresa Repo Ltda",
        email="repo@empresa.com",
        cnpj="00000000000191",
    )
    repo.salvar(empresa)

    buscada = repo.buscar_por_id(empresa.id_usuario)
    assert buscada is not None
    assert buscada.nome == "Empresa Repo Ltda"

    assert repo.buscar_por_cnpj("00000000000191") is not None
    assert repo.buscar_por_email("repo@empresa.com") is not None
    assert repo.buscar_por_login("empresa.repo") is not None

    retorno = repo.marcar_excluido(empresa)
    assert retorno is True
    assert repo.buscar_por_id(empresa.id_usuario) is None
