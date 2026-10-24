"""Serviço com as regras de negócio e os casos de uso da entidade Aluno."""

from app.model.aluno import Aluno
from app.model.conta import Conta
from app.model.enums import TipoUsuario
from app.model.seguranca import hash_senha
from app.repository.interfaces import IRepositorioAluno, IRepositorioInstituicao
from app.service.excecoes import DadoInvalido, NaoEncontrado
from app.service.regras_cadastro import (
    exigir_texto,
    garantir_login_livre,
    garantir_unico,
    validar_e_normalizar_cpf,
    validar_e_normalizar_email,
    validar_senha,
)

CAMPOS_TEXTO_ALUNO = ("nome", "rg", "endereco", "curso")


class ServicoAluno:
    """Aplica as regras de cadastro, unicidade e exclusão de alunos."""

    def __init__(self, repo_aluno: IRepositorioAluno, repo_instituicao: IRepositorioInstituicao):
        """Recebe os repositórios por interface, sem conhecer a implementação."""
        self.repo_aluno = repo_aluno
        self.repo_instituicao = repo_instituicao

    def cadastrar_aluno(self, dados: dict) -> Aluno:
        """Cadastra o aluno e abre a conta com saldo zero na mesma operação."""
        login = exigir_texto("login", dados.get("login"))
        textos = {campo: exigir_texto(campo, dados.get(campo)) for campo in CAMPOS_TEXTO_ALUNO}
        cpf = validar_e_normalizar_cpf(dados.get("cpf"))
        email = validar_e_normalizar_email(dados.get("email"))
        senha = validar_senha(dados.get("senha"))
        id_instituicao = self._exigir_instituicao(dados.get("id_instituicao"))
        self._garantir_cadastro_livre(login, cpf, email)

        aluno = Aluno(
            login=login,
            senha_hash=hash_senha(senha),
            tipo_usuario=TipoUsuario.ALUNO,
            ativo=True,
            cpf=cpf,
            email=email,
            id_instituicao=id_instituicao,
            **textos,
        )
        self.repo_aluno.salvar(aluno)
        self.repo_aluno.salvar_conta(Conta(id_usuario=aluno.id_usuario, saldo=0))
        return aluno

    def atualizar_aluno(self, id_usuario: int, dados: dict) -> Aluno:
        """Atualiza só os campos informados; o login nunca muda."""
        aluno = self.buscar_aluno(id_usuario)
        self._atualizar_email(aluno, dados.get("email"))
        self._atualizar_cpf(aluno, dados.get("cpf"))
        self._atualizar_instituicao(aluno, dados.get("id_instituicao"))
        if dados.get("senha") is not None:
            aluno.senha_hash = hash_senha(validar_senha(dados["senha"], nova=True))
        for campo in CAMPOS_TEXTO_ALUNO:
            if dados.get(campo) is not None:
                setattr(aluno, campo, exigir_texto(campo, dados[campo]))
        self.repo_aluno.salvar(aluno)
        return aluno

    def excluir_aluno(self, id_usuario: int) -> bool:
        """Inativa o aluno sem apagar o histórico de transações."""
        return self.repo_aluno.marcar_excluido(self.buscar_aluno(id_usuario))

    def buscar_aluno(self, id_usuario: int) -> Aluno:
        """Devolve o aluno ativo ou levanta NaoEncontrado."""
        aluno = self.repo_aluno.buscar_por_id(id_usuario)
        if aluno is None:
            raise NaoEncontrado("Aluno não encontrado.")
        return aluno

    def listar_alunos(self) -> list[Aluno]:
        """Devolve todos os alunos ativos."""
        return self.repo_aluno.listar()

    def _exigir_instituicao(self, id_instituicao: int | None) -> int:
        """Garante que a instituição informada exista."""
        if not id_instituicao or self.repo_instituicao.buscar_por_id(id_instituicao) is None:
            raise DadoInvalido("A instituição de ensino informada não existe.")
        return id_instituicao

    def _garantir_cadastro_livre(self, login: str, cpf: str, email: str) -> None:
        """Recusa login, CPF ou e-mail que já pertençam a outro cadastro."""
        garantir_login_livre(self.repo_aluno.buscar_por_login(login))
        garantir_unico(self.repo_aluno.buscar_por_cpf(cpf), "CPF")
        garantir_unico(self.repo_aluno.buscar_por_email(email), "e-mail")

    def _atualizar_email(self, aluno: Aluno, email: str | None) -> None:
        """Troca o e-mail, se informado, conferindo formato e unicidade."""
        if email is None:
            return
        novo = validar_e_normalizar_email(email)
        if novo != aluno.email:
            garantir_unico(self.repo_aluno.buscar_por_email(novo), "e-mail", aluno.id_usuario)
            aluno.email = novo

    def _atualizar_cpf(self, aluno: Aluno, cpf: str | None) -> None:
        """Troca o CPF, se informado, conferindo dígitos e unicidade."""
        if cpf is None:
            return
        novo = validar_e_normalizar_cpf(cpf)
        if novo != aluno.cpf:
            garantir_unico(self.repo_aluno.buscar_por_cpf(novo), "CPF", aluno.id_usuario)
            aluno.cpf = novo

    def _atualizar_instituicao(self, aluno: Aluno, id_instituicao: int | None) -> None:
        """Troca a instituição, se informada, conferindo que ela existe."""
        if id_instituicao is not None and id_instituicao != aluno.id_instituicao:
            aluno.id_instituicao = self._exigir_instituicao(id_instituicao)
