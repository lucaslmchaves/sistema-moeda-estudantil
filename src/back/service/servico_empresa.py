"""Serviço com as regras de negócio e os casos de uso da Empresa Parceira."""

from model.empresa_parceira import EmpresaParceira
from model.enums import TipoUsuario
from model.seguranca import hash_senha
from repository.interfaces import IRepositorioEmpresa
from service.excecoes import NaoEncontrado
from service.regras_cadastro import (
    exigir_texto,
    garantir_login_livre,
    garantir_unico,
    validar_e_normalizar_cnpj,
    validar_e_normalizar_email,
    validar_senha,
)


class ServicoEmpresa:
    """Aplica as regras de cadastro, unicidade e exclusão de empresas parceiras."""

    def __init__(self, repo_empresa: IRepositorioEmpresa):
        """Recebe o repositório por interface, sem conhecer a implementação."""
        self.repo_empresa = repo_empresa

    def cadastrar_empresa(self, dados: dict) -> EmpresaParceira:
        """Cadastra a empresa com senha em hash, depois de validar e conferir unicidade."""
        login = exigir_texto("login", dados.get("login"))
        nome = exigir_texto("nome", dados.get("nome"))
        cnpj = validar_e_normalizar_cnpj(dados.get("cnpj"))
        email = validar_e_normalizar_email(dados.get("email"))
        senha = validar_senha(dados.get("senha"))
        self._garantir_cadastro_livre(login, cnpj, email)

        empresa = EmpresaParceira(
            login=login,
            senha_hash=hash_senha(senha),
            tipo_usuario=TipoUsuario.EMPRESA_PARCEIRA,
            ativo=True,
            nome=nome,
            email=email,
            cnpj=cnpj,
        )
        return self.repo_empresa.salvar(empresa)

    def atualizar_empresa(self, id_usuario: int, dados: dict) -> EmpresaParceira:
        """Atualiza só os campos informados; o login nunca muda."""
        empresa = self.buscar_empresa(id_usuario)
        self._atualizar_email(empresa, dados.get("email"))
        self._atualizar_cnpj(empresa, dados.get("cnpj"))
        if dados.get("senha") is not None:
            empresa.senha_hash = hash_senha(validar_senha(dados["senha"], nova=True))
        if dados.get("nome") is not None:
            empresa.nome = exigir_texto("nome", dados["nome"])
        return self.repo_empresa.salvar(empresa)

    def excluir_empresa(self, id_usuario: int) -> bool:
        """Inativa a empresa sem apagar as vantagens e o histórico de resgates."""
        return self.repo_empresa.marcar_excluido(self.buscar_empresa(id_usuario))

    def buscar_empresa(self, id_usuario: int) -> EmpresaParceira:
        """Devolve a empresa ativa ou levanta NaoEncontrado."""
        empresa = self.repo_empresa.buscar_por_id(id_usuario)
        if empresa is None:
            raise NaoEncontrado("Empresa parceira não encontrada.")
        return empresa

    def _garantir_cadastro_livre(self, login: str, cnpj: str, email: str) -> None:
        """Recusa login, CNPJ ou e-mail que já pertençam a outro cadastro."""
        garantir_login_livre(self.repo_empresa.buscar_por_login(login))
        garantir_unico(self.repo_empresa.buscar_por_cnpj(cnpj), "CNPJ")
        garantir_unico(self.repo_empresa.buscar_por_email(email), "e-mail")

    def _atualizar_email(self, empresa: EmpresaParceira, email: str | None) -> None:
        """Troca o e-mail, se informado, conferindo formato e unicidade."""
        if email is None:
            return
        novo = validar_e_normalizar_email(email)
        if novo != empresa.email:
            garantir_unico(self.repo_empresa.buscar_por_email(novo), "e-mail", empresa.id_usuario)
            empresa.email = novo

    def _atualizar_cnpj(self, empresa: EmpresaParceira, cnpj: str | None) -> None:
        """Troca o CNPJ, se informado, conferindo dígitos e unicidade."""
        if cnpj is None:
            return
        novo = validar_e_normalizar_cnpj(cnpj)
        if novo != empresa.cnpj:
            garantir_unico(self.repo_empresa.buscar_por_cnpj(novo), "CNPJ", empresa.id_usuario)
            empresa.cnpj = novo
