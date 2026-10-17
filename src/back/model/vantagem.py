from datetime import datetime
from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from model.base import Base


class Vantagem(Base):
    """Modelo da entidade Vantagem oferecida por empresa parceira."""

    __tablename__ = "vantagem"
    __table_args__ = (
        CheckConstraint("custo > 0", name="ck_vantagem_custo_positivo"),
        Index("ix_vantagem_id_empresa", "id_empresa"),
    )

    id_vantagem: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    id_empresa: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("empresa_parceira.id_usuario", name="fk_vantagem_empresa_parceira"),
        nullable=False,
    )
    descricao: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    foto: Mapped[str] = mapped_column(
        String(500), nullable=False
    )
    custo: Mapped[int] = mapped_column(
        Integer, nullable=False
    )
    deletado_em: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    empresa = relationship("EmpresaParceira", back_populates="vantagens")
