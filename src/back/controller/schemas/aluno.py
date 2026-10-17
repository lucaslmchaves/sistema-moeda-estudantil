"""Schemas Pydantic para validação e serialização de dados de Aluno."""

from pydantic import BaseModel, ConfigDict, field_validator

from controller.schemas.tipos import (
    TipoCpf,
    TipoCurso,
    TipoEmail,
    TipoEndereco,
    TipoLogin,
    TipoNome,
    TipoRg,
    TipoSenha,
    validar_senha_sem_espacos,
)


class AlunoCriarSchema(BaseModel):
    """Schema para validação do payload de cadastro de um novo aluno."""
    nome: TipoNome
    email: TipoEmail
    cpf: TipoCpf
    rg: TipoRg
    endereco: TipoEndereco
    curso: TipoCurso
    id_instituicao: int
    login: TipoLogin
    senha: TipoSenha

    @field_validator("senha", mode="after")
    @classmethod
    def validar_senha(cls, v: str) -> str:
        """Assegura que a senha informada não seja composta apenas por espaços."""
        return str(validar_senha_sem_espacos(v))


class AlunoAtualizarSchema(BaseModel):
    """Schema para validação de atualização parcial de dados do aluno."""
    nome: TipoNome | None = None
    email: TipoEmail | None = None
    cpf: TipoCpf | None = None
    rg: TipoRg | None = None
    endereco: TipoEndereco | None = None
    curso: TipoCurso | None = None
    id_instituicao: int | None = None
    senha: TipoSenha | None = None

    @field_validator("senha", mode="after")
    @classmethod
    def validar_senha(cls, v: str | None) -> str | None:
        """Assegura que a nova senha informada não contenha apenas espaços."""
        return validar_senha_sem_espacos(v)


class AlunoRespostaSchema(BaseModel):
    """Schema de serialização pública do Aluno sem expor credenciais de acesso."""
    model_config = ConfigDict(from_attributes=True)

    id_usuario: int
    nome: str
    email: str
    cpf: str
    rg: str
    endereco: str
    curso: str
    id_instituicao: int
    login: str
    ativo: bool
