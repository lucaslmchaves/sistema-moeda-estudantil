"""Repositório de persistência para a entidade Empresa Parceira."""

from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session

from model.empresa_parceira import EmpresaParceira
from model.usuario import Usuario
from repository.interfaces import IRepositorioEmpresa


class RepositorioEmpresa(IRepositorioEmpresa):
    """Realiza a persistência de empresas parceiras no banco por meio do ORM."""

    def __init__(self, sessao: Session):
        """Recebe a sessão do banco usada em todas as operações."""
        self.sessao = sessao

    def salvar(self, empresa: EmpresaParceira) -> EmpresaParceira:
        """Salva ou atualiza uma empresa parceira na base de dados."""
        self.sessao.add(empresa)
        self.sessao.flush()
        return empresa

    def buscar_por_id(self, id_usuario: int) -> EmpresaParceira | None:
        """Busca uma empresa ativa por ID."""
        consulta = (
            select(EmpresaParceira)
            .where(
                EmpresaParceira.id_usuario == id_usuario,
                EmpresaParceira.deletado_em.is_(None),
            )
        )
        return self.sessao.execute(consulta).scalar_one_or_none()

    def buscar_por_cnpj(self, cnpj: str) -> EmpresaParceira | None:
        """Busca uma empresa por CNPJ (para validação de unicidade)."""
        consulta = select(EmpresaParceira).where(EmpresaParceira.cnpj == cnpj)
        return self.sessao.execute(consulta).scalar_one_or_none()

    def buscar_por_email(self, email: str) -> EmpresaParceira | None:
        """Busca uma empresa por e-mail (para validação de unicidade)."""
        consulta = select(EmpresaParceira).where(EmpresaParceira.email == email)
        return self.sessao.execute(consulta).scalar_one_or_none()

    def buscar_por_login(self, login: str) -> Usuario | None:
        """Busca um usuário por login (para validação de unicidade)."""
        consulta = select(Usuario).where(Usuario.login == login)
        return self.sessao.execute(consulta).scalar_one_or_none()

    def marcar_excluido(self, empresa: EmpresaParceira) -> bool:
        """Aplica exclusão lógica na empresa marcando deletado_em e ativo=False. Retorna True."""
        empresa.deletado_em = datetime.now(timezone.utc)
        empresa.ativo = False
        self.sessao.flush()
        return True
