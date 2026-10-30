"""Testes de integração do login e das permissões por perfil na API."""

from fastapi import status
from fastapi.testclient import TestClient

from tests.suporte.fabricas import SENHA_PADRAO


def test_login_devolve_token_e_dados_do_usuario(cliente_api: TestClient, cadastrar_aluno):
    """O login correto devolve o token e identifica o perfil do usuário."""
    aluno = cadastrar_aluno()

    res = cliente_api.post(
        "/autenticacao/entrar", json={"login": aluno["login"], "senha": SENHA_PADRAO}
    )

    assert res.status_code == status.HTTP_200_OK
    corpo = res.json()
    assert corpo["token_type"] == "bearer"
    assert corpo["access_token"]
    assert corpo["usuario"] == {
        "id_usuario": aluno["id_usuario"],
        "tipo_usuario": "ALUNO",
        "nome": aluno["nome"],
        "login": aluno["login"],
    }


def test_login_com_senha_errada_ou_login_inexistente_devolve_401(
    cliente_api: TestClient, cadastrar_aluno
):
    """A mensagem é a mesma para os dois erros, sem revelar qual login existe."""
    aluno = cadastrar_aluno()

    senha_errada = cliente_api.post(
        "/autenticacao/entrar", json={"login": aluno["login"], "senha": "outraSenha123"}
    )
    login_errado = cliente_api.post(
        "/autenticacao/entrar", json={"login": "ninguem", "senha": SENHA_PADRAO}
    )

    for res in (senha_errada, login_errado):
        assert res.status_code == status.HTTP_401_UNAUTHORIZED
        assert res.json() == {"detalhe": "Login ou senha inválidos."}
        assert res.headers["WWW-Authenticate"] == "Bearer"


def test_consultar_usuario_logado_exige_token_valido(
    cliente_api: TestClient, cadastrar_aluno, entrar
):
    """Sem token ou com token inválido a resposta é 401; com token válido, os dados do dono."""
    aluno = cadastrar_aluno()

    sem_token = cliente_api.get("/autenticacao/eu")
    token_falso = cliente_api.get("/autenticacao/eu", headers={"Authorization": "Bearer falso"})
    valido = cliente_api.get("/autenticacao/eu", headers=entrar(aluno["login"]))

    assert sem_token.status_code == status.HTTP_401_UNAUTHORIZED
    assert sem_token.json()["detalhe"].startswith("Autenticação necessária")
    assert token_falso.status_code == status.HTTP_401_UNAUTHORIZED
    assert token_falso.json()["detalhe"] == "Sessão inválida ou expirada. Entre novamente."
    assert valido.status_code == status.HTTP_200_OK
    assert valido.json()["login"] == aluno["login"]


def test_aluno_so_acessa_o_proprio_cadastro(cliente_api: TestClient, cadastrar_aluno, entrar):
    """Um aluno não vê, não altera e não exclui o cadastro de outro aluno."""
    dono = cadastrar_aluno()
    outro = cadastrar_aluno()
    cabecalhos = entrar(outro["login"])
    rota = f"/alunos/{dono['id_usuario']}"

    respostas = [
        cliente_api.get(rota, headers=cabecalhos),
        cliente_api.put(rota, json={"nome": "Invasor"}, headers=cabecalhos),
        cliente_api.delete(rota, headers=cabecalhos),
    ]

    for res in respostas:
        assert res.status_code == status.HTTP_403_FORBIDDEN
        assert res.json() == {"detalhe": "Você só pode acessar o seu próprio cadastro."}


def test_rotas_protegidas_sem_token_devolvem_401(cliente_api: TestClient, cadastrar_aluno):
    """Consultar, alterar ou excluir sem estar autenticado é recusado."""
    aluno = cadastrar_aluno()
    rota = f"/alunos/{aluno['id_usuario']}"

    assert cliente_api.get(rota).status_code == status.HTTP_401_UNAUTHORIZED
    assert cliente_api.put(rota, json={"nome": "X"}).status_code == status.HTTP_401_UNAUTHORIZED
    assert cliente_api.delete(rota).status_code == status.HTTP_401_UNAUTHORIZED


def test_empresa_nao_acessa_cadastro_de_aluno_nem_de_outra_empresa(
    cliente_api: TestClient, cadastrar_aluno, cadastrar_empresa, entrar
):
    """O perfil e o dono do cadastro são conferidos nas rotas de empresa e de aluno."""
    aluno = cadastrar_aluno()
    empresa = cadastrar_empresa()
    outra = cadastrar_empresa()
    cabecalhos = entrar(empresa["login"])

    res_aluno = cliente_api.get(f"/alunos/{aluno['id_usuario']}", headers=cabecalhos)
    res_outra = cliente_api.get(f"/empresas/{outra['id_usuario']}", headers=cabecalhos)

    assert res_aluno.status_code == status.HTTP_403_FORBIDDEN
    assert res_outra.status_code == status.HTTP_403_FORBIDDEN
