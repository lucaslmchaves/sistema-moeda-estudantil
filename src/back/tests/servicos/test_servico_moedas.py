"""Testes do ServicoMoedas: envio, resgate, crédito do semestre e extrato."""

import pytest
from sqlalchemy.orm import Session

from model.enums import TipoUsuario
from model.professor import Professor
from model.vantagem import Vantagem
from repository.repositorio_aluno import RepositorioAluno
from repository.repositorio_conta import RepositorioConta
from repository.repositorio_empresa import RepositorioEmpresa
from repository.repositorio_instituicao import RepositorioInstituicao
from repository.repositorio_professor import RepositorioProfessor
from repository.repositorio_transacao import RepositorioTransacao
from repository.repositorio_vantagem import RepositorioVantagem
from service.excecoes import DadoInvalido, NaoEncontrado
from service.servico_aluno import ServicoAluno
from service.servico_empresa import ServicoEmpresa
from service.servico_moedas import (
    ALFABETO_CODIGO,
    CODIGO_TAMANHO,
    MENSAGEM_TAMANHO_MAXIMO,
    VALOR_MAXIMO_ENVIO,
    ServicoMoedas,
)
from tests.fabricas import dados_aluno, dados_empresa
from tests.fakes import NotificadorFalso


@pytest.fixture
def servico(sessao: Session, notificador: NotificadorFalso) -> ServicoMoedas:
    """Serviço ligado aos repositórios do banco de teste e ao notificador falso."""
    return ServicoMoedas(
        RepositorioAluno(sessao),
        RepositorioProfessor(sessao),
        RepositorioVantagem(sessao),
        RepositorioConta(sessao),
        RepositorioTransacao(sessao),
        notificador,
    )


@pytest.fixture
def professor(criar_professor) -> Professor:
    """Professor com 1000 moedas."""
    return criar_professor()


@pytest.fixture
def aluno(sessao: Session, instituicao_padrao):
    """Aluno cadastrado com saldo zero."""
    cadastro = ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))
    return cadastro.cadastrar_aluno(dados_aluno(id_instituicao=instituicao_padrao.id_instituicao))


@pytest.fixture
def vantagem(sessao: Session) -> Vantagem:
    """Vantagem de 60 moedas, oferecida por uma empresa parceira."""
    empresa = ServicoEmpresa(RepositorioEmpresa(sessao)).cadastrar_empresa(dados_empresa())
    nova = Vantagem(
        id_empresa=empresa.id_usuario, descricao="Almoço", foto="/uploads/a.png", custo=60
    )
    return RepositorioVantagem(sessao).salvar(nova)


def _saldo(sessao: Session, id_usuario: int) -> int:
    """Lê o saldo da conta do usuário."""
    return RepositorioConta(sessao).buscar_por_usuario(id_usuario).saldo


def test_enviar_moedas_move_o_saldo_grava_o_envio_e_avisa_o_aluno(
    servico, sessao, professor, aluno, notificador
):
    """O professor perde as moedas, o aluno ganha, o envio é gravado e o aluno é notificado."""
    envio = servico.enviar_moedas(
        professor.id_usuario, {"id_aluno": aluno.id_usuario, "valor": 300, "mensagem": " Parabéns "}
    )

    assert envio.id_transacao is not None
    assert envio.mensagem == "Parabéns"
    assert envio.data_hora is not None
    assert _saldo(sessao, professor.id_usuario) == 700
    assert _saldo(sessao, aluno.id_usuario) == 300
    assert notificador.recebimentos == [envio]


def test_enviar_moedas_recusa_saldo_insuficiente_sem_alterar_nada(
    servico, sessao, professor, aluno, notificador
):
    """Quem não tem saldo não envia: nada é debitado, gravado ou notificado."""
    with pytest.raises(DadoInvalido, match="Saldo insuficiente: você tem 1000 moedas"):
        servico.enviar_moedas(
            professor.id_usuario, {"id_aluno": aluno.id_usuario, "valor": 1001, "mensagem": "x"}
        )

    assert _saldo(sessao, professor.id_usuario) == 1000
    assert _saldo(sessao, aluno.id_usuario) == 0
    assert notificador.recebimentos == []


