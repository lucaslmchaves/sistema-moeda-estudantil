"""Rotas e controladores HTTP do recurso de Instituição de Ensino."""

from fastapi import APIRouter, Depends, status

from controller.dependencias import obter_servico_instituicao
from controller.schemas import InstituicaoRespostaSchema
from service.servico_instituicao import ServicoInstituicao

router = APIRouter(prefix="/instituicoes", tags=["Instituições"])


@router.get(
    "",
    response_model=list[InstituicaoRespostaSchema],
    status_code=status.HTTP_200_OK,
    summary="Listar instituições de ensino",
    description="Devolve as instituições de ensino para o vínculo dos novos alunos.",
)
def listar_instituicoes(
    servico: ServicoInstituicao = Depends(obter_servico_instituicao),
) -> list[InstituicaoRespostaSchema]:
    """Lista todas as instituições de ensino cadastradas no sistema."""
    instituicoes = servico.listar_instituicoes()
    return [InstituicaoRespostaSchema.model_validate(i) for i in instituicoes]
