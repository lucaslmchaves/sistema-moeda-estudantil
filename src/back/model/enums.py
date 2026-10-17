import enum


class TipoUsuario(str, enum.Enum):
    """Tipos de usuário suportados no sistema."""
    ALUNO = "ALUNO"
    PROFESSOR = "PROFESSOR"
    EMPRESA_PARCEIRA = "EMPRESA_PARCEIRA"


class TipoTransacao(str, enum.Enum):
    """Tipos de transação financeira no sistema."""
    ENVIO_MOEDAS = "ENVIO_MOEDAS"
    RESGATE_VANTAGEM = "RESGATE_VANTAGEM"
