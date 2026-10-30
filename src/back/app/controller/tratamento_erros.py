"""Tratamento centralizado de exceções e tradução de mensagens da API para português."""

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.service.excecoes import AcessoNegado, Conflito, DadoInvalido, NaoAutenticado, NaoEncontrado
from app.service.rotulos import rotulo_do_campo

def resposta_erro(
    codigo: int, detalhe: str, cabecalhos: dict[str, str] | None = None
) -> JSONResponse:
    """Monta a resposta de erro no padrão {"detalhe": "..."}."""
    return JSONResponse(status_code=codigo, content={"detalhe": detalhe}, headers=cabecalhos)


def traduzir_erro_pydantic(erro: dict) -> str:
    """Converte o erro Pydantic em mensagem em português sem expor valores brutos."""
    tipo = erro.get("type", "")
    ctx = erro.get("ctx", {})
    loc = erro.get("loc", ())
    campo_chave = str(loc[-1]) if loc else "campo"
    campo_nome = rotulo_do_campo(campo_chave)

    if tipo == "missing":
        msg = "campo obrigatório"
    elif tipo == "string_too_short":
        limite = ctx.get("min_length", 1)
        msg = "não pode ficar vazio" if limite == 1 else f"deve ter no mínimo {limite} caracteres"
    elif tipo == "string_too_long":
        limite = ctx.get("max_length")
        msg = f"deve ter no máximo {limite} caracteres"
    elif tipo in ("int_parsing", "int_type"):
        msg = "deve ser um número inteiro"
    elif tipo == "greater_than_equal":
        msg = f"deve ser no mínimo {ctx.get('ge')}"
    elif tipo == "less_than_equal":
        msg = f"deve ser no máximo {ctx.get('le')}"
    elif tipo == "string_type":
        msg = "deve ser um texto"
    elif tipo == "json_invalid":
        return "o corpo da requisição não é um JSON válido"
    elif tipo.startswith("value_error"):
        raw_msg = str(erro.get("msg", "valor inválido"))
        msg = raw_msg[len("Value error, "):] if raw_msg.startswith("Value error, ") else raw_msg
    else:
        msg = "valor inválido"

    return f"{campo_nome}: {msg}"


def configurar_tratamento_erros(app: FastAPI) -> None:
    """Registra todos os manipuladores de exceções da aplicação."""

    @app.exception_handler(RequestValidationError)
    def tratar_validacao_pydantic(request: Request, exc: RequestValidationError) -> JSONResponse:
        """Formata os erros de validação em português no padrão {"detalhe": "..."}."""
        mensagens = [traduzir_erro_pydantic(e) for e in exc.errors()]
        detalhe = "; ".join(mensagens) if mensagens else "Dados de requisição inválidos."
        return resposta_erro(status.HTTP_422_UNPROCESSABLE_CONTENT, detalhe)

    @app.exception_handler(NaoEncontrado)
    def tratar_nao_encontrado(request: Request, exc: NaoEncontrado) -> JSONResponse:
        """Converte exceção de recurso inexistente em resposta HTTP 404."""
        return resposta_erro(status.HTTP_404_NOT_FOUND, exc.mensagem)

    @app.exception_handler(Conflito)
    def tratar_conflito(request: Request, exc: Conflito) -> JSONResponse:
        """Converte conflito de unicidade de dados em resposta HTTP 409."""
        return resposta_erro(status.HTTP_409_CONFLICT, exc.mensagem)

    @app.exception_handler(DadoInvalido)
    def tratar_dado_invalido(request: Request, exc: DadoInvalido) -> JSONResponse:
        """Converte inconsistências de regras de negócio em resposta HTTP 422."""
        return resposta_erro(status.HTTP_422_UNPROCESSABLE_CONTENT, exc.mensagem)

    @app.exception_handler(NaoAutenticado)
    def tratar_nao_autenticado(request: Request, exc: NaoAutenticado) -> JSONResponse:
        """Converte falha de autenticação em resposta HTTP 401."""
        return resposta_erro(
            status.HTTP_401_UNAUTHORIZED, exc.mensagem, {"WWW-Authenticate": "Bearer"}
        )

    @app.exception_handler(AcessoNegado)
    def tratar_acesso_negado(request: Request, exc: AcessoNegado) -> JSONResponse:
        """Converte acesso não permitido ao perfil em resposta HTTP 403."""
        return resposta_erro(status.HTTP_403_FORBIDDEN, exc.mensagem)

    @app.exception_handler(StarletteHTTPException)
    def tratar_erro_http(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        """Padroniza erros HTTP de rotas e métodos inexistentes em português."""
        if exc.status_code == status.HTTP_404_NOT_FOUND:
            mensagem = "Rota não encontrada."
        elif exc.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
            mensagem = "Método não permitido."
        else:
            mensagem = "Não foi possível processar a requisição."
        return resposta_erro(exc.status_code, mensagem)

    @app.exception_handler(Exception)
    def tratar_erro_interno(request: Request, exc: Exception) -> JSONResponse:
        """Captura falhas não tratadas respondendo HTTP 500 sem vazar dados sensíveis."""
        return resposta_erro(status.HTTP_500_INTERNAL_SERVER_ERROR, "Erro interno do servidor.")
