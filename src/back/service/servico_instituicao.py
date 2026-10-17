"""Serviço com os casos de uso de consulta das instituições de ensino."""

from model.instituicao_ensino import InstituicaoEnsino
from repository.interfaces import IRepositorioInstituicao


class ServicoInstituicao:
    """Lista as instituições de ensino conveniadas."""

    def __init__(self, repo_instituicao: IRepositorioInstituicao):
        """Recebe o repositório por interface, sem conhecer a implementação."""
        self.repo_instituicao = repo_instituicao

    def listar_instituicoes(self) -> list[InstituicaoEnsino]:
        """Devolve as instituições para o aluno escolher no cadastro."""
        return self.repo_instituicao.listar()
