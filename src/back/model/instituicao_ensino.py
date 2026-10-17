from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from model.base import Base


class InstituicaoEnsino(Base):
    """Modelo da entidade Instituição de Ensino."""

    __tablename__ = "instituicao_ensino"

    id_instituicao: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    nome: Mapped[str] = mapped_column(
        String(150), unique=True, nullable=False
    )
