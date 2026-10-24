from controller.aluno_controller import router as router_aluno
from controller.autenticacao_controller import router as router_autenticacao
from controller.empresa_controller import router as router_empresa
from controller.instituicao_controller import router as router_instituicao
from controller.moedas_controller import router as router_moedas
from controller.vantagem_controller import router as router_vantagem

__all__ = [
    "router_aluno",
    "router_autenticacao",
    "router_empresa",
    "router_instituicao",
    "router_moedas",
    "router_vantagem",
]
