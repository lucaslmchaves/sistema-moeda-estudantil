"""Testes de persistência e consultas do RepositorioAluno."""

from sqlalchemy.orm import Session

from app.model.aluno import Aluno
from app.model.conta import Conta
from app.model.enums import TipoUsuario
from app.model.instituicao_ensino import InstituicaoEnsino
from app.repository.repositorio_aluno import RepositorioAluno


def test_repositorio_aluno_crud_e_consultas(sessao: Session, instituicao_padrao: InstituicaoEnsino):
    """Testa salvar, buscar por id/cpf/email/login, listar ativos e exclusão lógica."""
    repo = RepositorioAluno(sessao)

    aluno = Aluno(
        login="aluno.repo",
        senha_hash="hash",
        tipo_usuario=TipoUsuario.ALUNO,
        ativo=True,
        nome="Aluno Repositório",
        cpf="11144477735",
        email="repo@aluno.com",
        rg="MG-123",
        endereco="Rua Repo",
        curso="ES",
        id_instituicao=instituicao_padrao.id_instituicao,
    )
    repo.salvar(aluno)

    conta = Conta(id_usuario=aluno.id_usuario, saldo=0)
    repo.salvar_conta(conta)

    # Busca por ID
    buscado = repo.buscar_por_id(aluno.id_usuario)
    assert buscado is not None
    assert buscado.nome == "Aluno Repositório"

    # Consultas de unicidade
    assert repo.buscar_por_cpf("11144477735") is not None
    assert repo.buscar_por_email("repo@aluno.com") is not None
    assert repo.buscar_por_login("aluno.repo") is not None

    # Listagem de ativos
    lista = repo.listar()
    assert len(lista) == 1

    # Exclusão lógica
    retorno = repo.marcar_excluido(aluno)
    assert retorno is True
    assert repo.buscar_por_id(aluno.id_usuario) is None
    assert len(repo.listar()) == 0
