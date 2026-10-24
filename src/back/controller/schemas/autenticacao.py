"""Schemas Pydantic do login e da identificação do usuário autenticado."""

from pydantic import BaseModel

from controller.schemas.tipos import TipoLogin
from model.enums import TipoUsuario


class LoginSchema(BaseModel):
    """Credenciais enviadas para entrar no sistema."""

    login: TipoLogin
    senha: str


class UsuarioLogadoSchema(BaseModel):
    """Dados públicos do usuário autenticado."""

    id_usuario: int
    tipo_usuario: TipoUsuario
    nome: str
    login: str


class TokenRespostaSchema(BaseModel):
    """Token de acesso devolvido após o login, com o usuário dono dele."""

    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioLogadoSchema
