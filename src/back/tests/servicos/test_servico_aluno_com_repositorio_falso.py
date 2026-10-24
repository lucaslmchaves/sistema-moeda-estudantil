"""Prova a inversão de dependência: o ServicoAluno funciona com qualquer repositório do contrato."""

import pytest

from app.model.instituicao_ensino import InstituicaoEnsino
from app.service.excecoes import Conflito, DadoInvalido, NaoEncontrado
from app.service.servico_aluno import ServicoAluno
from tests.suporte.fabricas import dados_aluno
from tests.suporte.fakes import RepositorioAlunoFalso, RepositorioInstituicaoFalso


@pytest.fixture
def repo_aluno() -> RepositorioAlunoFalso:
    """Repositório de alunos em memória."""
    return RepositorioAlunoFalso()


@pytest.fixture
def servico(repo_aluno: RepositorioAlunoFalso) -> ServicoAluno:
    """Serviço ligado a repositórios falsos, sem banco."""
    instituicao = InstituicaoEnsino(id_instituicao=1, nome="PUC Minas")
    return ServicoAluno(repo_aluno, RepositorioInstituicaoFalso([instituicao]))


def test_cadastrar_aluno_guarda_aluno_e_abre_conta_zerada(servico, repo_aluno):
    """Cadastra o aluno e abre a conta com saldo zero."""
    aluno = servico.cadastrar_aluno(dados_aluno())

    assert aluno.id_usuario == 1
    assert repo_aluno.contas[0].saldo == 0
    assert repo_aluno.contas[0].id_usuario == aluno.id_usuario


def test_cadastrar_aluno_guarda_cpf_so_com_digitos_e_senha_em_hash(servico):
    """Normaliza o CPF e nunca guarda a senha em texto puro."""
    aluno = servico.cadastrar_aluno(dados_aluno(cpf="529.982.247-25", senha="senhaSegura123"))

    assert aluno.cpf == "52998224725"
    assert aluno.senha_hash != "senhaSegura123"
    assert aluno.autenticar("senhaSegura123") is True


def test_cadastrar_aluno_com_cpf_repetido_em_outro_formato_levanta_conflito(servico):
    """O mesmo CPF com e sem máscara conta como repetido."""
    servico.cadastrar_aluno(dados_aluno(cpf="529.982.247-25"))

    with pytest.raises(Conflito, match="CPF"):
        servico.cadastrar_aluno(dados_aluno(cpf="52998224725"))


def test_cadastrar_aluno_com_instituicao_inexistente_levanta_dado_invalido(servico):
    """Recusa instituição que o repositório não conhece."""
    with pytest.raises(DadoInvalido, match="instituição"):
        servico.cadastrar_aluno(dados_aluno(id_instituicao=99))


def test_cadastrar_aluno_com_endereco_vazio_cita_o_rotulo_em_portugues(servico):
    """A mensagem usa o rótulo com acento e não o nome técnico do campo."""
    with pytest.raises(DadoInvalido, match="O campo endereço não pode ficar vazio"):
        servico.cadastrar_aluno(dados_aluno(endereco="   "))


def test_atualizar_aluno_troca_nome_e_mantem_login(servico):
    """Atualiza os campos enviados e preserva o login."""
    aluno = servico.cadastrar_aluno(dados_aluno(login="login.fixo"))

    atualizado = servico.atualizar_aluno(aluno.id_usuario, {"nome": " Nome Novo ", "login": "outro"})

    assert atualizado.nome == "Nome Novo"
    assert atualizado.login == "login.fixo"


def test_excluir_aluno_devolve_true_e_some_da_listagem(servico):
    """A exclusão lógica devolve True e o aluno deixa de aparecer."""
    aluno = servico.cadastrar_aluno(dados_aluno())

    assert servico.excluir_aluno(aluno.id_usuario) is True
    assert servico.listar_alunos() == []
    with pytest.raises(NaoEncontrado):
        servico.buscar_aluno(aluno.id_usuario)
