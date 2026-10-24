"""Repositório de persistência para a entidade Vantagem."""

from datetime import datetime, timezone

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.model.empresa_parceira import EmpresaParceira
from app.model.vantagem import Vantagem
from app.repository.interfaces import IRepositorioVantagem


class RepositorioVantagem(IRepositorioVantagem):
    """Realiza a persistência das vantagens no banco por meio do ORM."""

    def __init__(self, sessao: Session):
        """Recebe a sessão do banco usada em todas as operações."""
        self.sessao = sessao

    def _ativas(self) -> Select:
        """Monta a consulta das vantagens ativas cuja empresa também está ativa."""
        return (
            select(Vantagem)
            .join(EmpresaParceira, EmpresaParceira.id_usuario == Vantagem.id_empresa)
            .where(Vantagem.deletado_em.is_(None), EmpresaParceira.deletado_em.is_(None))
        )

    def salvar(self, vantagem: Vantagem) -> Vantagem:
        """Salva uma vantagem na base de dados."""
        self.sessao.add(vantagem)
        self.sessao.flush()
        return vantagem

    def buscar_por_id(self, id_vantagem: int) -> Vantagem | None:
        """Busca uma vantagem ativa pelo identificador."""
        consulta = self._ativas().where(Vantagem.id_vantagem == id_vantagem)
        return self.sessao.execute(consulta).scalar_one_or_none()

    def listar(self) -> list[Vantagem]:
        """Lista as vantagens ativas, da mais recente para a mais antiga."""
        consulta = self._ativas().order_by(Vantagem.id_vantagem.desc())
        return list(self.sessao.execute(consulta).scalars().all())

    def listar_por_empresa(self, id_empresa: int) -> list[Vantagem]:
        """Lista as vantagens ativas de uma empresa."""
        consulta = self._ativas().where(Vantagem.id_empresa == id_empresa)
        consulta = consulta.order_by(Vantagem.id_vantagem.desc())
        return list(self.sessao.execute(consulta).scalars().all())

    def marcar_excluida(self, vantagem: Vantagem) -> bool:
        """Aplica a exclusão lógica, preservando os resgates já feitos."""
        vantagem.deletado_em = datetime.now(timezone.utc)
        self.sessao.flush()
        return True
