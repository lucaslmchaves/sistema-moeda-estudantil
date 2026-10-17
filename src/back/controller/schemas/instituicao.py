"""Schemas Pydantic para serialização de Instituição de Ensino."""

from pydantic import BaseModel, ConfigDict


class InstituicaoRespostaSchema(BaseModel):
    """Schema de serialização pública das instituições de ensino disponíveis."""
    model_config = ConfigDict(from_attributes=True)

    id_instituicao: int
    nome: str
