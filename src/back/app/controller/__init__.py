from app.controller.rotas.aluno import router as router_aluno
from app.controller.rotas.autenticacao import router as router_autenticacao
from app.controller.rotas.empresa import router as router_empresa
from app.controller.rotas.instituicao import router as router_instituicao
from app.controller.rotas.moedas import router as router_moedas
from app.controller.rotas.vantagem import router as router_vantagem

__all__ = [
    "router_aluno",
    "router_autenticacao",
    "router_empresa",
    "router_instituicao",
    "router_moedas",
    "router_vantagem",
]
