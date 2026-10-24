"""Dependências do FastAPI que identificam o usuário e conferem o perfil de acesso."""

from collections.abc import Callable

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from controller.dependencias import obter_servico_autenticacao
from model.enums import TipoUsuario
from model.usuario import Usuario
from service.excecoes import AcessoNegado, NaoAutenticado
from service.servico_autenticacao import ServicoAutenticacao

esquema_bearer = HTTPBearer(auto_error=False)


def usuario_autenticado(
    credenciais: HTTPAuthorizationCredentials | None = Depends(esquema_bearer),
    servico: ServicoAutenticacao = Depends(obter_servico_autenticacao),
) -> Usuario:
    """Devolve o usuário dono do token enviado, ou recusa a requisição."""
    if credenciais is None:
        raise NaoAutenticado("Autenticação necessária. Entre com o seu login e a sua senha.")
    return servico.identificar_usuario(credenciais.credentials)


def exigir_perfil(*perfis: TipoUsuario) -> Callable[..., Usuario]:
    """Cria a dependência que só deixa passar usuários dos perfis informados."""

    def verificar(usuario: Usuario = Depends(usuario_autenticado)) -> Usuario:
        """Recusa o acesso quando o perfil do usuário não está entre os permitidos."""
        if usuario.tipo_usuario not in perfis:
            raise AcessoNegado("O seu perfil não tem acesso a este recurso.")
        return usuario

    return verificar


def exigir_dono(perfil: TipoUsuario) -> Callable[..., Usuario]:
    """Cria a dependência que só deixa o próprio usuário acessar o seu cadastro."""

    def verificar(id: int, usuario: Usuario = Depends(exigir_perfil(perfil))) -> Usuario:
        """Recusa o acesso quando o identificador da rota não é o do usuário logado."""
        if usuario.id_usuario != id:
            raise AcessoNegado("Você só pode acessar o seu próprio cadastro.")
        return usuario

    return verificar
