"""Schemas Pydantic do envio de moedas, do resgate de vantagens e do extrato."""

from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, StringConstraints

from app.model.enums import TipoTransacao, TipoUsuario
from app.model.envio_moedas import EnvioMoedas
from app.model.resgate_vantagem import ResgateVantagem
from app.model.transacao import Transacao
from app.controller.schemas.tipos import TipoId
from app.service.servico_moedas import Extrato

TipoMensagem = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class EnvioMoedasCriarSchema(BaseModel):
    """Dados do envio de moedas de um professor a um aluno."""

    id_aluno: TipoId
    valor: int
    mensagem: TipoMensagem


class ResgateCriarSchema(BaseModel):
    """Vantagem que o aluno quer resgatar."""

    id_vantagem: TipoId


class EnvioMoedasRespostaSchema(BaseModel):
    """Comprovante do envio de moedas."""

    id_transacao: int
    id_aluno: int
    valor: int
    mensagem: str


class ResgateRespostaSchema(BaseModel):
    """Comprovante do resgate, com o código do cupom."""

    id_transacao: int
    id_vantagem: int
    valor: int
    codigo: str


class TransacaoExtratoSchema(BaseModel):
    """Uma linha do extrato, com o valor já assinado (positivo entra, negativo sai)."""

    id_transacao: int
    tipo: TipoTransacao
    data_hora: datetime
    valor: int
    descricao: str


class ExtratoRespostaSchema(BaseModel):
    """Saldo atual e movimentações do usuário."""

    saldo: int
    transacoes: list[TransacaoExtratoSchema]


def _linha_do_extrato(transacao: Transacao, perfil: TipoUsuario) -> TransacaoExtratoSchema:
    """Converte uma transação na linha do extrato vista pelo perfil informado."""
    if isinstance(transacao, EnvioMoedas):
        if perfil == TipoUsuario.PROFESSOR:
            valor = -transacao.valor
            descricao = f"Para {transacao.aluno.nome}: {transacao.mensagem}"
        else:
            valor = transacao.valor
            descricao = f"De {transacao.professor.nome}: {transacao.mensagem}"
    elif isinstance(transacao, ResgateVantagem):
        valor = -transacao.valor
        descricao = f"Resgate de \"{transacao.vantagem.descricao}\" (código {transacao.codigo})"
    else:
        raise TypeError("Tipo de transação desconhecido.")
    return TransacaoExtratoSchema(
        id_transacao=transacao.id_transacao,
        tipo=transacao.tipo_transacao,
        data_hora=transacao.data_hora,
        valor=valor,
        descricao=descricao,
    )


def montar_extrato(extrato: Extrato, perfil: TipoUsuario) -> ExtratoRespostaSchema:
    """Monta a resposta do extrato conforme o perfil de quem consulta."""
    return ExtratoRespostaSchema(
        saldo=extrato.saldo,
        transacoes=[_linha_do_extrato(t, perfil) for t in extrato.transacoes],
    )
