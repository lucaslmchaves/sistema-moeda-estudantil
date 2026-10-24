from sqlalchemy import CheckConstraint, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.model.base import Base


class Conta(Base):
    """Modelo da entidade Conta de aluno ou professor."""

    __tablename__ = "conta"
    __table_args__ = (
        CheckConstraint("saldo >= 0", name="ck_conta_saldo_positivo"),
    )

    id_conta: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    id_usuario: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("usuario.id_usuario", name="fk_conta_usuario"),
        unique=True,
        nullable=False,
    )
    saldo: Mapped[int] = mapped_column(
        Integer, default=0, nullable=False
    )

    usuario = relationship("Usuario", foreign_keys=[id_usuario])

    def consultar_saldo(self) -> int:
        """Retorna o saldo atual da conta."""
        return self.saldo

    def tem_saldo(self, valor: int) -> bool:
        """Verifica se há saldo suficiente para o valor informado (> 0)."""
        return valor > 0 and self.saldo >= valor

    def creditar(self, valor: int) -> bool:
        """Credita o valor no saldo. Retorna True em sucesso, False se valor <= 0."""
        if valor <= 0:
            return False
        self.saldo += valor
        return True

    def debitar(self, valor: int) -> bool:
        """Debita o valor do saldo se houver saldo suficiente. Retorna False se não cobrir."""
        if valor <= 0 or not self.tem_saldo(valor):
            return False
        self.saldo -= valor
        return True
