"""Ponto de entrada da aplicação FastAPI com configuração de middlewares e rotas."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from controller.aluno_controller import router as router_aluno
from controller.empresa_controller import router as router_empresa
from controller.instituicao_controller import router as router_instituicao
from controller.tratamento_erros import configurar_tratamento_erros

app = FastAPI(
    title="Sistema de Moeda Estudantil",
    description="API do Sistema de Reconhecimento e Moeda Estudantil",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

configurar_tratamento_erros(app)

app.include_router(router_aluno)
app.include_router(router_empresa)
app.include_router(router_instituicao)


@app.get("/saude", tags=["Saúde"], summary="Verificar saúde da API")
def verificar_saude() -> dict[str, str]:
    """Retorna o estado operacional da aplicação para monitoramento de integridade."""
    return {"status": "ok"}
