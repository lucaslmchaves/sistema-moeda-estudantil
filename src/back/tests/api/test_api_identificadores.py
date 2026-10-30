"""Testes das rotas com identificadores fora do limite de 32 bits do banco."""

from fastapi import status
from fastapi.testclient import TestClient

GIGANTE = 99999999999999999999999


def test_identificador_gigante_ou_invalido_na_rota_devolve_422_e_nao_500(
    cliente_api: TestClient, cadastrar_empresa, entrar
):
    """Ids enormes, zero ou negativos são recusados antes de chegar ao banco."""
    cabecalhos = entrar(cadastrar_empresa()["login"])

    for id_rota in (GIGANTE, 0, -1):
        resposta = cliente_api.delete(f"/vantagens/{id_rota}", headers=cabecalhos)

        assert resposta.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT, id_rota
        assert resposta.json()["detalhe"].startswith("identificador: deve ser no ")


def test_identificador_gigante_no_corpo_devolve_422_e_nao_500(
    cliente_api: TestClient, cadastrar_aluno, criar_professor, entrar
):
    """O aluno e a vantagem informados no corpo também têm limite."""
    professor = criar_professor()
    aluno = cadastrar_aluno()

    envio = cliente_api.post(
        "/moedas/enviar",
        content=f'{{"id_aluno": {GIGANTE}, "valor": 1, "mensagem": "x"}}',
        headers={**entrar(professor.login), "Content-Type": "application/json"},
    )
    resgate = cliente_api.post(
        "/moedas/resgatar",
        content=f'{{"id_vantagem": {GIGANTE}}}',
        headers={**entrar(aluno["login"]), "Content-Type": "application/json"},
    )

    assert envio.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT
    assert resgate.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT
    assert envio.json()["detalhe"] == "aluno: deve ser no máximo 2147483647"
