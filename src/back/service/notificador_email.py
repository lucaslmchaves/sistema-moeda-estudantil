"""Contrato do envio de e-mails: o serviço de moedas depende desta abstração."""

from abc import ABC, abstractmethod

from model.envio_moedas import EnvioMoedas
from model.resgate_vantagem import ResgateVantagem


class NotificadorEmail(ABC):
    """Contrato das notificações por e-mail do sistema."""

    @abstractmethod
    def notificar_recebimento(self, envio: EnvioMoedas) -> bool:
        """Avisa o aluno de que recebeu moedas."""

    @abstractmethod
    def notificar_resgate(self, resgate: ResgateVantagem) -> bool:
        """Envia o cupom ao aluno e a conferência à empresa parceira, com o mesmo código."""
