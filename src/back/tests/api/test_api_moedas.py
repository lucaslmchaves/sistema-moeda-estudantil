"""Testes de integração do envio de moedas, do resgate de vantagens e do extrato."""

from fastapi import status
from fastapi.testclient import TestClient

from tests.suporte.fabricas import FOTO_PNG
from tests.suporte.fakes import NotificadorFalso


def _enviar_moedas(cliente, cabecalhos, id_aluno, valor=100, mensagem="Ótima participação"):
    """Pede à API o envio de moedas ao aluno."""
    return cliente.post(
        "/moedas/enviar",
        json={"id_aluno": id_aluno, "valor": valor, "mensagem": mensagem},
        headers=cabecalhos,
    )


def _criar_vantagem(cliente, cabecalhos, custo="60"):
    """Cadastra uma vantagem com foto e devolve o corpo da resposta."""
    res = cliente.post(
        "/vantagens",
        data={"descricao": "Almoço grátis", "custo": custo},
        files={"foto": ("produto.png", FOTO_PNG, "image/png")},
        headers=cabecalhos,
    )
    assert res.status_code == status.HTTP_201_CREATED, res.text
    return res.json()


def test_professor_envia_moedas_e_ambos_os_extratos_mostram(
    cliente_api: TestClient,
    cadastrar_aluno,
    criar_professor,
    entrar,
    notificador: NotificadorFalso,
):
    """O envio debita o professor, credita o aluno, aparece nos extratos e avisa o aluno."""
    aluno = cadastrar_aluno()
    professor = criar_professor()
    cab_prof, cab_aluno = entrar(professor.login), entrar(aluno["login"])

    res = _enviar_moedas(cliente_api, cab_prof, aluno["id_usuario"], valor=150)

    assert res.status_code == status.HTTP_201_CREATED
    assert res.json()["valor"] == 150
    extrato_prof = cliente_api.get("/moedas/extrato", headers=cab_prof).json()
    extrato_aluno = cliente_api.get("/moedas/extrato", headers=cab_aluno).json()
    assert extrato_prof["saldo"] == 850
    assert extrato_prof["transacoes"][0]["valor"] == -150
    assert extrato_prof["transacoes"][0]["descricao"] == f"Para {aluno['nome']}: Ótima participação"
    assert extrato_aluno["saldo"] == 150
    assert extrato_aluno["transacoes"][0]["valor"] == 150
    assert extrato_aluno["transacoes"][0]["descricao"] == "De Professor Teste: Ótima participação"
    assert len(notificador.recebimentos) == 1
    assert notificador.recebimentos[0].aluno.email == aluno["email"].lower()


def test_envio_recusa_saldo_insuficiente_mensagem_vazia_e_aluno_inexistente(
    cliente_api: TestClient, cadastrar_aluno, criar_professor, entrar, notificador: NotificadorFalso
):
    """Cada regra violada devolve o erro certo, em português, sem mexer nos saldos."""
    aluno = cadastrar_aluno()
    cab_prof = entrar(criar_professor(saldo=100).login)

    saldo = _enviar_moedas(cliente_api, cab_prof, aluno["id_usuario"], valor=101)
    vazia = _enviar_moedas(cliente_api, cab_prof, aluno["id_usuario"], mensagem="   ")
    zero = _enviar_moedas(cliente_api, cab_prof, aluno["id_usuario"], valor=0)
    inexistente = _enviar_moedas(cliente_api, cab_prof, 9999)

    assert saldo.status_code == 422
    assert saldo.json()["detalhe"] == (
        "Saldo insuficiente: você tem 100 moedas e tentou enviar 101."
    )
    assert vazia.status_code == 422
    assert vazia.json()["detalhe"] == "mensagem: não pode ficar vazio"
    assert zero.status_code == 422
    assert zero.json()["detalhe"].startswith("O valor deve estar entre 1 e")
    assert inexistente.status_code == status.HTTP_404_NOT_FOUND
    assert cliente_api.get("/moedas/extrato", headers=cab_prof).json()["saldo"] == 100
    assert notificador.recebimentos == []


