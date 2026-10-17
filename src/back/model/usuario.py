"""Modelo base de Usuário com herança joined para Aluno, Professor e Empresa."""

from datetime import datetime
from sqlalchemy import Boolean, DateTime, Enum, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from model.base import Base
from model.enums import TipoUsuario
from model.seguranca import verificar_senha


class Usuario(Base):
    """Representa a entidade de autenticação comum a todos os atores do sistema."""

    __tablename__ = "usuario"

    id_usuario: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    login: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    senha_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    tipo_usuario: Mapped[TipoUsuario] = mapped_column(
        Enum(TipoUsuario, name="tipo_usuario_enum"), nullable=False
    )
    ativo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    deletado_em: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __mapper_args__ = {
        "polymorphic_on": tipo_usuario,
    }

    def autenticar(self, senha: str) -> bool:
        """Compara a senha informada com o hash guardado do usuário."""
        return verificar_senha(senha, self.senha_hash)
