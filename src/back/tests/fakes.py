"""Repositórios falsos em memória que obedecem aos contratos, para testar os serviços sem banco."""

from datetime import datetime, timezone
from itertools import count

from model.aluno import Aluno
from model.conta import Conta
from model.empresa_parceira import EmpresaParceira
from model.instituicao_ensino import InstituicaoEnsino
from repository.interfaces import IRepositorioAluno, IRepositorioEmpresa, IRepositorioInstituicao


class RepositorioInstituicaoFalso(IRepositorioInstituicao):
    """Guarda instituições numa lista em memória."""

    def __init__(self, instituicoes: list[InstituicaoEnsino] | None = None):
        """Inicia com as instituições informadas."""
        self.instituicoes = instituicoes or []

    def buscar_por_id(self, id_instituicao: int) -> InstituicaoEnsino | None:
        """Procura a instituição na lista."""
        return next((i for i in self.instituicoes if i.id_instituicao == id_instituicao), None)

    def listar(self) -> list[InstituicaoEnsino]:
        """Devolve a lista inteira."""
        return list(self.instituicoes)


class RepositorioAlunoFalso(IRepositorioAluno):
    """Guarda alunos e contas em memória, com ids sequenciais."""

    def __init__(self):
        """Inicia vazio."""
        self.alunos: list[Aluno] = []
        self.contas: list[Conta] = []
        self._ids = count(1)

    def salvar(self, aluno: Aluno) -> Aluno:
        """Atribui id ao aluno novo e o guarda."""
        if aluno.id_usuario is None:
            aluno.id_usuario = next(self._ids)
            self.alunos.append(aluno)
        return aluno

    def salvar_conta(self, conta: Conta) -> Conta:
        """Guarda a conta."""
        self.contas.append(conta)
        return conta

    def buscar_por_id(self, id_usuario: int) -> Aluno | None:
        """Procura entre os alunos ativos."""
        return next((a for a in self.listar() if a.id_usuario == id_usuario), None)

    def listar(self) -> list[Aluno]:
        """Devolve só os alunos não excluídos."""
        return [a for a in self.alunos if a.deletado_em is None]

    def buscar_por_cpf(self, cpf: str) -> Aluno | None:
        """Procura entre todos, inclusive excluídos, como o banco faz."""
        return next((a for a in self.alunos if a.cpf == cpf), None)

    def buscar_por_email(self, email: str) -> Aluno | None:
        """Procura entre todos, inclusive excluídos, como o banco faz."""
        return next((a for a in self.alunos if a.email == email), None)

    def buscar_por_login(self, login: str):
        """Procura entre todos, inclusive excluídos, como o banco faz."""
        return next((a for a in self.alunos if a.login == login), None)

    def marcar_excluido(self, aluno: Aluno) -> bool:
        """Marca o aluno como excluído."""
        aluno.deletado_em = datetime.now(timezone.utc)
        aluno.ativo = False
        return True


class RepositorioEmpresaFalso(IRepositorioEmpresa):
    """Guarda empresas em memória, com ids sequenciais."""

    def __init__(self):
        """Inicia vazio."""
        self.empresas: list[EmpresaParceira] = []
        self._ids = count(1)

    def salvar(self, empresa: EmpresaParceira) -> EmpresaParceira:
        """Atribui id à empresa nova e a guarda."""
        if empresa.id_usuario is None:
            empresa.id_usuario = next(self._ids)
            self.empresas.append(empresa)
        return empresa

    def buscar_por_id(self, id_usuario: int) -> EmpresaParceira | None:
        """Procura entre as empresas ativas."""
        return next((e for e in self.listar() if e.id_usuario == id_usuario), None)

    def listar(self) -> list[EmpresaParceira]:
        """Devolve só as empresas não excluídas."""
        return [e for e in self.empresas if e.deletado_em is None]

    def buscar_por_cnpj(self, cnpj: str) -> EmpresaParceira | None:
        """Procura entre todas as empresas."""
        return next((e for e in self.empresas if e.cnpj == cnpj), None)

    def buscar_por_email(self, email: str) -> EmpresaParceira | None:
        """Procura entre todas as empresas."""
        return next((e for e in self.empresas if e.email == email), None)

    def buscar_por_login(self, login: str):
        """Procura entre todas as empresas."""
        return next((e for e in self.empresas if e.login == login), None)

    def marcar_excluido(self, empresa: EmpresaParceira) -> bool:
        """Marca a empresa como excluída."""
        empresa.deletado_em = datetime.now(timezone.utc)
        empresa.ativo = False
        return True
