from typing import ClassVar, TYPE_CHECKING
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.model.enums import TipoUsuario
from app.model.membro_instituicao import MembroInstituicao
from app.model.transacao import ordenar_por_data_decrescente

if TYPE_CHECKING:
    from app.model.envio_moedas import EnvioMoedas
    from app.model.transacao import Transacao


class Professor(MembroInstituicao):
    """Modelo da entidade Professor com herança joined."""

    __tablename__ = "professor"

    CREDITO_SEMESTRAL: ClassVar[int] = 1000

    id_usuario: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("usuario.id_usuario", name="fk_professor_usuario"),
        primary_key=True,
    )
    departamento: Mapped[str] = mapped_column(
        String(100), nullable=False
    )

    __mapper_args__ = {
        "polymorphic_identity": TipoUsuario.PROFESSOR,
    }

    envios_enviados: Mapped[list["EnvioMoedas"]] = relationship(
        "EnvioMoedas",
        foreign_keys="[EnvioMoedas.id_professor]",
        viewonly=True,
    )

    def receber_credito_semestral(self) -> bool:
        """Credita 1000 moedas na conta do professor. Retorna True em sucesso."""
        if self.conta is not None:
            return self.conta.creditar(self.CREDITO_SEMESTRAL)
        return False

    def extrato(self) -> list["Transacao"]:
        """Devolve os envios do professor, do mais recente ao mais antigo."""
        return ordenar_por_data_decrescente(list(self.envios_enviados))
