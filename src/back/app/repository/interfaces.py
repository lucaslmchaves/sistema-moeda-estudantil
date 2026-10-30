"""Contratos dos repositórios: os serviços dependem destas abstrações, não do banco."""

from abc import ABC, abstractmethod

from app.model.aluno import Aluno
from app.model.conta import Conta
from app.model.empresa_parceira import EmpresaParceira
from app.model.instituicao_ensino import InstituicaoEnsino
from app.model.professor import Professor
from app.model.transacao import Transacao
from app.model.usuario import Usuario
from app.model.vantagem import Vantagem


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


class IRepositorioUsuario(ABC):
    """Contrato de consulta dos usuários para a autenticação."""

    @abstractmethod
    def buscar_por_login(self, login: str) -> Usuario | None:
        """Devolve o usuário dono do login informado, se houver."""

    @abstractmethod
    def buscar_por_id(self, id_usuario: int) -> Usuario | None:
        """Devolve o usuário ativo com o identificador informado."""


class IRepositorioProfessor(ABC):
    """Contrato de consulta dos professores."""

    @abstractmethod
    def buscar_por_id(self, id_usuario: int) -> Professor | None:
        """Devolve o professor ativo com o identificador informado."""

    @abstractmethod
    def listar(self) -> list[Professor]:
        """Devolve todos os professores ativos."""


class IRepositorioConta(ABC):
    """Contrato de acesso às contas de moedas."""

    @abstractmethod
    def buscar_por_usuario(self, id_usuario: int, para_atualizar: bool = False) -> Conta | None:
        """Devolve a conta do usuário, travando a linha quando for para atualizar."""


class IRepositorioVantagem(ABC):
    """Contrato de persistência das vantagens oferecidas pelas empresas."""

    @abstractmethod
    def salvar(self, vantagem: Vantagem) -> Vantagem:
        """Grava uma vantagem."""

    @abstractmethod
    def buscar_por_id(self, id_vantagem: int) -> Vantagem | None:
        """Devolve a vantagem ativa, de empresa ativa, com o identificador informado."""

    @abstractmethod
    def listar(self) -> list[Vantagem]:
        """Devolve as vantagens ativas das empresas ativas."""

    @abstractmethod
    def listar_por_empresa(self, id_empresa: int) -> list[Vantagem]:
        """Devolve as vantagens ativas da empresa informada."""

    @abstractmethod
    def marcar_excluida(self, vantagem: Vantagem) -> bool:
        """Aplica a exclusão lógica na vantagem."""


class IRepositorioTransacao(ABC):
    """Contrato de persistência das transações de moedas."""

    @abstractmethod
    def salvar(self, transacao: Transacao) -> Transacao:
        """Grava um envio de moedas ou um resgate de vantagem."""

    @abstractmethod
    def codigo_existe(self, codigo: str) -> bool:
        """Informa se já existe um resgate com o código informado."""


class IArmazenamentoFoto(ABC):
    """Contrato de armazenamento das fotos das vantagens."""

    @abstractmethod
    def salvar(self, conteudo: bytes, extensao: str) -> str:
        """Guarda a foto e devolve o caminho público dela."""