@pytest.mark.parametrize(
    "valor", [0, -5, VALOR_MAXIMO_ENVIO + 1, "10", 10.5, True, None], ids=repr
)
def test_enviar_moedas_recusa_valor_invalido(servico, professor, aluno, valor):
    """Só valores inteiros entre 1 e o limite são aceitos."""
    with pytest.raises(DadoInvalido, match="O valor deve"):
        servico.enviar_moedas(
            professor.id_usuario, {"id_aluno": aluno.id_usuario, "valor": valor, "mensagem": "x"}
        )


@pytest.mark.parametrize("mensagem", ["", "   ", None])
def test_enviar_moedas_exige_a_mensagem(servico, professor, aluno, mensagem):
    """O motivo do reconhecimento é obrigatório."""
    with pytest.raises(DadoInvalido, match="mensagem não pode ficar vazio"):
        servico.enviar_moedas(
            professor.id_usuario, {"id_aluno": aluno.id_usuario, "valor": 1, "mensagem": mensagem}
        )


def test_enviar_moedas_recusa_mensagem_longa_demais(servico, professor, aluno):
    """A mensagem tem tamanho máximo."""
    longa = "x" * (MENSAGEM_TAMANHO_MAXIMO + 1)

    with pytest.raises(DadoInvalido, match=f"no máximo {MENSAGEM_TAMANHO_MAXIMO}"):
        servico.enviar_moedas(
            professor.id_usuario, {"id_aluno": aluno.id_usuario, "valor": 1, "mensagem": longa}
        )


def test_enviar_moedas_exige_professor_e_aluno_existentes(servico, professor, aluno):
    """Professor ou aluno inexistente (ou sem id) levanta NaoEncontrado."""
    dados = {"id_aluno": aluno.id_usuario, "valor": 1, "mensagem": "x"}

    with pytest.raises(NaoEncontrado, match="Professor não encontrado"):
        servico.enviar_moedas(9999, dados)
    with pytest.raises(NaoEncontrado, match="Aluno não encontrado"):
        servico.enviar_moedas(professor.id_usuario, {**dados, "id_aluno": 9999})
    with pytest.raises(NaoEncontrado, match="Aluno não encontrado"):
        servico.enviar_moedas(professor.id_usuario, {**dados, "id_aluno": None})


def test_enviar_moedas_nao_alcanca_aluno_excluido(servico, sessao, professor, aluno):
    """Aluno que excluiu o cadastro não recebe moedas."""
    ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao)).excluir_aluno(
        aluno.id_usuario
    )

    with pytest.raises(NaoEncontrado, match="Aluno não encontrado"):
        servico.enviar_moedas(
            professor.id_usuario, {"id_aluno": aluno.id_usuario, "valor": 1, "mensagem": "x"}
        )


def test_resgatar_vantagem_desconta_o_custo_gera_codigo_e_notifica(
    servico, sessao, professor, aluno, vantagem, notificador
):
    """O resgate desconta o custo, grava o código de 8 caracteres e pede os e-mails."""
    servico.enviar_moedas(
        professor.id_usuario, {"id_aluno": aluno.id_usuario, "valor": 100, "mensagem": "x"}
    )

    resgate = servico.resgatar_vantagem(aluno.id_usuario, vantagem.id_vantagem)

    assert resgate.valor == 60
    assert len(resgate.codigo) == CODIGO_TAMANHO
    assert set(resgate.codigo) <= set(ALFABETO_CODIGO)
    assert _saldo(sessao, aluno.id_usuario) == 40
    assert notificador.resgates == [resgate]


