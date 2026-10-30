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


class NaoAutenticado(ExcecaoDominio):
    """Lançada quando o login, a senha ou o token de acesso não são válidos."""
    pass


class AcessoNegado(ExcecaoDominio):
    """Lançada quando o usuário autenticado não pode executar a operação pedida."""
    pass
