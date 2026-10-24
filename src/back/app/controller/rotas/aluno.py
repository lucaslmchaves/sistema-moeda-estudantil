"""Rotas e controladores HTTP do recurso de Aluno."""

from fastapi import APIRouter, Depends, status

from app.controller.permissoes import exigir_dono, exigir_perfil
from app.controller.dependencias import obter_servico_aluno
from app.controller.schemas import (
    AlunoAtualizarSchema,
    AlunoCriarSchema,
    AlunoRespostaSchema,
    AlunoResumoSchema,
)
from app.model.enums import TipoUsuario
from app.model.usuario import Usuario
from app.service.servico_aluno import ServicoAluno

router = APIRouter(prefix="/alunos", tags=["Alunos"])


@router.post(
    "",
    response_model=AlunoRespostaSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastrar um novo aluno",
    description="Cadastra um novo estudante no sistema e abre sua conta bancária com saldo zero.",
)
def cadastrar_aluno(
    dados: AlunoCriarSchema,
    servico: ServicoAluno = Depends(obter_servico_aluno),
) -> AlunoRespostaSchema:
    """Cadastra um novo aluno no sistema e abre sua conta com saldo zero."""
    aluno = servico.cadastrar_aluno(dados.model_dump())
    return AlunoRespostaSchema.model_validate(aluno)


@router.get(
    "",
    response_model=list[AlunoResumoSchema],
    status_code=status.HTTP_200_OK,
    summary="Listar os alunos ativos",
    description="Devolve nome e curso dos alunos ativos; só professores podem consultar.",
)
def listar_alunos(
    _: Usuario = Depends(exigir_perfil(TipoUsuario.PROFESSOR)),
    servico: ServicoAluno = Depends(obter_servico_aluno),
) -> list[AlunoResumoSchema]:
    """Lista os alunos ativos para o professor escolher quem recebe as moedas."""
    alunos = servico.listar_alunos()
    return [AlunoResumoSchema.model_validate(a) for a in alunos]


@router.get(
    "/{id}",
    response_model=AlunoRespostaSchema,
    status_code=status.HTTP_200_OK,
    summary="Buscar aluno por ID",
    description="Obtém os dados cadastrais do próprio aluno autenticado.",
)
def buscar_aluno(
    id: int,
    _: Usuario = Depends(exigir_dono(TipoUsuario.ALUNO)),
    servico: ServicoAluno = Depends(obter_servico_aluno),
) -> AlunoRespostaSchema:
    """Busca os detalhes cadastrais de um aluno ativo por seu ID."""
    aluno = servico.buscar_aluno(id)
    return AlunoRespostaSchema.model_validate(aluno)


@router.put(
    "/{id}",
    response_model=AlunoRespostaSchema,
    status_code=status.HTTP_200_OK,
    summary="Atualizar dados do aluno",
    description="Atualiza os dados do aluno; o login é fixo e a senha só muda se enviada.",
)
def atualizar_aluno(
    id: int,
    dados: AlunoAtualizarSchema,
    _: Usuario = Depends(exigir_dono(TipoUsuario.ALUNO)),
    servico: ServicoAluno = Depends(obter_servico_aluno),
) -> AlunoRespostaSchema:
    """Atualiza dados do aluno. O login não é alterado e a senha só muda se informada."""
    aluno = servico.atualizar_aluno(id, dados.model_dump(exclude_unset=True))
    return AlunoRespostaSchema.model_validate(aluno)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Excluir cadastro do aluno",
    description="Inativa o aluno sem apagar o histórico de transações.",
)
def excluir_aluno(
    id: int,
    _: Usuario = Depends(exigir_dono(TipoUsuario.ALUNO)),
    servico: ServicoAluno = Depends(obter_servico_aluno),
) -> None:
    """Realiza a exclusão lógica do aluno (deletado_em preenchido e ativo=False)."""
    servico.excluir_aluno(id)
