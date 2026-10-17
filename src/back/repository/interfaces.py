"""Contratos dos repositórios: os serviços dependem destas abstrações, não do banco."""

from abc import ABC, abstractmethod

from model.aluno import Aluno
from model.conta import Conta
from model.empresa_parceira import EmpresaParceira
from model.instituicao_ensino import InstituicaoEnsino
from model.usuario import Usuario


class IRepositorioAluno(ABC):
    """Contrato de persistência de alunos e de suas contas."""

    @abstractmethod
    def salvar(self, aluno: Aluno) -> Aluno:
        """Grava ou atualiza um aluno."""

    @abstractmethod
    def salvar_conta(self, conta: Conta) -> Conta:
        """Grava a conta de um aluno."""

    @abstractmethod
    def buscar_por_id(self, id_usuario: int) -> Aluno | None:
        """Devolve o aluno ativo com o identificador informado."""

    @abstractmethod
    def listar(self) -> list[Aluno]:
        """Devolve todos os alunos ativos."""

    @abstractmethod
    def buscar_por_cpf(self, cpf: str) -> Aluno | None:
        """Devolve o aluno dono do CPF informado, se houver."""

    @abstractmethod
    def buscar_por_email(self, email: str) -> Aluno | None:
        """Devolve o aluno dono do e-mail informado, se houver."""

    @abstractmethod
    def buscar_por_login(self, login: str) -> Usuario | None:
        """Devolve o usuário dono do login informado, se houver."""

    @abstractmethod
    def marcar_excluido(self, aluno: Aluno) -> bool:
        """Aplica a exclusão lógica no aluno."""


class IRepositorioEmpresa(ABC):
    """Contrato de persistência de empresas parceiras."""

    @abstractmethod
    def salvar(self, empresa: EmpresaParceira) -> EmpresaParceira:
        """Grava ou atualiza uma empresa parceira."""

    @abstractmethod
    def buscar_por_id(self, id_usuario: int) -> EmpresaParceira | None:
        """Devolve a empresa ativa com o identificador informado."""

    @abstractmethod
    def listar(self) -> list[EmpresaParceira]:
        """Devolve todas as empresas ativas."""

    @abstractmethod
    def buscar_por_cnpj(self, cnpj: str) -> EmpresaParceira | None:
        """Devolve a empresa dona do CNPJ informado, se houver."""

    @abstractmethod
    def buscar_por_email(self, email: str) -> EmpresaParceira | None:
        """Devolve a empresa dona do e-mail informado, se houver."""

    @abstractmethod
    def buscar_por_login(self, login: str) -> Usuario | None:
        """Devolve o usuário dono do login informado, se houver."""

    @abstractmethod
    def marcar_excluido(self, empresa: EmpresaParceira) -> bool:
        """Aplica a exclusão lógica na empresa."""


class IRepositorioInstituicao(ABC):
    """Contrato de consulta das instituições de ensino."""

    @abstractmethod
    def buscar_por_id(self, id_instituicao: int) -> InstituicaoEnsino | None:
        """Devolve a instituição com o identificador informado."""

    @abstractmethod
    def listar(self) -> list[InstituicaoEnsino]:
        """Devolve todas as instituições de ensino."""
