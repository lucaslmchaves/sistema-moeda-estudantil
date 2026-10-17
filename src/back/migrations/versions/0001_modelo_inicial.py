"""Migração inicial do banco de dados com todas as tabelas e índices."""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0001_modelo_inicial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

tipo_usuario_enum = postgresql.ENUM(
    "ALUNO", "PROFESSOR", "EMPRESA_PARCEIRA", name="tipo_usuario_enum", create_type=False
)
tipo_transacao_enum = postgresql.ENUM(
    "ENVIO_MOEDAS", "RESGATE_VANTAGEM", name="tipo_transacao_enum", create_type=False
)


def upgrade() -> None:
    # 1. Criação dos enums no PostgreSQL (se aplicável ao dialeto)
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        sa.Enum("ALUNO", "PROFESSOR", "EMPRESA_PARCEIRA", name="tipo_usuario_enum").create(
            bind, checkfirst=True
        )
        sa.Enum("ENVIO_MOEDAS", "RESGATE_VANTAGEM", name="tipo_transacao_enum").create(
            bind, checkfirst=True
        )

    # 2. Tabela usuario
    op.create_table(
        "usuario",
        sa.Column("id_usuario", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("login", sa.String(length=60), nullable=False),
        sa.Column("senha_hash", sa.String(length=255), nullable=False),
        sa.Column(
            "tipo_usuario",
            tipo_usuario_enum if bind.dialect.name == "postgresql" else sa.String(30),
            nullable=False,
        ),
        sa.Column("ativo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("deletado_em", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id_usuario", name="pk_usuario"),
        sa.UniqueConstraint("login", name="uq_usuario_login"),
    )

    # 3. Tabela instituicao_ensino
    op.create_table(
        "instituicao_ensino",
        sa.Column("id_instituicao", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nome", sa.String(length=150), nullable=False),
        sa.PrimaryKeyConstraint("id_instituicao", name="pk_instituicao_ensino"),
        sa.UniqueConstraint("nome", name="uq_instituicao_ensino_nome"),
    )

    # 4. Tabela aluno
    op.create_table(
        "aluno",
        sa.Column("id_usuario", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(length=150), nullable=False),
        sa.Column("cpf", sa.String(length=14), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("rg", sa.String(length=20), nullable=False),
        sa.Column("endereco", sa.String(length=255), nullable=False),
        sa.Column("curso", sa.String(length=100), nullable=False),
        sa.Column("id_instituicao", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["id_usuario"],
            ["usuario.id_usuario"],
            name="fk_aluno_usuario",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["id_instituicao"],
            ["instituicao_ensino.id_instituicao"],
            name="fk_aluno_instituicao",
        ),
        sa.PrimaryKeyConstraint("id_usuario", name="pk_aluno"),
        sa.UniqueConstraint("cpf", name="uq_aluno_cpf"),
        sa.UniqueConstraint("email", name="uq_aluno_email"),
    )

    # 5. Tabela professor
    op.create_table(
        "professor",
        sa.Column("id_usuario", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(length=150), nullable=False),
        sa.Column("cpf", sa.String(length=14), nullable=False),
        sa.Column("departamento", sa.String(length=100), nullable=False),
        sa.Column("id_instituicao", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["id_usuario"],
            ["usuario.id_usuario"],
            name="fk_professor_usuario",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["id_instituicao"],
            ["instituicao_ensino.id_instituicao"],
            name="fk_professor_instituicao",
        ),
        sa.PrimaryKeyConstraint("id_usuario", name="pk_professor"),
        sa.UniqueConstraint("cpf", name="uq_professor_cpf"),
    )

    # 6. Tabela empresa_parceira
    op.create_table(
        "empresa_parceira",
        sa.Column("id_usuario", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(length=150), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("cnpj", sa.String(length=18), nullable=False),
        sa.ForeignKeyConstraint(
            ["id_usuario"],
            ["usuario.id_usuario"],
            name="fk_empresa_parceira_usuario",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id_usuario", name="pk_empresa_parceira"),
        sa.UniqueConstraint("email", name="uq_empresa_parceira_email"),
        sa.UniqueConstraint("cnpj", name="uq_empresa_parceira_cnpj"),
    )

    # 7. Tabela conta
    op.create_table(
        "conta",
        sa.Column("id_conta", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("id_usuario", sa.Integer(), nullable=False),
        sa.Column("saldo", sa.Integer(), server_default=sa.text("0"), nullable=False),
        sa.CheckConstraint("saldo >= 0", name="ck_conta_saldo_positivo"),
        sa.ForeignKeyConstraint(
            ["id_usuario"],
            ["usuario.id_usuario"],
            name="fk_conta_usuario",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id_conta", name="pk_conta"),
        sa.UniqueConstraint("id_usuario", name="uq_conta_id_usuario"),
    )

    # 8. Tabela vantagem
    op.create_table(
        "vantagem",
        sa.Column("id_vantagem", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("id_empresa", sa.Integer(), nullable=False),
        sa.Column("descricao", sa.String(length=255), nullable=False),
        sa.Column("foto", sa.String(length=500), nullable=False),
        sa.Column("custo", sa.Integer(), nullable=False),
        sa.Column("deletado_em", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("custo > 0", name="ck_vantagem_custo_positivo"),
        sa.ForeignKeyConstraint(
            ["id_empresa"],
            ["empresa_parceira.id_usuario"],
            name="fk_vantagem_empresa_parceira",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id_vantagem", name="pk_vantagem"),
    )
    op.create_index("ix_vantagem_id_empresa", "vantagem", ["id_empresa"])

    # 9. Tabela transacao
    op.create_table(
        "transacao",
        sa.Column("id_transacao", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column(
            "tipo_transacao",
            tipo_transacao_enum if bind.dialect.name == "postgresql" else sa.String(30),
            nullable=False,
        ),
        sa.Column(
            "data_hora",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("valor", sa.Integer(), nullable=False),
        sa.CheckConstraint("valor > 0", name="ck_transacao_valor_positivo"),
        sa.PrimaryKeyConstraint("id_transacao", name="pk_transacao"),
    )

    # 10. Tabela envio_moedas
    op.create_table(
        "envio_moedas",
        sa.Column("id_transacao", sa.Integer(), nullable=False),
        sa.Column("id_professor", sa.Integer(), nullable=False),
        sa.Column("id_aluno", sa.Integer(), nullable=False),
        sa.Column("mensagem", sa.Text(), nullable=False),
        sa.CheckConstraint("length(mensagem) > 0", name="ck_envio_moedas_mensagem_nao_vazia"),
        sa.ForeignKeyConstraint(
            ["id_transacao"],
            ["transacao.id_transacao"],
            name="fk_envio_moedas_transacao",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["id_professor"],
            ["professor.id_usuario"],
            name="fk_envio_moedas_professor",
        ),
        sa.ForeignKeyConstraint(
            ["id_aluno"],
            ["aluno.id_usuario"],
            name="fk_envio_moedas_aluno",
        ),
        sa.PrimaryKeyConstraint("id_transacao", name="pk_envio_moedas"),
    )
    op.create_index("ix_envio_moedas_id_professor", "envio_moedas", ["id_professor"])
    op.create_index("ix_envio_moedas_id_aluno", "envio_moedas", ["id_aluno"])

    # 11. Tabela resgate_vantagem
    op.create_table(
        "resgate_vantagem",
        sa.Column("id_transacao", sa.Integer(), nullable=False),
        sa.Column("id_aluno", sa.Integer(), nullable=False),
        sa.Column("id_vantagem", sa.Integer(), nullable=False),
        sa.Column("codigo", sa.String(length=20), nullable=False),
        sa.ForeignKeyConstraint(
            ["id_transacao"],
            ["transacao.id_transacao"],
            name="fk_resgate_vantagem_transacao",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["id_aluno"],
            ["aluno.id_usuario"],
            name="fk_resgate_vantagem_aluno",
        ),
        sa.ForeignKeyConstraint(
            ["id_vantagem"],
            ["vantagem.id_vantagem"],
            name="fk_resgate_vantagem_vantagem",
        ),
        sa.PrimaryKeyConstraint("id_transacao", name="pk_resgate_vantagem"),
        sa.UniqueConstraint("codigo", name="uq_resgate_vantagem_codigo"),
    )
    op.create_index("ix_resgate_vantagem_id_aluno", "resgate_vantagem", ["id_aluno"])


def downgrade() -> None:
    bind = op.get_bind()

    # Drop tables na ordem reversa das dependências
    op.drop_index("ix_resgate_vantagem_id_aluno", table_name="resgate_vantagem")
    op.drop_table("resgate_vantagem")

    op.drop_index("ix_envio_moedas_id_aluno", table_name="envio_moedas")
    op.drop_index("ix_envio_moedas_id_professor", table_name="envio_moedas")
    op.drop_table("envio_moedas")

    op.drop_table("transacao")

    op.drop_index("ix_vantagem_id_empresa", table_name="vantagem")
    op.drop_table("vantagem")

    op.drop_table("conta")
    op.drop_table("empresa_parceira")
    op.drop_table("professor")
    op.drop_table("aluno")
    op.drop_table("instituicao_ensino")
    op.drop_table("usuario")

    # Drop dos tipos ENUM no PostgreSQL
    if bind.dialect.name == "postgresql":
        sa.Enum(name="tipo_transacao_enum").drop(bind, checkfirst=True)
        sa.Enum(name="tipo_usuario_enum").drop(bind, checkfirst=True)
