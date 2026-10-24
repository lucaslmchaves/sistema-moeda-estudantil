"""Testes de integração das rotas de Aluno da API."""

from fastapi import status
from fastapi.testclient import TestClient

from app.model.instituicao_ensino import InstituicaoEnsino
from tests.suporte.fabricas import dados_aluno


def test_api_aluno_fluxo_crud_completo(
    cliente_api: TestClient, instituicao_padrao: InstituicaoEnsino, entrar
):
    """Testa o ciclo de vida do aluno: criação, consulta, edição e exclusão pelo próprio aluno."""
    payload = dados_aluno(id_instituicao=instituicao_padrao.id_instituicao)

    # 1. POST /alunos (201), aberto a quem ainda não tem login
    res_post = cliente_api.post("/alunos", json=payload)
    assert res_post.status_code == status.HTTP_201_CREATED
    dados_criados = res_post.json()
    id_aluno = dados_criados["id_usuario"]
    assert dados_criados["nome"] == payload["nome"]
    assert "senha_hash" not in dados_criados
    cabecalhos = entrar(payload["login"])

    # 2. GET /alunos/{id} (200)
    res_get = cliente_api.get(f"/alunos/{id_aluno}", headers=cabecalhos)
    assert res_get.status_code == status.HTTP_200_OK
    assert res_get.json()["id_usuario"] == id_aluno

    # 3. PUT /alunos/{id} (200)
    res_put = cliente_api.put(
        f"/alunos/{id_aluno}",
        json={"nome": "Nome Modificado", "login": "novo.login.ignorado"},
        headers=cabecalhos,
    )
    assert res_put.status_code == status.HTTP_200_OK
    assert res_put.json()["nome"] == "Nome Modificado"
    assert res_put.json()["login"] == payload["login"]

    # 4. DELETE /alunos/{id} (204)
    res_del = cliente_api.delete(f"/alunos/{id_aluno}", headers=cabecalhos)
    assert res_del.status_code == status.HTTP_204_NO_CONTENT

    # 5. Aluno excluído não consegue mais entrar
    res_login = cliente_api.post(
        "/autenticacao/entrar", json={"login": payload["login"], "senha": payload["senha"]}
    )
    assert res_login.status_code == status.HTTP_401_UNAUTHORIZED


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


def test_api_lista_de_alunos_so_para_professor_e_sem_dados_pessoais(
    cliente_api: TestClient, cadastrar_aluno, criar_professor, entrar
):
    """O professor vê só id, nome e curso dos alunos; o aluno não pode listar."""
    aluno = cadastrar_aluno()
    professor = criar_professor()

    res_prof = cliente_api.get("/alunos", headers=entrar(professor.login))
    assert res_prof.status_code == status.HTTP_200_OK
    assert res_prof.json() == [
        {"id_usuario": aluno["id_usuario"], "nome": aluno["nome"], "curso": aluno["curso"]}
    ]

    res_aluno = cliente_api.get("/alunos", headers=entrar(aluno["login"]))
    assert res_aluno.status_code == status.HTTP_403_FORBIDDEN
