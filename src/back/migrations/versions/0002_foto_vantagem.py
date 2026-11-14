"""Tabela para guardar as fotos das vantagens no banco de dados."""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0002_foto_vantagem"
down_revision: Union[str, None] = "0001_modelo_inicial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "foto_vantagem",
        sa.Column("id_foto", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("conteudo", sa.LargeBinary(), nullable=False),
        sa.Column("extensao", sa.String(length=10), nullable=False),
        sa.PrimaryKeyConstraint("id_foto", name="pk_foto_vantagem"),
    )


def downgrade() -> None:
    op.drop_table("foto_vantagem")
