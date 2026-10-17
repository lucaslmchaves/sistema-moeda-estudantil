"""Pacote de schemas Pydantic para validação e serialização da API."""

from controller.schemas.aluno import (
    AlunoAtualizarSchema,
    AlunoCriarSchema,
    AlunoRespostaSchema,
)
from controller.schemas.empresa import (
    EmpresaAtualizarSchema,
    EmpresaCriarSchema,
    EmpresaRespostaSchema,
)
from controller.schemas.instituicao import InstituicaoRespostaSchema
from controller.schemas.tipos import (
    TipoCnpj,
    TipoCpf,
    TipoCurso,
    TipoEmail,
    TipoEndereco,
    TipoLogin,
    TipoNome,
    TipoRg,
    TipoSenha,
)

__all__ = [
    "AlunoCriarSchema",
    "AlunoAtualizarSchema",
    "AlunoRespostaSchema",
    "EmpresaCriarSchema",
    "EmpresaAtualizarSchema",
    "EmpresaRespostaSchema",
    "InstituicaoRespostaSchema",
    "TipoNome",
    "TipoEmail",
    "TipoCpf",
    "TipoRg",
    "TipoEndereco",
    "TipoCurso",
    "TipoLogin",
    "TipoCnpj",
    "TipoSenha",
]
