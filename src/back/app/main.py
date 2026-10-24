"""Ponto de entrada da aplicação FastAPI com configuração de middlewares e rotas."""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.controller.rotas.aluno import router as router_aluno
from app.controller.rotas.autenticacao import router as router_autenticacao
from app.controller.rotas.empresa import router as router_empresa
from app.controller.rotas.instituicao import router as router_instituicao
from app.controller.rotas.moedas import router as router_moedas
from app.controller.rotas.vantagem import router as router_vantagem
from app.controller.tratamento_erros import configurar_tratamento_erros

logging.basicConfig(level=logging.INFO, format="%(levelname)s:     %(name)s - %(message)s")

app = FastAPI(
    title="Sistema de Moeda Estudantil",
    description="API do Sistema de Reconhecimento e Moeda Estudantil",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

configurar_tratamento_erros(app)

app.include_router(router_autenticacao)
app.include_router(router_aluno)
app.include_router(router_empresa)
app.include_router(router_instituicao)
app.include_router(router_vantagem)
app.include_router(router_moedas)

app.mount(
    "/uploads", StaticFiles(directory=settings.PASTA_UPLOADS, check_dir=False), name="uploads"
)


@app.get("/saude", tags=["Saúde"], summary="Verificar saúde da API")
def verificar_saude() -> dict[str, str]:
    """Retorna o estado operacional da aplicação para monitoramento de integridade."""
    return {"status": "ok"}
