"""Repositório de persistência para a entidade Instituição de Ensino."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.model.instituicao_ensino import InstituicaoEnsino
from app.repository.interfaces import IRepositorioInstituicao


class RepositorioInstituicao(IRepositorioInstituicao):
    """Realiza a consulta de instituições de ensino no banco por meio do ORM."""

    def __init__(self, sessao: Session):
        """Recebe a sessão do banco usada em todas as operações."""
        self.sessao = sessao

    def buscar_por_id(self, id_instituicao: int) -> InstituicaoEnsino | None:
        """Busca uma instituição por ID."""
        consulta = select(InstituicaoEnsino).where(
            InstituicaoEnsino.id_instituicao == id_instituicao
        )
        return self.sessao.execute(consulta).scalar_one_or_none()

    def listar(self) -> list[InstituicaoEnsino]:
        """Lista todas as instituições de ensino cadastradas."""
        consulta = select(InstituicaoEnsino).order_by(InstituicaoEnsino.id_instituicao)
        return list(self.sessao.execute(consulta).scalars().all())
