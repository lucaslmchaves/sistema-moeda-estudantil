from sqlalchemy import ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.model.enums import TipoTransacao
from app.model.transacao import Transacao


class ResgateVantagem(Transacao):
    """Modelo da entidade Resgate de Vantagem com herança joined de Transacao."""

    __tablename__ = "resgate_vantagem"
    __table_args__ = (
        Index("ix_resgate_vantagem_id_aluno", "id_aluno"),
    )

    id_transacao: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("transacao.id_transacao", name="fk_resgate_vantagem_transacao"),
        primary_key=True,
    )
    id_aluno: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("aluno.id_usuario", name="fk_resgate_vantagem_aluno"),
        nullable=False,
    )
    id_vantagem: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("vantagem.id_vantagem", name="fk_resgate_vantagem_vantagem"),
        nullable=False,
    )
    codigo: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False
    )

    __mapper_args__ = {
        "polymorphic_identity": TipoTransacao.RESGATE_VANTAGEM,
    }

    aluno = relationship("Aluno", foreign_keys=[id_aluno])
    vantagem = relationship("Vantagem", foreign_keys=[id_vantagem])
