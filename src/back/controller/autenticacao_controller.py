"""Rotas e controladores HTTP do login e da identificação do usuário."""

from fastapi import APIRouter, Depends, status

from controller.autenticacao import usuario_autenticado
from controller.dependencias import obter_servico_autenticacao
from controller.schemas import LoginSchema, TokenRespostaSchema, UsuarioLogadoSchema
from model.usuario import Usuario
from service.servico_autenticacao import ServicoAutenticacao

router = APIRouter(prefix="/autenticacao", tags=["Autenticação"])


def _usuario_logado(usuario: Usuario) -> UsuarioLogadoSchema:
    """Monta os dados públicos do usuário, usando o nome do perfil dele."""
    return UsuarioLogadoSchema(
        id_usuario=usuario.id_usuario,
        tipo_usuario=usuario.tipo_usuario,
        nome=getattr(usuario, "nome", usuario.login),
        login=usuario.login,
    )


@router.post(
    "/entrar",
    response_model=TokenRespostaSchema,
    status_code=status.HTTP_200_OK,
    summary="Entrar no sistema",
    description="Confere o login e a senha e devolve o token de acesso da sessão.",
)
def entrar(
    dados: LoginSchema,
    servico: ServicoAutenticacao = Depends(obter_servico_autenticacao),
) -> TokenRespostaSchema:
    """Autentica o usuário e devolve o token junto com os dados dele."""
    usuario = servico.autenticar(dados.login, dados.senha)
    return TokenRespostaSchema(
        access_token=servico.emitir_token(usuario), usuario=_usuario_logado(usuario)
    )


@router.get(
    "/eu",
    response_model=UsuarioLogadoSchema,
    status_code=status.HTTP_200_OK,
    summary="Consultar o usuário logado",
    description="Devolve os dados do dono do token enviado.",
)
def consultar_usuario_logado(
    usuario: Usuario = Depends(usuario_autenticado),
) -> UsuarioLogadoSchema:
    """Identifica o usuário autenticado na requisição."""
    return _usuario_logado(usuario)
