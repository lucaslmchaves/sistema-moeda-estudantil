"""Exceções de domínio do sistema de moeda estudantil."""


class ExcecaoDominio(Exception):
    """Classe base para exceções de domínio."""

    def __init__(self, mensagem: str):
        self.mensagem = mensagem
        super().__init__(mensagem)


class NaoEncontrado(ExcecaoDominio):
    """Lançada quando um recurso solicitado não é encontrado no sistema."""
    pass


class Conflito(ExcecaoDominio):
    """Lançada quando há conflito de unicidade (ex: login, CPF, CNPJ, e-mail já cadastrado)."""
    pass


class DadoInvalido(ExcecaoDominio):
    """Lançada quando dados informados falham na validação de regras de negócio."""
    pass
