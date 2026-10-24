"""Schema Pydantic de serialização das vantagens."""

from pydantic import BaseModel

from model.vantagem import Vantagem


class VantagemRespostaSchema(BaseModel):
    """Vantagem com a foto, o custo em moedas e a empresa que a oferece."""

    id_vantagem: int
    descricao: str
    foto: str
    custo: int
    id_empresa: int
    nome_empresa: str

    @classmethod
    def de_modelo(cls, vantagem: Vantagem) -> "VantagemRespostaSchema":
        """Monta a resposta a partir da vantagem e da empresa dona dela."""
        return cls(
            id_vantagem=vantagem.id_vantagem,
            descricao=vantagem.descricao,
            foto=vantagem.foto,
            custo=vantagem.custo,
            id_empresa=vantagem.id_empresa,
            nome_empresa=vantagem.empresa.nome,
        )
