from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from model.enums import TipoUsuario
from model.membro_instituicao import MembroInstituicao
from model.transacao import ordenar_por_data_decrescente

if TYPE_CHECKING:
    from model.envio_moedas import EnvioMoedas
    from model.resgate_vantagem import ResgateVantagem
    from model.transacao import Transacao


class Aluno(MembroInstituicao):
    """Modelo da entidade Aluno com herança joined."""

    __tablename__ = "aluno"

    id_usuario: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("usuario.id_usuario", name="fk_aluno_usuario"),
        primary_key=True,
    )
    email: Mapped[str] = mapped_column(
        String(150), unique=True, nullable=False
    )
    rg: Mapped[str] = mapped_column(
        String(20), nullable=False
    )
    endereco: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    curso: Mapped[str] = mapped_column(
        String(100), nullable=False
    )

    __mapper_args__ = {
        "polymorphic_identity": TipoUsuario.ALUNO,
    }

    envios_recebidos: Mapped[list["EnvioMoedas"]] = relationship(
        "EnvioMoedas",
        foreign_keys="[EnvioMoedas.id_aluno]",
        viewonly=True,
    )
    resgates: Mapped[list["ResgateVantagem"]] = relationship(
        "ResgateVantagem",
        foreign_keys="[ResgateVantagem.id_aluno]",
        viewonly=True,
    )

    def extrato(self) -> list["Transacao"]:
        """Devolve os envios recebidos e os resgates do aluno, do mais recente ao mais antigo."""
        return ordenar_por_data_decrescente([*self.envios_recebidos, *self.resgates])
