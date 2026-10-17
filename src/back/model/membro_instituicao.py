from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, declared_attr, mapped_column, relationship

from model.usuario import Usuario

if TYPE_CHECKING:
    from model.transacao import Transacao


class MembroInstituicao(Usuario):
    """Classe base abstrata para membros de instituição de ensino (Aluno e Professor)."""

    __abstract__ = True

    @declared_attr
    def nome(cls) -> Mapped[str]:
        return mapped_column(String(150), nullable=False)

    @declared_attr
    def cpf(cls) -> Mapped[str]:
        return mapped_column(String(14), unique=True, nullable=False)

    @declared_attr
    def id_instituicao(cls) -> Mapped[int]:
        return mapped_column(
            Integer,
            ForeignKey(
                "instituicao_ensino.id_instituicao",
                name=f"fk_{cls.__tablename__}_instituicao",
            ),
            nullable=False,
        )

    @declared_attr
    def instituicao(cls):
        return relationship("InstituicaoEnsino")

    @declared_attr
    def conta(cls):
        return relationship(
            "Conta",
            primaryjoin=f"foreign(Conta.id_usuario) == {cls.__name__}.id_usuario",
            uselist=False,
            overlaps="usuario",
        )

    def extrato(self) -> list["Transacao"]:
        """Retorna o extrato de transações do membro da instituição (método abstrato)."""
        raise NotImplementedError("Subclasses de MembroInstituicao devem implementar extrato().")
