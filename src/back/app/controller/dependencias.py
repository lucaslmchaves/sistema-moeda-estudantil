"""Raiz de composição: monta cada serviço com os repositórios concretos da sessão."""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.repository.armazenamento_foto_local import ArmazenamentoFotoLocal
from app.repository.database import get_sessao
from app.repository.interfaces import IArmazenamentoFoto
from app.repository.repositorio_aluno import RepositorioAluno
from app.repository.repositorio_conta import RepositorioConta
from app.repository.repositorio_empresa import RepositorioEmpresa
from app.repository.repositorio_instituicao import RepositorioInstituicao
from app.repository.repositorio_professor import RepositorioProfessor
from app.repository.repositorio_transacao import RepositorioTransacao
from app.repository.repositorio_usuario import RepositorioUsuario
from app.repository.repositorio_vantagem import RepositorioVantagem
from app.service.notificador_email import NotificadorEmail
from app.service.servico_aluno import ServicoAluno
from app.service.servico_autenticacao import ServicoAutenticacao
from app.service.servico_email_externo import ServicoEmailExterno
from app.service.servico_empresa import ServicoEmpresa
from app.service.servico_instituicao import ServicoInstituicao
from app.service.servico_moedas import ServicoMoedas
from app.service.servico_vantagem import ServicoVantagem


def obter_servico_aluno(sessao: Session = Depends(get_sessao)) -> ServicoAluno:
    """Monta o serviço de alunos com os repositórios da sessão da requisição."""
    return ServicoAluno(RepositorioAluno(sessao), RepositorioInstituicao(sessao))


def obter_servico_empresa(sessao: Session = Depends(get_sessao)) -> ServicoEmpresa:
    """Monta o serviço de empresas com o repositório da sessão da requisição."""
    return ServicoEmpresa(RepositorioEmpresa(sessao))


def obter_servico_instituicao(sessao: Session = Depends(get_sessao)) -> ServicoInstituicao:
    """Monta o serviço de instituições com o repositório da sessão da requisição."""
    return ServicoInstituicao(RepositorioInstituicao(sessao))


def obter_servico_autenticacao(sessao: Session = Depends(get_sessao)) -> ServicoAutenticacao:
    """Monta o serviço de autenticação com o segredo e a validade do token configurados."""
    return ServicoAutenticacao(
        RepositorioUsuario(sessao), settings.JWT_SEGREDO, settings.JWT_EXPIRA_MINUTOS
    )


def obter_armazenamento_foto() -> IArmazenamentoFoto:
    """Devolve o armazenamento das fotos das vantagens, na pasta configurada."""
    return ArmazenamentoFotoLocal(settings.PASTA_UPLOADS)


def obter_servico_vantagem(
    sessao: Session = Depends(get_sessao),
    armazenamento: IArmazenamentoFoto = Depends(obter_armazenamento_foto),
) -> ServicoVantagem:
    """Monta o serviço de vantagens com o repositório e o armazenamento de fotos."""
    return ServicoVantagem(RepositorioVantagem(sessao), armazenamento)


def obter_notificador() -> NotificadorEmail:
    """Devolve o notificador de e-mails ligado ao servidor SMTP configurado."""
    return ServicoEmailExterno(
        host=settings.SMTP_HOST,
        porta=settings.SMTP_PORTA,
        usuario=settings.SMTP_USUARIO,
        senha=settings.SMTP_SENHA,
        remetente=settings.EMAIL_REMETENTE,
    )


def obter_servico_moedas(
    sessao: Session = Depends(get_sessao),
    notificador: NotificadorEmail = Depends(obter_notificador),
) -> ServicoMoedas:
    """Monta o serviço de moedas com os repositórios da sessão e o notificador de e-mails."""
    return ServicoMoedas(
        RepositorioAluno(sessao),
        RepositorioProfessor(sessao),
        RepositorioVantagem(sessao),
        RepositorioConta(sessao),
        RepositorioTransacao(sessao),
        notificador,
    )
