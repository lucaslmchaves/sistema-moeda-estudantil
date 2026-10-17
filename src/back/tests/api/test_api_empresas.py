"""Testes de integração das rotas de Empresa Parceira da API."""

from fastapi import status
from fastapi.testclient import TestClient

from tests.fabricas import dados_empresa


def test_api_empresa_fluxo_crud_completo(cliente_api: TestClient):
    """Testa cadastro, listagem, consulta, edição e inativação de empresa parceira."""
    payload = dados_empresa(cnpj="00.000.000/0001-91")

    # 1. POST /empresas (201)
    res_post = cliente_api.post("/empresas", json=payload)
    assert res_post.status_code == status.HTTP_201_CREATED
    id_emp = res_post.json()["id_usuario"]

    # 2. GET /empresas e GET /empresas/{id} (200)
    assert cliente_api.get("/empresas").status_code == status.HTTP_200_OK
    assert cliente_api.get(f"/empresas/{id_emp}").status_code == status.HTTP_200_OK

    # 3. PUT /empresas/{id} (200)
    res_put = cliente_api.put(f"/empresas/{id_emp}", json={"nome": "Empresa Atualizada"})
    assert res_put.status_code == status.HTTP_200_OK
    assert res_put.json()["nome"] == "Empresa Atualizada"

    # 4. DELETE /empresas/{id} (204)
    assert cliente_api.delete(f"/empresas/{id_emp}").status_code == status.HTTP_204_NO_CONTENT
    assert cliente_api.get(f"/empresas/{id_emp}").status_code == status.HTTP_404_NOT_FOUND


def test_api_empresa_conflito_login_e_cnpj_retorna_409(cliente_api: TestClient):
    """Garante que dados repetidos de login ou CNPJ retornam HTTP 409 com mensagem explicativa."""
    p1 = dados_empresa(cnpj="00.000.000/0001-91")
    cliente_api.post("/empresas", json=p1)

    p2 = dados_empresa(login=p1["login"])
    res_login = cliente_api.post("/empresas", json=p2)
    assert res_login.status_code == status.HTTP_409_CONFLICT
    assert "detalhe" in res_login.json()

    p3 = dados_empresa(cnpj="00000000000191")
    res_cnpj = cliente_api.post("/empresas", json=p3)
    assert res_cnpj.status_code == status.HTTP_409_CONFLICT
    assert res_cnpj.json()["detalhe"] == "O CNPJ informado já está cadastrado."
