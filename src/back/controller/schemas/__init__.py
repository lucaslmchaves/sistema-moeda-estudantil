"""Pacote de schemas Pydantic para validação e serialização da API."""

from controller.schemas.aluno import (
    AlunoAtualizarSchema,
    AlunoCriarSchema,
    AlunoRespostaSchema,
    AlunoResumoSchema,
)
from controller.schemas.autenticacao import LoginSchema, TokenRespostaSchema, UsuarioLogadoSchema
from controller.schemas.empresa import (
    EmpresaAtualizarSchema,
    EmpresaCriarSchema,
    EmpresaRespostaSchema,
)
from controller.schemas.instituicao import InstituicaoRespostaSchema
from controller.schemas.moedas import (
    EnvioMoedasCriarSchema,
    EnvioMoedasRespostaSchema,
    ExtratoRespostaSchema,
    ResgateCriarSchema,
    ResgateRespostaSchema,
    montar_extrato,
)
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
from controller.schemas.vantagem import VantagemRespostaSchema

__all__ = [
    "AlunoCriarSchema",
    "AlunoAtualizarSchema",
    "AlunoRespostaSchema",
    "AlunoResumoSchema",
    "LoginSchema",
    "TokenRespostaSchema",
    "UsuarioLogadoSchema",
    "EmpresaCriarSchema",
    "EmpresaAtualizarSchema",
    "EmpresaRespostaSchema",
    "InstituicaoRespostaSchema",
    "EnvioMoedasCriarSchema",
    "EnvioMoedasRespostaSchema",
    "ExtratoRespostaSchema",
    "ResgateCriarSchema",
    "ResgateRespostaSchema",
    "montar_extrato",
    "VantagemRespostaSchema",
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
