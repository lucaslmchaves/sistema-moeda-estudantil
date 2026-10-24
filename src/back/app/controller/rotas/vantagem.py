"""Rotas e controladores HTTP do recurso de Vantagem."""

from fastapi import APIRouter, Depends, File, Form, UploadFile, status

from app.controller.permissoes import exigir_perfil, usuario_autenticado
from app.controller.dependencias import obter_servico_vantagem
from app.controller.schemas import VantagemRespostaSchema
from app.model.enums import TipoUsuario
from app.model.usuario import Usuario
from app.service.servico_vantagem import FOTO_TAMANHO_MAXIMO, ServicoVantagem

router = APIRouter(prefix="/vantagens", tags=["Vantagens"])


@router.post(
    "",
    response_model=VantagemRespostaSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastrar uma vantagem",
    description="A empresa parceira cadastra uma vantagem com descrição, foto e custo em moedas.",
)
def cadastrar_vantagem(
    descricao: str = Form(...),
    custo: int = Form(...),
    foto: UploadFile = File(...),
    empresa: Usuario = Depends(exigir_perfil(TipoUsuario.EMPRESA_PARCEIRA)),
    servico: ServicoVantagem = Depends(obter_servico_vantagem),
) -> VantagemRespostaSchema:
    """Cadastra a vantagem da empresa autenticada com a foto enviada."""
    conteudo = foto.file.read(FOTO_TAMANHO_MAXIMO + 1)
    vantagem = servico.cadastrar_vantagem(
        empresa.id_usuario, {"descricao": descricao, "custo": custo}, conteudo
    )
    return VantagemRespostaSchema.de_modelo(vantagem)


@router.get(
    "",
    response_model=list[VantagemRespostaSchema],
    status_code=status.HTTP_200_OK,
    summary="Listar as vantagens disponíveis",
    description="Devolve o catálogo com as vantagens ativas de todas as empresas parceiras.",
)
def listar_vantagens(
    _: Usuario = Depends(usuario_autenticado),
    servico: ServicoVantagem = Depends(obter_servico_vantagem),
) -> list[VantagemRespostaSchema]:
    """Lista o catálogo de vantagens para qualquer usuário autenticado."""
    return [VantagemRespostaSchema.de_modelo(v) for v in servico.listar_vantagens()]


@router.get(
    "/minhas",
    response_model=list[VantagemRespostaSchema],
    status_code=status.HTTP_200_OK,
    summary="Listar as vantagens da empresa",
    description="Devolve as vantagens ativas da empresa parceira autenticada.",
)
def listar_minhas_vantagens(
    empresa: Usuario = Depends(exigir_perfil(TipoUsuario.EMPRESA_PARCEIRA)),
    servico: ServicoVantagem = Depends(obter_servico_vantagem),
) -> list[VantagemRespostaSchema]:
    """Lista as vantagens cadastradas pela empresa autenticada."""
    vantagens = servico.listar_vantagens_da_empresa(empresa.id_usuario)
    return [VantagemRespostaSchema.de_modelo(v) for v in vantagens]


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Excluir uma vantagem",
    description="Inativa a vantagem da empresa sem apagar os resgates já feitos.",
)
def excluir_vantagem(
    id: int,
    empresa: Usuario = Depends(exigir_perfil(TipoUsuario.EMPRESA_PARCEIRA)),
    servico: ServicoVantagem = Depends(obter_servico_vantagem),
) -> None:
    """Realiza a exclusão lógica da vantagem da empresa autenticada."""
    servico.excluir_vantagem(empresa.id_usuario, id)
