from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.model.enums import TipoUsuario
from app.model.usuario import Usuario


class EmpresaParceira(Usuario):
    """Modelo da entidade Empresa Parceira com herança joined."""

    __tablename__ = "empresa_parceira"

    id_usuario: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("usuario.id_usuario", name="fk_empresa_parceira_usuario", ondelete="CASCADE"),
        primary_key=True,
    )
    nome: Mapped[str] = mapped_column(
        String(150), nullable=False
    )
    email: Mapped[str] = mapped_column(
        String(150), unique=True, nullable=False
    )
    cnpj: Mapped[str] = mapped_column(
        String(18), unique=True, nullable=False
    )

    __mapper_args__ = {
        "polymorphic_identity": TipoUsuario.EMPRESA_PARCEIRA,
    }

    vantagens = relationship("Vantagem", back_populates="empresa")
