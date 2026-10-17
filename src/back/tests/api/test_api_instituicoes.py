"""Testes de integração do endpoint de listagem de instituições da API."""

from fastapi import status
from fastapi.testclient import TestClient

from model.instituicao_ensino import InstituicaoEnsino


def test_api_instituicoes_retorna_lista_com_sucesso(
    cliente_api: TestClient, instituicao_padrao: InstituicaoEnsino
):
    """Valida se GET /instituicoes retorna código HTTP 200 e lista as instituições ativas."""
    res = cliente_api.get("/instituicoes")
    assert res.status_code == status.HTTP_200_OK
    dados = res.json()
    assert len(dados) == 1
    assert dados[0]["nome"] == instituicao_padrao.nome
