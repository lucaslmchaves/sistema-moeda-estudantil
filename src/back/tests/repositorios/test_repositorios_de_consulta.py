"""Testes dos repositórios de usuário, professor, conta e transação."""

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from model.envio_moedas import EnvioMoedas
from model.instituicao_ensino import InstituicaoEnsino
from model.professor import Professor
from model.resgate_vantagem import ResgateVantagem
from model.vantagem import Vantagem
from repository.repositorio_aluno import RepositorioAluno
from repository.repositorio_conta import RepositorioConta
from repository.repositorio_empresa import RepositorioEmpresa
from repository.repositorio_instituicao import RepositorioInstituicao
from repository.repositorio_professor import RepositorioProfessor
from repository.repositorio_transacao import RepositorioTransacao
from repository.repositorio_usuario import RepositorioUsuario
from repository.repositorio_vantagem import RepositorioVantagem
from service.servico_aluno import ServicoAluno
from service.servico_empresa import ServicoEmpresa
from tests.fabricas import dados_aluno, dados_empresa


def test_repositorio_usuario_busca_por_login_e_por_id_ativo(sessao: Session, criar_professor):
    """O login acha qualquer usuário; o id só acha usuário ativo, de qualquer perfil."""
    professor = criar_professor("prof.busca")
    repo = RepositorioUsuario(sessao)

    assert repo.buscar_por_login("prof.busca").id_usuario == professor.id_usuario
    assert repo.buscar_por_login("nao.existe") is None
    assert isinstance(repo.buscar_por_id(professor.id_usuario), Professor)

    professor.deletado_em = datetime.now(timezone.utc)
    sessao.flush()
    assert repo.buscar_por_id(professor.id_usuario) is None
    assert repo.buscar_por_login("prof.busca") is not None


def test_repositorio_professor_busca_e_lista_so_os_ativos(sessao: Session, criar_professor):
    """Professor excluído não é encontrado nem listado."""
    ativo, excluido = criar_professor("prof.ativo"), criar_professor("prof.excluido")
    excluido.deletado_em = datetime.now(timezone.utc)
    sessao.flush()
    repo = RepositorioProfessor(sessao)

    assert repo.buscar_por_id(ativo.id_usuario).login == "prof.ativo"
    assert repo.buscar_por_id(excluido.id_usuario) is None
    assert [p.login for p in repo.listar()] == ["prof.ativo"]


def test_repositorio_conta_busca_a_conta_do_usuario_com_ou_sem_trava(
    sessao: Session, criar_professor
):
    """A conta é encontrada pelo usuário, inclusive pedindo a trava para atualizar."""
    professor = criar_professor(saldo=500)
    repo = RepositorioConta(sessao)

    assert repo.buscar_por_usuario(professor.id_usuario).saldo == 500
    assert repo.buscar_por_usuario(professor.id_usuario, para_atualizar=True).saldo == 500
    assert repo.buscar_por_usuario(9999) is None


def test_repositorio_transacao_salva_envio_e_resgate_e_confere_codigo(
    sessao: Session, instituicao_padrao: InstituicaoEnsino, criar_professor
):
    """Envio e resgate são gravados com id, e o código usado passa a existir."""
    professor = criar_professor()
    aluno = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao)).cadastrar_aluno(
        dados_aluno(id_instituicao=instituicao_padrao.id_instituicao)
    )
    empresa = ServicoEmpresa(RepositorioEmpresa(sessao)).cadastrar_empresa(dados_empresa())
    vantagem = RepositorioVantagem(sessao).salvar(
        Vantagem(id_empresa=empresa.id_usuario, descricao="A", foto="/uploads/a.png", custo=5)
    )
    repo = RepositorioTransacao(sessao)

    envio = repo.salvar(
        EnvioMoedas(
            id_professor=professor.id_usuario,
            id_aluno=aluno.id_usuario,
            valor=5,
            mensagem="ok",
            data_hora=datetime.now(timezone.utc),
        )
    )
    assert repo.codigo_existe("ZZZZ9999") is False
    resgate = repo.salvar(
        ResgateVantagem(
            id_aluno=aluno.id_usuario,
            id_vantagem=vantagem.id_vantagem,
            valor=5,
            codigo="ZZZZ9999",
            data_hora=datetime.now(timezone.utc),
        )
    )

    assert envio.id_transacao is not None and resgate.id_transacao is not None
    assert repo.codigo_existe("ZZZZ9999") is True
