from datetime import datetime, timezone
from sqlalchemy import CheckConstraint, DateTime, Enum, Integer, func
from sqlalchemy.orm import Mapped, mapped_column

from model.base import Base
from model.enums import TipoTransacao


class Transacao(Base):
    """Modelo base de Transação com herança joined."""

    __tablename__ = "transacao"
    __table_args__ = (
        CheckConstraint("valor > 0", name="ck_transacao_valor_positivo"),
    )

    id_transacao: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    tipo_transacao: Mapped[TipoTransacao] = mapped_column(
        Enum(TipoTransacao, name="tipo_transacao_enum"),
        nullable=False,
    )
    data_hora: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    valor: Mapped[int] = mapped_column(
        Integer, nullable=False
    )

    __mapper_args__ = {
        "polymorphic_on": tipo_transacao,
    }


def ordenar_por_data_decrescente(transacoes: list[Transacao]) -> list[Transacao]:
    """Ordena as transações da mais recente para a mais antiga."""
    sem_data = datetime.min.replace(tzinfo=timezone.utc)
    return sorted(transacoes, key=lambda t: t.data_hora or sem_data, reverse=True)
