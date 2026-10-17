"""Repositório de persistência para a entidade Aluno."""

from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session

from model.aluno import Aluno
from model.conta import Conta
from model.usuario import Usuario
from repository.interfaces import IRepositorioAluno


class RepositorioAluno(IRepositorioAluno):
    """Realiza a persistência de alunos no banco por meio do ORM."""

    def __init__(self, sessao: Session):
        """Recebe a sessão do banco usada em todas as operações."""
        self.sessao = sessao

    def salvar(self, aluno: Aluno) -> Aluno:
        """Salva ou atualiza um aluno na base de dados."""
        self.sessao.add(aluno)
        self.sessao.flush()
        return aluno

    def salvar_conta(self, conta: Conta) -> Conta:
        """Salva uma conta vinculada ao aluno na base de dados."""
        self.sessao.add(conta)
        self.sessao.flush()
        return conta

    def buscar_por_id(self, id_usuario: int) -> Aluno | None:
        """Busca um aluno ativo por ID."""
        consulta = (
            select(Aluno)
            .where(Aluno.id_usuario == id_usuario, Aluno.deletado_em.is_(None))
        )
        return self.sessao.execute(consulta).scalar_one_or_none()

    def listar(self) -> list[Aluno]:
        """Lista todos os alunos ativos (deletado_em IS NULL)."""
        consulta = (
            select(Aluno)
            .where(Aluno.deletado_em.is_(None))
            .order_by(Aluno.id_usuario)
        )
        return list(self.sessao.execute(consulta).scalars().all())

    def buscar_por_cpf(self, cpf: str) -> Aluno | None:
        """Busca um aluno por CPF (para validação de unicidade)."""
        consulta = select(Aluno).where(Aluno.cpf == cpf)
        return self.sessao.execute(consulta).scalar_one_or_none()

    def buscar_por_email(self, email: str) -> Aluno | None:
        """Busca um aluno por e-mail (para validação de unicidade)."""
        consulta = select(Aluno).where(Aluno.email == email)
        return self.sessao.execute(consulta).scalar_one_or_none()

    def buscar_por_login(self, login: str) -> Usuario | None:
        """Busca um usuário por login (para validação de unicidade)."""
        consulta = select(Usuario).where(Usuario.login == login)
        return self.sessao.execute(consulta).scalar_one_or_none()

    def marcar_excluido(self, aluno: Aluno) -> bool:
        """Aplica a exclusão lógica no aluno, preservando o histórico."""
        aluno.deletado_em = datetime.now(timezone.utc)
        aluno.ativo = False
        self.sessao.flush()
        return True
