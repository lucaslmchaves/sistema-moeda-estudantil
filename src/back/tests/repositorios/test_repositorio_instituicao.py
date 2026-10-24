"""Testes de persistência do RepositorioInstituicao."""

from sqlalchemy.orm import Session

from app.model.instituicao_ensino import InstituicaoEnsino
from app.repository.repositorio_instituicao import RepositorioInstituicao


def test_repositorio_instituicao_listar_e_buscar(sessao: Session):
    """Testa listagem e busca por ID de instituições de ensino cadastradas."""
    repo = RepositorioInstituicao(sessao)
    inst = InstituicaoEnsino(nome="PUC Minas")
    sessao.add(inst)
    sessao.commit()

    lista = repo.listar()
    assert len(lista) == 1
    assert lista[0].nome == "PUC Minas"

    buscado = repo.buscar_por_id(inst.id_instituicao)
    assert buscado is not None
    assert buscado.id_instituicao == inst.id_instituicao
