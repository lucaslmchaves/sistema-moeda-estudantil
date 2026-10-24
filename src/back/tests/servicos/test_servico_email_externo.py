"""Testes do ServicoEmailExterno: conteúdo dos e-mails e comportamento do envio por SMTP."""

import logging
import smtplib

import pytest

from model.aluno import Aluno
from model.empresa_parceira import EmpresaParceira
from model.envio_moedas import EnvioMoedas
from model.professor import Professor
from model.resgate_vantagem import ResgateVantagem
from model.vantagem import Vantagem
from service import servico_email_externo
from service.notificador_email import NotificadorEmail
from service.servico_email_externo import ServicoEmailExterno


class SmtpFalso:
    """Servidor SMTP de mentira que guarda o que seria enviado."""

    enviadas: list = []
    chamadas: list = []
    falhar = False

    def __init__(self, host, porta, timeout=None):
        """Registra a conexão pedida."""
        if SmtpFalso.falhar:
            raise smtplib.SMTPConnectError(421, "indisponível")
        SmtpFalso.chamadas.append(("conectar", host, porta))

    def __enter__(self):
        """Entra no contexto devolvendo o próprio servidor."""
        return self

    def __exit__(self, *args):
        """Sai do contexto sem tratar exceções."""
        return False

    def starttls(self):
        """Registra a ativação da criptografia."""
        SmtpFalso.chamadas.append(("starttls",))

    def login(self, usuario, senha):
        """Registra o login no servidor."""
        SmtpFalso.chamadas.append(("login", usuario, senha))

    def send_message(self, mensagem):
        """Guarda a mensagem enviada."""
        SmtpFalso.enviadas.append(mensagem)


@pytest.fixture(autouse=True)
def smtp_falso(monkeypatch):
    """Troca o smtplib.SMTP pelo falso e limpa o estado entre os testes."""
    SmtpFalso.enviadas, SmtpFalso.chamadas, SmtpFalso.falhar = [], [], False
    monkeypatch.setattr(smtplib, "SMTP", SmtpFalso)
    return SmtpFalso


@pytest.fixture
def servico() -> ServicoEmailExterno:
    """Notificador configurado, que entrega na mesma hora (sem thread)."""
    return ServicoEmailExterno(
        "smtp.exemplo.com", 587, "sistema@exemplo.com", "senha-app", "", assincrono=False
    )


@pytest.fixture
def envio() -> EnvioMoedas:
    """Envio de 50 moedas montado em memória."""
    aluno = Aluno(nome="Ana Lima", email="ana@aluno.com")
    professor = Professor(nome="Carlos Souza")
    return EnvioMoedas(aluno=aluno, professor=professor, valor=50, mensagem="Ótima apresentação")


@pytest.fixture
def resgate() -> ResgateVantagem:
    """Resgate montado em memória, com aluno, vantagem e empresa."""
    empresa = EmpresaParceira(nome="Cantina Central", email="cantina@empresa.com")
    vantagem = Vantagem(descricao="Almoço grátis", custo=60, empresa=empresa)
    aluno = Aluno(nome="Ana Lima", email="ana@aluno.com")
    return ResgateVantagem(aluno=aluno, vantagem=vantagem, valor=60, codigo="ABCD2345")


def test_servico_realiza_o_contrato_de_notificacao(servico):
    """O envio por SMTP obedece ao contrato usado pelo serviço de moedas."""
    assert isinstance(servico, NotificadorEmail)


def test_notificar_recebimento_envia_ao_aluno_com_valor_professor_e_motivo(servico, envio):
    """O aluno recebe o e-mail com o valor, o nome do professor e o motivo."""
    assert servico.notificar_recebimento(envio) is True

    (mensagem,) = SmtpFalso.enviadas
    corpo = mensagem.get_content()
    assert mensagem["To"] == "ana@aluno.com"
    assert mensagem["From"] == "sistema@exemplo.com"
    assert mensagem["Subject"] == "Você recebeu moedas!"
    assert "50 moedas" in corpo and "Carlos Souza" in corpo and "Ótima apresentação" in corpo
    assert ("starttls",) in SmtpFalso.chamadas
    assert ("login", "sistema@exemplo.com", "senha-app") in SmtpFalso.chamadas


def test_notificar_resgate_envia_cupom_ao_aluno_e_conferencia_a_empresa_com_o_mesmo_codigo(
    servico, resgate
):
    """Aluno e empresa recebem um e-mail cada, os dois com o código do resgate."""
    assert servico.notificar_resgate(resgate) is True

    para_aluno, para_empresa = SmtpFalso.enviadas
    assert para_aluno["To"] == "ana@aluno.com"
    assert para_empresa["To"] == "cantina@empresa.com"
    for mensagem in (para_aluno, para_empresa):
        assert "ABCD2345" in mensagem.get_content()
        assert "Almoço grátis" in mensagem.get_content()
    assert "Ana Lima" in para_empresa.get_content()
    assert "Cantina Central" in para_aluno.get_content()


def test_remetente_usa_o_endereco_configurado_quando_informado(envio):
    """Com EMAIL_REMETENTE preenchido, ele aparece no campo From."""
    servico = ServicoEmailExterno(
        "smtp.exemplo.com", 587, "login@exemplo.com", "s", "Moeda <moeda@exemplo.com>", False
    )

    servico.notificar_recebimento(envio)

    assert SmtpFalso.enviadas[0]["From"] == "Moeda <moeda@exemplo.com>"


def test_sem_credenciais_apenas_registra_o_email_no_log(envio, caplog):
    """Sem usuário e senha o e-mail não sai, mas o conteúdo fica no log para conferência."""
    servico = ServicoEmailExterno("smtp.exemplo.com", 587, "", "", "", assincrono=False)

    with caplog.at_level(logging.INFO, logger=servico_email_externo.__name__):
        assert servico.notificar_recebimento(envio) is False

    assert SmtpFalso.enviadas == []
    assert "SMTP não configurado" in caplog.text
    assert "ana@aluno.com" in caplog.text and "50 moedas" in caplog.text


def test_falha_do_servidor_smtp_e_registrada_sem_propagar(servico, envio, caplog):
    """Se o SMTP falhar, o envio devolve False e registra o erro, sem derrubar a operação."""
    SmtpFalso.falhar = True

    with caplog.at_level(logging.ERROR, logger=servico_email_externo.__name__):
        assert servico.notificar_recebimento(envio) is False

    assert "Falha ao enviar e-mail para ana@aluno.com" in caplog.text


def test_envio_assincrono_entrega_em_uma_thread(envio, monkeypatch):
    """No modo padrão o e-mail é entregue por uma thread, sem travar quem pediu."""
    iniciadas = []

    class ThreadFalsa:
        """Thread de mentira que roda o alvo na hora e anota que foi usada."""

        def __init__(self, target, args, daemon):
            """Guarda o alvo, os argumentos e se é daemon."""
            self.target, self.args, self.daemon = target, args, daemon

        def start(self):
            """Executa o alvo imediatamente."""
            iniciadas.append(self.daemon)
            self.target(*self.args)

    monkeypatch.setattr(servico_email_externo.threading, "Thread", ThreadFalsa)
    servico = ServicoEmailExterno("smtp.exemplo.com", 587, "u@exemplo.com", "s", "")

    assert servico.notificar_recebimento(envio) is True

    assert iniciadas == [True]
    assert len(SmtpFalso.enviadas) == 1
