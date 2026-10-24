"""Evento do sistema: credita as moedas do semestre a cada professor ativo."""

from repository.database import SessionLocal
from repository.repositorio_aluno import RepositorioAluno
from repository.repositorio_conta import RepositorioConta
from repository.repositorio_professor import RepositorioProfessor
from repository.repositorio_transacao import RepositorioTransacao
from repository.repositorio_vantagem import RepositorioVantagem
from service.servico_email_externo import ServicoEmailExterno
from service.servico_moedas import ServicoMoedas


def creditar_semestre() -> int:
    """Credita o semestre a todos os professores ativos e devolve quantos receberam."""
    sessao = SessionLocal()
    try:
        servico = ServicoMoedas(
            RepositorioAluno(sessao),
            RepositorioProfessor(sessao),
            RepositorioVantagem(sessao),
            RepositorioConta(sessao),
            RepositorioTransacao(sessao),
            ServicoEmailExterno("", 0, "", "", ""),
        )
        creditados = servico.creditar_semestre()
        sessao.commit()
        print(f"[SEMESTRE] Moedas do semestre creditadas a {creditados} professor(es).")
        return creditados
    except Exception:
        sessao.rollback()
        raise
    finally:
        sessao.close()


if __name__ == "__main__":
    creditar_semestre()
