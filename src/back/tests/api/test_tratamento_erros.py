"""Testes de validação da tradução completa dos erros da API para o português."""

from fastapi import status
from fastapi.testclient import TestClient

from app.main import app

PALAVRAS_PROIBIDAS = [
    "Field required",
    "String should",
    "Input should",
    "Not Found",
    "Internal Server Error",
]


def _verificar_ausencia_ingles(detalhe: str) -> None:
    """Verifica que nenhuma mensagem em inglês vazou na resposta de erro da API."""
    for palavra in PALAVRAS_PROIBIDAS:
        assert palavra.lower() not in detalhe.lower()


def test_erro_missing_traduzido_para_campo_obrigatorio(cliente_api: TestClient):
    """Garante que campos faltantes são traduzidos como 'campo obrigatório' em português."""
    res = cliente_api.post("/alunos", json={})
    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    detalhe = res.json()["detalhe"]
    assert "campo obrigatório" in detalhe
    assert "nome: campo obrigatório" in detalhe
    _verificar_ausencia_ingles(detalhe)


def test_erro_string_too_short_traduzido_em_portugues(cliente_api: TestClient):
    """Garante que texto menor que o limite mínimo é traduzido com 'deve ter no mínimo N caractere(s)'."""
    res = cliente_api.post(
        "/alunos",
        json={
            "nome": "   ",
            "email": "aluno@teste.com",
            "cpf": "123.456.789-09",
            "rg": "MG-1",
            "endereco": "Rua 1",
            "curso": "ES",
            "id_instituicao": 1,
            "login": "aluno.val",
            "senha": "senhaValida123",
        },
    )
    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    detalhe = res.json()["detalhe"]
    assert "nome: não pode ficar vazio" in detalhe
    _verificar_ausencia_ingles(detalhe)


def test_erro_string_too_long_traduzido_em_portugues(cliente_api: TestClient):
    """Garante que texto maior que o limite máximo é traduzido com 'deve ter no máximo N caracteres'."""
    res = cliente_api.post(
        "/alunos",
        json={
            "nome": "Nome Válido",
            "email": "aluno@teste.com",
            "cpf": "12345678901234567890",
            "rg": "MG-1",
            "endereco": "Rua 1",
            "curso": "ES",
            "id_instituicao": 1,
            "login": "aluno.val",
            "senha": "senhaValida123",
        },
    )
    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    detalhe = res.json()["detalhe"]
    assert "CPF: deve ter no máximo 14 caracteres" in detalhe
    _verificar_ausencia_ingles(detalhe)


def test_erro_int_parsing_traduzido_em_portugues(cliente_api: TestClient):
    """Garante que campo numérico enviado com valor textual devolve 'deve ser um número inteiro'."""
    res = cliente_api.post(
        "/alunos",
        json={
            "nome": "Nome Válido",
            "email": "aluno@teste.com",
            "cpf": "123.456.789-09",
            "rg": "MG-1",
            "endereco": "Rua 1",
            "curso": "ES",
            "id_instituicao": "texto_invalido",
            "login": "aluno.val",
            "senha": "senhaValida123",
        },
    )
    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    detalhe = res.json()["detalhe"]
    assert "instituição: deve ser um número inteiro" in detalhe
    _verificar_ausencia_ingles(detalhe)


def test_erro_json_invalid_traduzido_em_portugues(cliente_api: TestClient):
    """Garante que corpo de requisição com JSON malformado é traduzido adequadamente."""
    res = cliente_api.post(
        "/alunos",
        content="{json_invalido_sem_fechamento",
        headers={"Content-Type": "application/json"},
    )
    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    detalhe = res.json()["detalhe"]
    assert detalhe == "o corpo da requisição não é um JSON válido"
    _verificar_ausencia_ingles(detalhe)


def test_erro_rota_inexistente_retorna_404_em_portugues(cliente_api: TestClient):
    """Garante que acesso a rotas não cadastradas responde 404 com mensagem 'Rota não encontrada.'."""
    res = cliente_api.get("/rota-inexistente-xyz")
    assert res.status_code == status.HTTP_404_NOT_FOUND
    detalhe = res.json()["detalhe"]
    assert detalhe == "Rota não encontrada."
    _verificar_ausencia_ingles(detalhe)


def test_erro_metodo_nao_permitido_retorna_405_em_portugues(cliente_api: TestClient):
    """Garante que método HTTP não suportado responde 405 com 'Método não permitido.'."""
    res = cliente_api.put("/instituicoes")
    assert res.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
    detalhe = res.json()["detalhe"]
    assert detalhe == "Método não permitido."
    _verificar_ausencia_ingles(detalhe)


def test_erro_interno_500_oculta_detalhes_sensíveis():
    """Garante que falhas internas não tratadas retornam 500 sem expor stack trace ou detalhes."""
    @app.get("/teste-erro-500-simulado")
    def rota_com_falha():
        raise RuntimeError("Segredo_de_banco_ou_stack_trace_sensivel")

    with TestClient(app, raise_server_exceptions=False) as client:
        res = client.get("/teste-erro-500-simulado")
        assert res.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        corpo = res.json()
        assert corpo == {"detalhe": "Erro interno do servidor."}
        _verificar_ausencia_ingles(corpo["detalhe"])
