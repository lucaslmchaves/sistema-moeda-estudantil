"""Repositório de persistência das transações de moedas."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from model.resgate_vantagem import ResgateVantagem
from model.transacao import Transacao
from repository.interfaces import IRepositorioTransacao


class RepositorioTransacao(IRepositorioTransacao):
    """Grava envios de moedas e resgates de vantagens por meio do ORM."""

    def __init__(self, sessao: Session):
        """Recebe a sessão do banco usada em todas as operações."""
        self.sessao = sessao

    def salvar(self, transacao: Transacao) -> Transacao:
        """Salva a transação na base de dados."""
        self.sessao.add(transacao)
        self.sessao.flush()
        return transacao

    def codigo_existe(self, codigo: str) -> bool:
        """Confere se algum resgate já usa o código."""
        consulta = select(ResgateVantagem.id_transacao).where(ResgateVantagem.codigo == codigo)
        return self.sessao.execute(consulta).first() is not None
