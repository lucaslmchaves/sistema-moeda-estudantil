"""Serviço com os casos de uso de moedas: envio, resgate, crédito semestral e extrato."""

import secrets
from dataclasses import dataclass
from datetime import datetime, timezone

from model.aluno import Aluno
from model.conta import Conta
from model.enums import TipoUsuario
from model.envio_moedas import EnvioMoedas
from model.professor import Professor
from model.resgate_vantagem import ResgateVantagem
from model.transacao import Transacao
from repository.interfaces import (
    IRepositorioAluno,
    IRepositorioConta,
    IRepositorioProfessor,
    IRepositorioTransacao,
    IRepositorioVantagem,
)
from service.excecoes import DadoInvalido, NaoEncontrado
from service.notificador_email import NotificadorEmail
from service.regras_cadastro import exigir_texto

MENSAGEM_TAMANHO_MAXIMO = 500
VALOR_MAXIMO_ENVIO = 100_000
ALFABETO_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
CODIGO_TAMANHO = 8
CODIGO_TENTATIVAS = 10


@dataclass(frozen=True)
class Extrato:
    """Saldo atual e movimentações de uma conta, da mais recente para a mais antiga."""

    saldo: int
    transacoes: list[Transacao]


class ServicoMoedas:
    """Aplica as regras de envio de moedas, resgate de vantagens e consulta de extrato."""

    def __init__(
        self,
        repo_aluno: IRepositorioAluno,
        repo_professor: IRepositorioProfessor,
        repo_vantagem: IRepositorioVantagem,
        repo_conta: IRepositorioConta,
        repo_transacao: IRepositorioTransacao,
        notificador: NotificadorEmail,
    ):
        """Recebe os repositórios e o notificador por interface, sem conhecer as implementações."""
        self.repo_aluno = repo_aluno
        self.repo_professor = repo_professor
        self.repo_vantagem = repo_vantagem
        self.repo_conta = repo_conta
        self.repo_transacao = repo_transacao
        self.notificador = notificador

    def enviar_moedas(self, id_professor: int, dados: dict) -> EnvioMoedas:
        """Debita o professor, credita o aluno, registra o envio e avisa o aluno por e-mail."""
        valor = self._validar_valor(dados.get("valor"))
        mensagem = self._validar_mensagem(dados.get("mensagem"))
        professor = self._buscar_professor(id_professor)
        aluno = self._buscar_aluno(dados.get("id_aluno"))

        conta_professor, conta_aluno = self._travar_contas(professor, aluno)
        if not conta_professor.debitar(valor):
            raise DadoInvalido(
                f"Saldo insuficiente: você tem {conta_professor.saldo} moedas "
                f"e tentou enviar {valor}."
            )
        conta_aluno.creditar(valor)

        envio = EnvioMoedas(
            id_professor=professor.id_usuario,
            id_aluno=aluno.id_usuario,
            professor=professor,
            aluno=aluno,
            valor=valor,
            mensagem=mensagem,
            data_hora=datetime.now(timezone.utc),
        )
        self.repo_transacao.salvar(envio)
        self.notificador.notificar_recebimento(envio)
        return envio

    def resgatar_vantagem(self, id_aluno: int, id_vantagem: int) -> ResgateVantagem:
        """Desconta o custo do saldo do aluno, gera o código e envia os e-mails do resgate."""
        aluno = self._buscar_aluno(id_aluno)
        vantagem = self.repo_vantagem.buscar_por_id(id_vantagem)
        if vantagem is None:
            raise NaoEncontrado("Vantagem não encontrada.")

        conta = self.repo_conta.buscar_por_usuario(aluno.id_usuario, para_atualizar=True)
        if conta is None or not conta.debitar(vantagem.custo):
            saldo = conta.saldo if conta is not None else 0
            raise DadoInvalido(
                f"Saldo insuficiente: você tem {saldo} moedas e a vantagem custa {vantagem.custo}."
            )

        resgate = ResgateVantagem(
            id_aluno=aluno.id_usuario,
            id_vantagem=vantagem.id_vantagem,
            aluno=aluno,
            vantagem=vantagem,
            valor=vantagem.custo,
            codigo=self._gerar_codigo(),
            data_hora=datetime.now(timezone.utc),
        )
        self.repo_transacao.salvar(resgate)
        self.notificador.notificar_resgate(resgate)
        return resgate

    def creditar_semestre(self) -> int:
        """Credita as moedas do semestre a cada professor ativo e devolve quantos receberam."""
        creditados = 0
        for professor in self.repo_professor.listar():
            self.repo_conta.buscar_por_usuario(professor.id_usuario, para_atualizar=True)
            if professor.receber_credito_semestral():
                creditados += 1
        return creditados

    def consultar_extrato(self, id_usuario: int, perfil: TipoUsuario) -> Extrato:
        """Devolve o saldo e as movimentações do aluno ou do professor."""
        if perfil == TipoUsuario.ALUNO:
            membro = self._buscar_aluno(id_usuario)
        elif perfil == TipoUsuario.PROFESSOR:
            membro = self._buscar_professor(id_usuario)
        else:
            raise DadoInvalido("Somente alunos e professores possuem extrato.")
        conta = self.repo_conta.buscar_por_usuario(id_usuario)
        saldo = conta.consultar_saldo() if conta is not None else 0
        return Extrato(saldo=saldo, transacoes=membro.extrato())

    def _buscar_professor(self, id_usuario: int | None) -> Professor:
        """Devolve o professor ativo ou levanta NaoEncontrado."""
        professor = self.repo_professor.buscar_por_id(id_usuario) if id_usuario else None
        if professor is None:
            raise NaoEncontrado("Professor não encontrado.")
        return professor

    def _buscar_aluno(self, id_usuario: int | None) -> Aluno:
        """Devolve o aluno ativo ou levanta NaoEncontrado."""
        aluno = self.repo_aluno.buscar_por_id(id_usuario) if id_usuario else None
        if aluno is None:
            raise NaoEncontrado("Aluno não encontrado.")
        return aluno

    def _travar_contas(self, professor: Professor, aluno: Aluno) -> tuple[Conta, Conta]:
        """Trava as duas contas sempre na mesma ordem, para evitar bloqueio entre envios."""
        ids = sorted({professor.id_usuario, aluno.id_usuario})
        contas = {i: self.repo_conta.buscar_por_usuario(i, para_atualizar=True) for i in ids}
        conta_professor = contas[professor.id_usuario]
        conta_aluno = contas[aluno.id_usuario]
        if conta_professor is None or conta_aluno is None:
            raise NaoEncontrado("Conta não encontrada.")
        return conta_professor, conta_aluno

    def _validar_valor(self, valor: object) -> int:
        """Exige um valor inteiro de moedas entre 1 e o limite por envio."""
        if isinstance(valor, bool) or not isinstance(valor, int):
            raise DadoInvalido("O valor deve ser um número inteiro de moedas.")
        if not 1 <= valor <= VALOR_MAXIMO_ENVIO:
            raise DadoInvalido(f"O valor deve estar entre 1 e {VALOR_MAXIMO_ENVIO} moedas.")
        return valor

    def _validar_mensagem(self, mensagem: object) -> str:
        """Exige o motivo do reconhecimento, preenchido e dentro do tamanho permitido."""
        texto = exigir_texto("mensagem", mensagem)
        if len(texto) > MENSAGEM_TAMANHO_MAXIMO:
            raise DadoInvalido(
                f"A mensagem deve ter no máximo {MENSAGEM_TAMANHO_MAXIMO} caracteres."
            )
        return texto

    def _gerar_codigo(self) -> str:
        """Sorteia um código de resgate que ainda não foi usado."""
        for _ in range(CODIGO_TENTATIVAS):
            codigo = "".join(secrets.choice(ALFABETO_CODIGO) for _ in range(CODIGO_TAMANHO))
            if not self.repo_transacao.codigo_existe(codigo):
                return codigo
        raise DadoInvalido("Não foi possível gerar o código do resgate. Tente novamente.")
