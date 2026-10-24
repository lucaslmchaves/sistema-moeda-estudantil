"""Repositório de acesso às contas de moedas."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.model.conta import Conta
from app.repository.interfaces import IRepositorioConta


class RepositorioConta(IRepositorioConta):
    """Consulta contas no banco, com trava de linha para as atualizações de saldo."""

    def __init__(self, sessao: Session):
        """Recebe a sessão do banco usada em todas as operações."""
        self.sessao = sessao

    def buscar_por_usuario(self, id_usuario: int, para_atualizar: bool = False) -> Conta | None:
        """Busca a conta do usuário; para atualizar, trava a linha até o fim da transação."""
        consulta = select(Conta).where(Conta.id_usuario == id_usuario)
        if para_atualizar:
            consulta = consulta.with_for_update()
        return self.sessao.execute(consulta).scalar_one_or_none()
