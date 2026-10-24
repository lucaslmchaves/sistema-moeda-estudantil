"""Testes de integração das rotas de Vantagem da API."""

from fastapi import status
from fastapi.testclient import TestClient

from tests.fabricas import FOTO_PNG
from tests.fakes import ArmazenamentoFotoFalso


def _enviar_vantagem(
    cliente: TestClient, cabecalhos: dict, descricao="Desconto de 10%", custo="50"
):
    """Envia o formulário de cadastro de vantagem com uma foto PNG válida."""
    return cliente.post(
        "/vantagens",
        data={"descricao": descricao, "custo": custo},
        files={"foto": ("produto.png", FOTO_PNG, "image/png")},
        headers=cabecalhos,
    )


def test_empresa_cadastra_vantagem_com_foto_e_ela_aparece_nas_listas(
    cliente_api: TestClient,
    cadastrar_empresa,
    cadastrar_aluno,
    entrar,
    armazenamento: ArmazenamentoFotoFalso,
):
    """A vantagem guarda a foto, aparece para a empresa e no catálogo dos alunos."""
    empresa = cadastrar_empresa()
    aluno = cadastrar_aluno()
    cabecalhos_empresa = entrar(empresa["login"])

    res = _enviar_vantagem(cliente_api, cabecalhos_empresa)

    assert res.status_code == status.HTTP_201_CREATED
    corpo = res.json()
    assert corpo["descricao"] == "Desconto de 10%"
    assert corpo["custo"] == 50
    assert corpo["nome_empresa"] == empresa["nome"]
    assert corpo["foto"] == "/uploads/foto-1.png"
    assert armazenamento.fotos == [(FOTO_PNG, "png")]

    minhas = cliente_api.get("/vantagens/minhas", headers=cabecalhos_empresa)
    catalogo = cliente_api.get("/vantagens", headers=entrar(aluno["login"]))
    assert [v["id_vantagem"] for v in minhas.json()] == [corpo["id_vantagem"]]
    assert [v["id_vantagem"] for v in catalogo.json()] == [corpo["id_vantagem"]]


def test_so_empresa_cadastra_vantagem(cliente_api: TestClient, cadastrar_aluno, entrar):
    """Um aluno não cadastra vantagem, e sem login a rota é recusada."""
    aluno = cadastrar_aluno()

    res_aluno = _enviar_vantagem(cliente_api, entrar(aluno["login"]))
    res_anonimo = _enviar_vantagem(cliente_api, {})

    assert res_aluno.status_code == status.HTTP_403_FORBIDDEN
    assert res_anonimo.status_code == status.HTTP_401_UNAUTHORIZED


def test_cadastro_de_vantagem_recusa_dados_invalidos_em_portugues(
    cliente_api: TestClient, cadastrar_empresa, entrar
):
    """Foto ausente, foto de outro formato e custo inválido voltam como 422 em português."""
    cabecalhos = entrar(cadastrar_empresa()["login"])

    sem_foto = cliente_api.post(
        "/vantagens", data={"descricao": "X", "custo": "10"}, headers=cabecalhos
    )
    foto_texto = cliente_api.post(
        "/vantagens",
        data={"descricao": "X", "custo": "10"},
        files={"foto": ("a.txt", b"nao sou imagem", "text/plain")},
        headers=cabecalhos,
    )
    custo_zero = _enviar_vantagem(cliente_api, cabecalhos, custo="0")
    custo_texto = _enviar_vantagem(cliente_api, cabecalhos, custo="abc")

    assert sem_foto.status_code == 422
    assert sem_foto.json()["detalhe"] == "foto: campo obrigatório"
    assert foto_texto.status_code == 422
    assert foto_texto.json()["detalhe"] == "A foto deve estar no formato JPEG, PNG ou WebP."
    assert custo_zero.status_code == 422
    assert custo_zero.json()["detalhe"].startswith("O custo deve estar entre 1 e")
    assert custo_texto.status_code == 422
    assert custo_texto.json()["detalhe"] == "custo: deve ser um número inteiro"


def test_empresa_exclui_a_propria_vantagem_e_nao_a_de_outra(
    cliente_api: TestClient, cadastrar_empresa, entrar
):
    """A exclusão tira a vantagem das listas e só vale para a empresa dona dela."""
    dona = cadastrar_empresa()
    outra = cadastrar_empresa()
    cabecalhos_dona = entrar(dona["login"])
    id_vantagem = _enviar_vantagem(cliente_api, cabecalhos_dona).json()["id_vantagem"]

    res_outra = cliente_api.delete(f"/vantagens/{id_vantagem}", headers=entrar(outra["login"]))
    res_dona = cliente_api.delete(f"/vantagens/{id_vantagem}", headers=cabecalhos_dona)

    assert res_outra.status_code == status.HTTP_404_NOT_FOUND
    assert res_dona.status_code == status.HTTP_204_NO_CONTENT
    assert cliente_api.get("/vantagens/minhas", headers=cabecalhos_dona).json() == []


def test_vantagens_de_empresa_excluida_saem_do_catalogo(
    cliente_api: TestClient, cadastrar_empresa, cadastrar_aluno, entrar
):
    """Quando a empresa exclui o cadastro, as vantagens dela deixam de ser oferecidas."""
    empresa = cadastrar_empresa()
    aluno = cadastrar_aluno()
    cabecalhos = entrar(empresa["login"])
    _enviar_vantagem(cliente_api, cabecalhos)

    cliente_api.delete(f"/empresas/{empresa['id_usuario']}", headers=cabecalhos)

    catalogo = cliente_api.get("/vantagens", headers=entrar(aluno["login"]))
    assert catalogo.json() == []
