"""Serviço de autenticação: confere login e senha e emite e valida o token de acesso."""

from datetime import datetime, timedelta, timezone

import jwt

from app.model.usuario import Usuario
from app.repository.interfaces import IRepositorioUsuario
from app.service.excecoes import NaoAutenticado

ALGORITMO_TOKEN = "HS256"
MENSAGEM_SESSAO_INVALIDA = "Sessão inválida ou expirada. Entre novamente."


class ServicoAutenticacao:
    """Autentica usuários de qualquer perfil e controla o token de sessão."""

    def __init__(self, repo_usuario: IRepositorioUsuario, segredo: str, validade_minutos: int):
        """Recebe o repositório por interface, o segredo do token e a validade da sessão."""
        self.repo_usuario = repo_usuario
        self.segredo = segredo
        self.validade_minutos = validade_minutos

    def autenticar(self, login: str, senha: str) -> Usuario:
        """Devolve o usuário ativo dono do login e da senha, ou recusa a entrada."""
        usuario = self.repo_usuario.buscar_por_login((login or "").strip())
        if usuario is None or not usuario.ativo or usuario.deletado_em is not None:
            raise NaoAutenticado("Login ou senha inválidos.")
        if not usuario.autenticar(senha):
            raise NaoAutenticado("Login ou senha inválidos.")
        return usuario

    def emitir_token(self, usuario: Usuario) -> str:
        """Gera o token assinado que identifica a sessão do usuário."""
        agora = datetime.now(timezone.utc)
        carga = {
            "sub": str(usuario.id_usuario),
            "tipo": usuario.tipo_usuario.value,
            "iat": agora,
            "exp": agora + timedelta(minutes=self.validade_minutos),
        }
        return jwt.encode(carga, self.segredo, algorithm=ALGORITMO_TOKEN)

    def identificar_usuario(self, token: str) -> Usuario:
        """Devolve o usuário ativo dono do token, ou recusa o acesso."""
        try:
            carga = jwt.decode(token, self.segredo, algorithms=[ALGORITMO_TOKEN])
            id_usuario = int(carga["sub"])
        except (jwt.PyJWTError, KeyError, ValueError):
            raise NaoAutenticado(MENSAGEM_SESSAO_INVALIDA) from None
        usuario = self.repo_usuario.buscar_por_id(id_usuario)
        if usuario is None or not usuario.ativo:
            raise NaoAutenticado(MENSAGEM_SESSAO_INVALIDA)
        return usuario
