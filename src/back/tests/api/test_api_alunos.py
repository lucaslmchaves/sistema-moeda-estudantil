"""Testes de integração das rotas de Aluno da API."""

from fastapi import status
from fastapi.testclient import TestClient

from model.instituicao_ensino import InstituicaoEnsino
from tests.fabricas import dados_aluno


def test_api_aluno_fluxo_crud_completo(cliente_api: TestClient, instituicao_padrao: InstituicaoEnsino):
    """Testa o ciclo de vida completo: criação, listagem, consulta, edição e exclusão de aluno."""
    payload = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao)

    # 1. POST /alunos (201)
    res_post = cliente_api.post("/alunos", json=payload)
    assert res_post.status_code == status.HTTP_201_CREATED
    dados_criados = res_post.json()
    id_aluno = dados_criados["id_usuario"]
    assert dados_criados["nome"] == payload["nome"]
    assert "senha_hash" not in dados_criados

    # 2. GET /alunos (200)
    res_list = cliente_api.get("/alunos")
    assert res_list.status_code == status.HTTP_200_OK
    assert len(res_list.json()) == 1

    # 3. GET /alunos/{id} (200)
    res_get = cliente_api.get(f"/alunos/{id_aluno}")
    assert res_get.status_code == status.HTTP_200_OK
    assert res_get.json()["id_usuario"] == id_aluno

    # 4. PUT /alunos/{id} (200)
    res_put = cliente_api.put(
        f"/alunos/{id_aluno}",
        json={"nome": "Nome Modificado", "login": "novo.login.ignorado"},
    )
    assert res_put.status_code == status.HTTP_200_OK
    assert res_put.json()["nome"] == "Nome Modificado"
    assert res_put.json()["login"] == payload["login"]

    # 5. DELETE /alunos/{id} (204)
    res_del = cliente_api.delete(f"/alunos/{id_aluno}")
    assert res_del.status_code == status.HTTP_204_NO_CONTENT

    # 6. Aluno excluído não é mais encontrado
    res_get_excluido = cliente_api.get(f"/alunos/{id_aluno}")
    assert res_get_excluido.status_code == status.HTTP_404_NOT_FOUND
    assert "detalhe" in res_get_excluido.json()
    assert len(cliente_api.get("/alunos").json()) == 0


def test_api_aluno_conflito_login_e_cpf_retorna_409(
    cliente_api: TestClient, instituicao_padrao: InstituicaoEnsino
):
    """Garante que duplicidades de login ou CPF retornam status 409 com mensagem detalhada."""
    p1 = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao)
    cliente_api.post("/alunos", json=p1)

    # Conflito de login
    p_login = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, login=p1["login"])
    res_login = cliente_api.post("/alunos", json=p_login)
    assert res_login.status_code == status.HTTP_409_CONFLICT
    assert res_login.json()["detalhe"] == "O login informado já está em uso."

    # Conflito de CPF com máscara trocada
    p_cpf = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao, cpf=p1["cpf"])
    res_cpf = cliente_api.post("/alunos", json=p_cpf)
    assert res_cpf.status_code == status.HTTP_409_CONFLICT
    assert res_cpf.json()["detalhe"] == "O CPF informado já está cadastrado."
