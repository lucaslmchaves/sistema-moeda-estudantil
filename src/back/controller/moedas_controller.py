"""Rotas e controladores HTTP do envio de moedas, do resgate de vantagens e do extrato."""

from fastapi import APIRouter, Depends, status

from controller.autenticacao import exigir_perfil
from controller.dependencias import obter_servico_moedas
from controller.schemas import (
    EnvioMoedasCriarSchema,
    EnvioMoedasRespostaSchema,
    ExtratoRespostaSchema,
    ResgateCriarSchema,
    ResgateRespostaSchema,
    montar_extrato,
)
from model.enums import TipoUsuario
from model.usuario import Usuario
from service.servico_moedas import ServicoMoedas

router = APIRouter(prefix="/moedas", tags=["Moedas"])


@router.post(
    "/enviar",
    response_model=EnvioMoedasRespostaSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Enviar moedas a um aluno",
    description="O professor envia moedas a um aluno, com o motivo do reconhecimento.",
)
def enviar_moedas(
    dados: EnvioMoedasCriarSchema,
    professor: Usuario = Depends(exigir_perfil(TipoUsuario.PROFESSOR)),
    servico: ServicoMoedas = Depends(obter_servico_moedas),
) -> EnvioMoedasRespostaSchema:
    """Envia moedas do professor autenticado ao aluno e avisa o aluno por e-mail."""
    envio = servico.enviar_moedas(professor.id_usuario, dados.model_dump())
    return EnvioMoedasRespostaSchema(
        id_transacao=envio.id_transacao,
        id_aluno=envio.id_aluno,
        valor=envio.valor,
        mensagem=envio.mensagem,
    )


@router.post(
    "/resgatar",
    response_model=ResgateRespostaSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Resgatar uma vantagem",
    description="O aluno troca moedas por uma vantagem e recebe o código do cupom por e-mail.",
)
def resgatar_vantagem(
    dados: ResgateCriarSchema,
    aluno: Usuario = Depends(exigir_perfil(TipoUsuario.ALUNO)),
    servico: ServicoMoedas = Depends(obter_servico_moedas),
) -> ResgateRespostaSchema:
    """Resgata a vantagem para o aluno autenticado e envia os e-mails do resgate."""
    resgate = servico.resgatar_vantagem(aluno.id_usuario, dados.id_vantagem)
    return ResgateRespostaSchema(
        id_transacao=resgate.id_transacao,
        id_vantagem=resgate.id_vantagem,
        valor=resgate.valor,
        codigo=resgate.codigo,
    )


@router.get(
    "/extrato",
    response_model=ExtratoRespostaSchema,
    status_code=status.HTTP_200_OK,
    summary="Consultar o extrato",
    description="Mostra o saldo e as movimentações do aluno ou do professor autenticado.",
)
def consultar_extrato(
    usuario: Usuario = Depends(exigir_perfil(TipoUsuario.ALUNO, TipoUsuario.PROFESSOR)),
    servico: ServicoMoedas = Depends(obter_servico_moedas),
) -> ExtratoRespostaSchema:
    """Devolve o saldo e as transações do usuário autenticado."""
    extrato = servico.consultar_extrato(usuario.id_usuario, usuario.tipo_usuario)
    return montar_extrato(extrato, usuario.tipo_usuario)
