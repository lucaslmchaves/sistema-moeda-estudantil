from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from model.enums import TipoTransacao
from model.transacao import Transacao


class EnvioMoedas(Transacao):
    """Modelo da entidade Envio de Moedas com herança joined de Transacao."""

    __tablename__ = "envio_moedas"
    __table_args__ = (
        CheckConstraint("length(mensagem) > 0", name="ck_envio_moedas_mensagem_nao_vazia"),
        Index("ix_envio_moedas_id_professor", "id_professor"),
        Index("ix_envio_moedas_id_aluno", "id_aluno"),
    )

    id_transacao: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("transacao.id_transacao", name="fk_envio_moedas_transacao"),
        primary_key=True,
    )
    id_professor: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("professor.id_usuario", name="fk_envio_moedas_professor"),
        nullable=False,
    )
    id_aluno: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("aluno.id_usuario", name="fk_envio_moedas_aluno"),
        nullable=False,
    )
    mensagem: Mapped[str] = mapped_column(
        Text, nullable=False
    )

    __mapper_args__ = {
        "polymorphic_identity": TipoTransacao.ENVIO_MOEDAS,
    }

    professor = relationship("Professor", foreign_keys=[id_professor])
    aluno = relationship("Aluno", foreign_keys=[id_aluno])
