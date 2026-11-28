"""Regras de cadastro compartilhadas pelos serviços de aluno e de empresa parceira."""

from collections.abc import Callable

from app.model.usuario import Usuario
from app.service.excecoes import Conflito, DadoInvalido
from app.service.formatos import (
    curso_valido,
    endereco_valido,
    login_valido,
    nome_completo_valido,
    nome_de_empresa_valido,
    rg_valido,
    senha_tem_letra_e_numero,
)
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
    """Recusa senha vazia, fora do tamanho ou sem letra e número e a devolve sem alterações."""
    prefixo = "A nova senha" if nova else "A senha"
    texto = str(senha if senha is not None else "")
    if not texto.strip():
        raise DadoInvalido(f"{prefixo} não pode ser vazia ou conter apenas espaços.")
    if not SENHA_TAMANHO_MINIMO <= len(texto) <= SENHA_TAMANHO_MAXIMO:
        raise DadoInvalido(
            f"{prefixo} deve conter entre {SENHA_TAMANHO_MINIMO} e "
            f"{SENHA_TAMANHO_MAXIMO} caracteres."
        )
    if not senha_tem_letra_e_numero(texto):
        raise DadoInvalido(f"{prefixo} deve ter pelo menos uma letra e um número.")
    return texto


def _exigir_formato(
    campo: str, valor: object, valido: Callable[[str], bool], mensagem: str
) -> str:
    """Exige o texto preenchido e no formato esperado."""
    texto = exigir_texto(campo, valor)
    if not valido(texto):
        raise DadoInvalido(mensagem)
    return texto


def validar_login(login: object) -> str:
    """Confere o login de um cadastro novo."""
    return _exigir_formato(
        "login",
        login,
        login_valido,
        "Use no login de 3 a 60 letras sem acento, números, ponto, traço ou sublinhado.",
    )


def validar_nome_completo(nome: object) -> str:
    """Confere o nome de uma pessoa."""
    return _exigir_formato(
        "nome", nome, nome_completo_valido, "Informe o nome e o sobrenome, só com letras."
    )


def validar_nome_de_empresa(nome: object) -> str:
    """Confere o nome de uma empresa."""
    return _exigir_formato("nome", nome, nome_de_empresa_valido, "Informe o nome da empresa.")


def validar_rg(rg: object) -> str:
    """Confere o formato do RG."""
    return _exigir_formato("rg", rg, rg_valido, "Informe um RG válido. Ex.: MG-12.345.678.")


def validar_endereco(endereco: object) -> str:
    """Confere se o endereço tem rua e número."""
    return _exigir_formato(
        "endereco",
        endereco,
        endereco_valido,
        "Informe a rua e o número. Ex.: Rua da Bahia, 1200 (ou s/n).",
    )


def validar_curso(curso: object) -> str:
    """Confere se o curso está na lista."""
    return _exigir_formato("curso", curso, curso_valido, "Escolha um curso da lista.")


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
