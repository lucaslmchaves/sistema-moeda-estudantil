"""Regras de cadastro compartilhadas pelos serviços de aluno e de empresa parceira."""

from app.model.usuario import Usuario
from app.service.excecoes import Conflito, DadoInvalido
from app.service.rotulos import rotulo_do_campo
from app.service.validadores import (
    normalizar_cnpj,
    normalizar_cpf,
    normalizar_email,
    validar_cnpj,
    validar_cpf,
    validar_email,
)

SENHA_TAMANHO_MINIMO = 8
SENHA_TAMANHO_MAXIMO = 72  # limite do bcrypt


def exigir_texto(campo: str, valor: object) -> str:
    """Devolve o texto sem espaços nas pontas ou recusa se ficar vazio."""
    texto = str(valor if valor is not None else "").strip()
    if not texto:
        raise DadoInvalido(
            f"O campo {rotulo_do_campo(campo)} não pode ficar vazio ou conter só espaços."
        )
    return texto


def validar_senha(senha: object, nova: bool = False) -> str:
    """Recusa senha vazia ou fora do tamanho permitido e a devolve sem alterações."""
    prefixo = "A nova senha" if nova else "A senha"
    texto = str(senha if senha is not None else "")
    if not texto.strip():
        raise DadoInvalido(f"{prefixo} não pode ser vazia ou conter apenas espaços.")
    if not SENHA_TAMANHO_MINIMO <= len(texto) <= SENHA_TAMANHO_MAXIMO:
        raise DadoInvalido(
            f"{prefixo} deve conter entre {SENHA_TAMANHO_MINIMO} e "
            f"{SENHA_TAMANHO_MAXIMO} caracteres."
        )
    return texto


def validar_e_normalizar_email(email: object) -> str:
    """Normaliza o e-mail e recusa formato inválido."""
    normalizado = normalizar_email(str(email if email is not None else ""))
    if not validar_email(normalizado):
        raise DadoInvalido("E-mail inválido.")
    return normalizado


def validar_e_normalizar_cpf(cpf: object) -> str:
    """Confere os dígitos verificadores e devolve o CPF só com números."""
    bruto = str(cpf if cpf is not None else "")
    if not validar_cpf(bruto):
        raise DadoInvalido("CPF inválido: os dígitos verificadores não conferem.")
    return normalizar_cpf(bruto)


def validar_e_normalizar_cnpj(cnpj: object) -> str:
    """Confere os dígitos verificadores e devolve o CNPJ só com números."""
    bruto = str(cnpj if cnpj is not None else "")
    if not validar_cnpj(bruto):
        raise DadoInvalido("CNPJ inválido: os dígitos verificadores não conferem.")
    return normalizar_cnpj(bruto)


def garantir_login_livre(existente: Usuario | None) -> None:
    """Recusa o cadastro quando o login já pertence a outro usuário."""
    if existente is not None:
        raise Conflito("O login informado já está em uso.")


def garantir_unico(existente: object | None, rotulo: str, id_proprio: int | None = None) -> None:
    """Recusa o valor que já pertence a outro registro, ignorando o próprio."""
    if existente is not None and getattr(existente, "id_usuario", None) != id_proprio:
        raise Conflito(f"O {rotulo} informado já está cadastrado.")
