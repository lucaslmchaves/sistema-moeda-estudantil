"""Rotas e controladores HTTP do recurso de Empresa Parceira."""

from fastapi import APIRouter, Depends, status

from controller.dependencias import obter_servico_empresa
from controller.schemas import (
    EmpresaAtualizarSchema,
    EmpresaCriarSchema,
    EmpresaRespostaSchema,
)
from service.servico_empresa import ServicoEmpresa

router = APIRouter(prefix="/empresas", tags=["Empresas"])


@router.post(
    "",
    response_model=EmpresaRespostaSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastrar uma nova empresa parceira",
    description="Registra uma empresa parceira que poderá oferecer vantagens aos alunos.",
)
def cadastrar_empresa(
    dados: EmpresaCriarSchema,
    servico: ServicoEmpresa = Depends(obter_servico_empresa),
) -> EmpresaRespostaSchema:
    """Cadastra uma nova empresa parceira no sistema."""
    empresa = servico.cadastrar_empresa(dados.model_dump())
    return EmpresaRespostaSchema.model_validate(empresa)


@router.get(
    "",
    response_model=list[EmpresaRespostaSchema],
    status_code=status.HTTP_200_OK,
    summary="Listar todas as empresas parceiras ativas",
    description="Retorna todas as empresas parceiras ativas cadastradas no sistema.",
)
def listar_empresas(
    servico: ServicoEmpresa = Depends(obter_servico_empresa),
) -> list[EmpresaRespostaSchema]:
    """Lista todas as empresas parceiras ativas cadastradas no sistema."""
    empresas = servico.listar_empresas()
    return [EmpresaRespostaSchema.model_validate(e) for e in empresas]


@router.get(
    "/{id}",
    response_model=EmpresaRespostaSchema,
    status_code=status.HTTP_200_OK,
    summary="Buscar empresa parceira por ID",
    description="Obtém os dados detalhados de uma empresa parceira pelo identificador.",
)
def buscar_empresa(
    id: int,
    servico: ServicoEmpresa = Depends(obter_servico_empresa),
) -> EmpresaRespostaSchema:
    """Busca os detalhes cadastrais de uma empresa parceira ativa por seu ID."""
    empresa = servico.buscar_empresa(id)
    return EmpresaRespostaSchema.model_validate(empresa)


@router.put(
    "/{id}",
    response_model=EmpresaRespostaSchema,
    status_code=status.HTTP_200_OK,
    summary="Atualizar dados da empresa parceira",
    description="Atualiza razão social, CNPJ ou senha corporativa mantendo o login original.",
)
def atualizar_empresa(
    id: int,
    dados: EmpresaAtualizarSchema,
    servico: ServicoEmpresa = Depends(obter_servico_empresa),
) -> EmpresaRespostaSchema:
    """Atualiza a empresa; o login não muda e a senha só muda se for informada."""
    empresa = servico.atualizar_empresa(id, dados.model_dump(exclude_unset=True))
    return EmpresaRespostaSchema.model_validate(empresa)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Excluir cadastro da empresa parceira",
    description="Inativa a empresa sem apagar as vantagens já resgatadas.",
)
def excluir_empresa(
    id: int,
    servico: ServicoEmpresa = Depends(obter_servico_empresa),
) -> None:
    """Realiza a exclusão lógica da empresa parceira (deletado_em preenchido e ativo=False)."""
    servico.excluir_empresa(id)
