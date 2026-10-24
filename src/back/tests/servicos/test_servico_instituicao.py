"""Testes unitários das operações do ServicoInstituicao."""

from sqlalchemy.orm import Session

from app.model.instituicao_ensino import InstituicaoEnsino
from app.repository.repositorio_instituicao import RepositorioInstituicao
from app.service.servico_instituicao import ServicoInstituicao


def test_listar_instituicoes_retorna_todas_as_instituicoes(sessao: Session):
    """Verifica se o serviço retorna a relação completa de instituições cadastradas."""
    inst = InstituicaoEnsino(nome="PUC Minas")
    sessao.add(inst)
    sessao.commit()

    servico = ServicoInstituicao(RepositorioInstituicao(sessao))
    lista = servico.listar_instituicoes()
    assert len(lista) == 1
    assert lista[0].nome == "PUC Minas"