def test_resgatar_vantagem_recusa_saldo_insuficiente(servico, sessao, aluno, vantagem, notificador):
    """Sem saldo para o custo, nada é descontado nem notificado."""
    with pytest.raises(DadoInvalido, match="a vantagem custa 60"):
        servico.resgatar_vantagem(aluno.id_usuario, vantagem.id_vantagem)

    assert _saldo(sessao, aluno.id_usuario) == 0
    assert notificador.resgates == []


def test_resgatar_vantagem_exige_aluno_e_vantagem_existentes(servico, aluno):
    """Vantagem ou aluno inexistente levanta NaoEncontrado."""
    with pytest.raises(NaoEncontrado, match="Vantagem não encontrada"):
        servico.resgatar_vantagem(aluno.id_usuario, 9999)
    with pytest.raises(NaoEncontrado, match="Aluno não encontrado"):
        servico.resgatar_vantagem(9999, 1)


def test_codigo_de_resgate_nunca_repete_um_existente(servico, sessao, professor, aluno, vantagem):
    """Dois resgates seguidos recebem códigos diferentes."""
    servico.enviar_moedas(
        professor.id_usuario, {"id_aluno": aluno.id_usuario, "valor": 200, "mensagem": "x"}
    )

    primeiro = servico.resgatar_vantagem(aluno.id_usuario, vantagem.id_vantagem)
    segundo = servico.resgatar_vantagem(aluno.id_usuario, vantagem.id_vantagem)

    assert primeiro.codigo != segundo.codigo


def test_gerar_codigo_desiste_quando_todos_os_sorteios_ja_existem(servico, monkeypatch):
    """Se todo código sorteado já existir, o serviço recusa em vez de repetir."""
    monkeypatch.setattr(servico.repo_transacao, "codigo_existe", lambda codigo: True)

    with pytest.raises(DadoInvalido, match="código do resgate"):
        servico._gerar_codigo()


def test_creditar_semestre_soma_mil_moedas_a_cada_professor_ativo(
    servico, sessao, criar_professor
):
    """Cada professor ativo ganha 1000 moedas somadas ao saldo que já tinha."""
    com_saldo = criar_professor("prof.a", saldo=250)
    sem_saldo = criar_professor("prof.b", saldo=0)

    assert servico.creditar_semestre() == 2

    assert _saldo(sessao, com_saldo.id_usuario) == 1250
    assert _saldo(sessao, sem_saldo.id_usuario) == 1000


def test_consultar_extrato_do_professor_e_do_aluno_do_mais_recente_ao_mais_antigo(
    servico, sessao, professor, aluno, vantagem
):
    """O extrato traz o saldo e as transações, com a mais recente primeiro."""
    dados = {"id_aluno": aluno.id_usuario, "valor": 100}
    servico.enviar_moedas(professor.id_usuario, {**dados, "mensagem": "primeiro"})
    servico.enviar_moedas(professor.id_usuario, {**dados, "mensagem": "segundo"})
    servico.resgatar_vantagem(aluno.id_usuario, vantagem.id_vantagem)
    sessao.expire_all()

    extrato_prof = servico.consultar_extrato(professor.id_usuario, TipoUsuario.PROFESSOR)
    extrato_aluno = servico.consultar_extrato(aluno.id_usuario, TipoUsuario.ALUNO)

    assert extrato_prof.saldo == 800
    assert [t.mensagem for t in extrato_prof.transacoes] == ["segundo", "primeiro"]
    assert extrato_aluno.saldo == 140
    assert len(extrato_aluno.transacoes) == 3
    assert extrato_aluno.transacoes[0].codigo


def test_consultar_extrato_e_so_de_aluno_e_professor(servico, aluno):
    """Empresas não têm extrato, e usuário inexistente levanta NaoEncontrado."""
    with pytest.raises(DadoInvalido, match="Somente alunos e professores"):
        servico.consultar_extrato(1, TipoUsuario.EMPRESA_PARCEIRA)
    with pytest.raises(NaoEncontrado):
        servico.consultar_extrato(9999, TipoUsuario.ALUNO)
