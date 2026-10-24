"""Repositório de consulta de usuários, usado pela autenticação."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from model.usuario import Usuario
from repository.interfaces import IRepositorioUsuario


class RepositorioUsuario(IRepositorioUsuario):
    """Consulta usuários de qualquer perfil no banco por meio do ORM."""

    def __init__(self, sessao: Session):
        """Recebe a sessão do banco usada em todas as operações."""
        self.sessao = sessao

    def buscar_por_login(self, login: str) -> Usuario | None:
        """Busca um usuário pelo login."""
        consulta = select(Usuario).where(Usuario.login == login)
        return self.sessao.execute(consulta).scalar_one_or_none()

    def buscar_por_id(self, id_usuario: int) -> Usuario | None:
        """Busca um usuário ativo pelo identificador."""
        consulta = select(Usuario).where(
            Usuario.id_usuario == id_usuario, Usuario.deletado_em.is_(None)
        )
        return self.sessao.execute(consulta).scalar_one_or_none()
