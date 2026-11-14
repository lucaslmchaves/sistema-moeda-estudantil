"""Armazenamento das fotos das vantagens no banco de dados."""

from sqlalchemy.orm import Session

from app.model.foto_vantagem import FotoVantagem
from app.repository.interfaces import IArmazenamentoFoto

PREFIXO_PUBLICO = "/fotos"


class ArmazenamentoFotoBanco(IArmazenamentoFoto):
    """Grava cada foto numa linha da tabela foto_vantagem e devolve o caminho público dela."""

    def __init__(self, sessao: Session):
        """Recebe a sessão do banco em que as fotos são gravadas."""
        self.sessao = sessao

    def salvar(self, conteudo: bytes, extensao: str) -> str:
        """Guarda a foto e devolve o caminho pelo qual a API a serve."""
        foto = FotoVantagem(conteudo=conteudo, extensao=extensao)
        self.sessao.add(foto)
        self.sessao.flush()
        return f"{PREFIXO_PUBLICO}/{foto.id_foto}"

    def obter(self, id_foto: int) -> FotoVantagem | None:
        """Devolve a foto guardada ou None quando ela não existe."""
        return self.sessao.get(FotoVantagem, id_foto)