def test_so_professor_envia_moedas_e_so_aluno_resgata(
    cliente_api: TestClient, cadastrar_aluno, cadastrar_empresa, entrar
):
    """O perfil é conferido nas rotas de envio, de resgate e de extrato."""
    aluno = cadastrar_aluno()
    empresa = cadastrar_empresa()
    cab_aluno, cab_empresa = entrar(aluno["login"]), entrar(empresa["login"])

    assert _enviar_moedas(cliente_api, cab_aluno, aluno["id_usuario"]).status_code == 403
    res_resgate = cliente_api.post(
        "/moedas/resgatar", json={"id_vantagem": 1}, headers=cab_empresa
    )
    assert res_resgate.status_code == status.HTTP_403_FORBIDDEN
    assert cliente_api.get("/moedas/extrato", headers=cab_empresa).status_code == 403
    assert cliente_api.get("/moedas/extrato").status_code == status.HTTP_401_UNAUTHORIZED


def test_aluno_resgata_vantagem_e_recebe_codigo_igual_ao_da_empresa(
    cliente_api: TestClient,
    cadastrar_aluno,
    cadastrar_empresa,
    criar_professor,
    entrar,
    notificador: NotificadorFalso,
):
    """O resgate desconta o saldo, gera o código e manda cupom ao aluno e conferência à empresa."""
    aluno = cadastrar_aluno()
    empresa = cadastrar_empresa()
    cab_aluno = entrar(aluno["login"])
    _enviar_moedas(cliente_api, entrar(criar_professor().login), aluno["id_usuario"], valor=100)
    vantagem = _criar_vantagem(cliente_api, entrar(empresa["login"]), custo="60")

    res = cliente_api.post(
        "/moedas/resgatar", json={"id_vantagem": vantagem["id_vantagem"]}, headers=cab_aluno
    )

    assert res.status_code == status.HTTP_201_CREATED
    codigo = res.json()["codigo"]
    assert len(codigo) == 8
    extrato = cliente_api.get("/moedas/extrato", headers=cab_aluno).json()
    assert extrato["saldo"] == 40
    assert extrato["transacoes"][0]["valor"] == -60
    assert codigo in extrato["transacoes"][0]["descricao"]
    assert len(notificador.resgates) == 1
    assert notificador.resgates[0].codigo == codigo
    assert notificador.resgates[0].vantagem.empresa.email == empresa["email"].lower()


def test_resgate_recusa_saldo_insuficiente_e_vantagem_inexistente(
    cliente_api: TestClient, cadastrar_aluno, cadastrar_empresa, entrar, notificador: NotificadorFalso
):
    """Sem saldo ou com vantagem inexistente nada é descontado e nenhum e-mail é pedido."""
    aluno = cadastrar_aluno()
    vantagem = _criar_vantagem(cliente_api, entrar(cadastrar_empresa()["login"]), custo="60")
    cab_aluno = entrar(aluno["login"])

    sem_saldo = cliente_api.post(
        "/moedas/resgatar", json={"id_vantagem": vantagem["id_vantagem"]}, headers=cab_aluno
    )
    inexistente = cliente_api.post("/moedas/resgatar", json={"id_vantagem": 999}, headers=cab_aluno)

    assert sem_saldo.status_code == 422
    assert sem_saldo.json()["detalhe"] == (
        "Saldo insuficiente: você tem 0 moedas e a vantagem custa 60."
    )
    assert inexistente.status_code == status.HTTP_404_NOT_FOUND
    assert cliente_api.get("/moedas/extrato", headers=cab_aluno).json()["saldo"] == 0
    assert notificador.resgates == []


def test_vantagem_excluida_nao_pode_mais_ser_resgatada(
    cliente_api: TestClient, cadastrar_aluno, cadastrar_empresa, criar_professor, entrar
):
    """Depois que a empresa exclui a vantagem, o resgate dela é recusado."""
    aluno = cadastrar_aluno()
    cab_empresa = entrar(cadastrar_empresa()["login"])
    _enviar_moedas(cliente_api, entrar(criar_professor().login), aluno["id_usuario"], valor=100)
    vantagem = _criar_vantagem(cliente_api, cab_empresa, custo="10")
    cliente_api.delete(f"/vantagens/{vantagem['id_vantagem']}", headers=cab_empresa)

    res = cliente_api.post(
        "/moedas/resgatar",
        json={"id_vantagem": vantagem["id_vantagem"]},
        headers=entrar(aluno["login"]),
    )

    assert res.status_code == status.HTTP_404_NOT_FOUND
