"""Armazenamento das fotos das vantagens em uma pasta local."""

from pathlib import Path
from uuid import uuid4

from repository.interfaces import IArmazenamentoFoto

PREFIXO_PUBLICO = "/uploads"


class ArmazenamentoFotoLocal(IArmazenamentoFoto):
    """Grava cada foto com nome único numa pasta e devolve o caminho público dela."""

    def __init__(self, pasta: str):
        """Recebe a pasta onde as fotos ficam guardadas."""
        self.pasta = Path(pasta)

    def salvar(self, conteudo: bytes, extensao: str) -> str:
        """Guarda a foto e devolve o caminho pelo qual a API a serve."""
        self.pasta.mkdir(parents=True, exist_ok=True)
        nome = f"{uuid4().hex}.{extensao}"
        (self.pasta / nome).write_bytes(conteudo)
        return f"{PREFIXO_PUBLICO}/{nome}"
