"""Repositório de consulta de professores."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from model.professor import Professor
from repository.interfaces import IRepositorioProfessor


class RepositorioProfessor(IRepositorioProfessor):
    """Consulta professores no banco por meio do ORM."""

    def __init__(self, sessao: Session):
        """Recebe a sessão do banco usada em todas as operações."""
        self.sessao = sessao

    def buscar_por_id(self, id_usuario: int) -> Professor | None:
        """Busca um professor ativo pelo identificador."""
        consulta = select(Professor).where(
            Professor.id_usuario == id_usuario, Professor.deletado_em.is_(None)
        )
        return self.sessao.execute(consulta).scalar_one_or_none()

    def listar(self) -> list[Professor]:
        """Lista os professores ativos."""
        consulta = (
            select(Professor).where(Professor.deletado_em.is_(None)).order_by(Professor.id_usuario)
        )
        return list(self.sessao.execute(consulta).scalars().all())
