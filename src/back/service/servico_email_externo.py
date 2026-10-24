"""Envio de e-mails por SMTP, usado nas notificações de moedas e nos cupons de resgate."""

import logging
import smtplib
import threading
from email.message import EmailMessage

from model.envio_moedas import EnvioMoedas
from model.resgate_vantagem import ResgateVantagem
from service.notificador_email import NotificadorEmail

registro = logging.getLogger(__name__)
TEMPO_LIMITE_SMTP = 15


class ServicoEmailExterno(NotificadorEmail):
    """Entrega os e-mails pelo servidor SMTP configurado, sem travar a resposta da API."""

    def __init__(
        self,
        host: str,
        porta: int,
        usuario: str,
        senha: str,
        remetente: str,
        assincrono: bool = True,
    ):
        """Recebe os dados do servidor SMTP; sem usuário e senha, só registra o e-mail no log."""
        self.host = host
        self.porta = porta
        self.usuario = usuario
        self.senha = senha
        self.remetente = remetente or usuario
        self.assincrono = assincrono

    def notificar_recebimento(self, envio: EnvioMoedas) -> bool:
        """Avisa o aluno de que recebeu moedas, com o valor, o professor e o motivo."""
        aluno, professor = envio.aluno, envio.professor
        corpo = (
            f"Olá, {aluno.nome}!\n\n"
            f"Você recebeu {envio.valor} moedas do professor {professor.nome}.\n"
            f"Motivo: {envio.mensagem}\n\n"
            "Confira o seu extrato no Sistema de Moeda Estudantil."
        )
        return self._enviar(aluno.email, "Você recebeu moedas!", corpo)

    def notificar_resgate(self, resgate: ResgateVantagem) -> bool:
        """Manda o cupom ao aluno e o aviso de conferência à empresa, ambos com o código."""
        aluno, vantagem = resgate.aluno, resgate.vantagem
        empresa = vantagem.empresa
        cupom = (
            f"Olá, {aluno.nome}!\n\n"
            f"Você trocou {resgate.valor} moedas pela vantagem \"{vantagem.descricao}\", "
            f"oferecida por {empresa.nome}.\n"
            f"Código do cupom: {resgate.codigo}\n\n"
            "Apresente este código na empresa para usar a sua vantagem."
        )
        conferencia = (
            f"Olá, {empresa.nome}!\n\n"
            f"O aluno {aluno.nome} resgatou a vantagem \"{vantagem.descricao}\".\n"
            f"Código para conferência: {resgate.codigo}\n\n"
            "Confira o código quando o aluno apresentar o cupom."
        )
        enviados = [
            self._enviar(aluno.email, "Seu cupom de resgate", cupom),
            self._enviar(empresa.email, "Um aluno resgatou uma vantagem", conferencia),
        ]
        return all(enviados)

    def _enviar(self, destinatario: str, assunto: str, corpo: str) -> bool:
        """Monta a mensagem e a despacha; sem SMTP configurado, apenas a registra no log."""
        if not self.usuario or not self.senha:
            registro.info(
                "SMTP não configurado; e-mail não enviado.\nPara: %s\nAssunto: %s\n\n%s",
                destinatario,
                assunto,
                corpo,
            )
            return False

        mensagem = EmailMessage()
        mensagem["From"] = self.remetente
        mensagem["To"] = destinatario
        mensagem["Subject"] = assunto
        mensagem.set_content(corpo)

        if self.assincrono:
            threading.Thread(target=self._entregar, args=(mensagem,), daemon=True).start()
            return True
        return self._entregar(mensagem)

    def _entregar(self, mensagem: EmailMessage) -> bool:
        """Entrega a mensagem pelo SMTP e registra a falha em vez de propagá-la."""
        try:
            with smtplib.SMTP(self.host, self.porta, timeout=TEMPO_LIMITE_SMTP) as servidor:
                servidor.starttls()
                servidor.login(self.usuario, self.senha)
                servidor.send_message(mensagem)
            return True
        except (smtplib.SMTPException, OSError) as erro:
            registro.error("Falha ao enviar e-mail para %s: %s", mensagem["To"], erro)
            return False
