"""Schemas Pydantic para validação e serialização de Empresa Parceira."""

from pydantic import BaseModel, ConfigDict, field_validator

from app.controller.schemas.tipos import (
    TipoCnpj,
    TipoEmail,
    TipoLogin,
    TipoNome,
    TipoSenha,
    validar_senha_sem_espacos,
)


class EmpresaCriarSchema(BaseModel):
    """Schema para validação do payload de cadastro de empresa parceira."""
    nome: TipoNome
    email: TipoEmail
    cnpj: TipoCnpj
    login: TipoLogin
    senha: TipoSenha

    @field_validator("senha", mode="after")
    @classmethod
    def validar_senha(cls, v: str) -> str:
        """Assegura que a senha informada não contenha apenas espaços."""
        return str(validar_senha_sem_espacos(v))


class EmpresaAtualizarSchema(BaseModel):
    """Schema para validação de alteração parcial de empresa parceira."""
    nome: TipoNome | None = None
    email: TipoEmail | None = None
    cnpj: TipoCnpj | None = None
    senha: TipoSenha | None = None

    @field_validator("senha", mode="after")
    @classmethod
    def validar_senha(cls, v: str | None) -> str | None:
        """Assegura que a nova senha informada não contenha apenas espaços."""
        return validar_senha_sem_espacos(v)


class EmpresaRespostaSchema(BaseModel):
    """Schema de serialização pública da empresa parceira sem hash de senha."""
    model_config = ConfigDict(from_attributes=True)

    id_usuario: int
    nome: str
    email: str
    cnpj: str
    login: str
    ativo: bool
