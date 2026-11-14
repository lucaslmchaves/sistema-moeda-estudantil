from sqlalchemy import Integer, LargeBinary, String
from sqlalchemy.orm import Mapped, mapped_column

from app.model.base import Base


class FotoVantagem(Base):
    """Foto de uma vantagem guardada no próprio banco de dados."""

    __tablename__ = "foto_vantagem"

    id_foto: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    conteudo: Mapped[bytes] = mapped_column(
        LargeBinary, nullable=False
    )
    extensao: Mapped[str] = mapped_column(
        String(10), nullable=False
    )
