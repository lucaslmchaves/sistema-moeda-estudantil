"""Utilitários de normalização e validação de documentos e e-mails."""

import re


def normalizar_cpf(cpf: str) -> str:
    """Extrai apenas os dígitos numéricos do CPF para garantir unicidade no banco."""
    return re.sub(r"\D", "", cpf or "")


def normalizar_cnpj(cnpj: str) -> str:
    """Extrai apenas os dígitos numéricos do CNPJ para garantir unicidade no banco."""
    return re.sub(r"\D", "", cnpj or "")


def normalizar_email(email: str) -> str:
    """Padroniza o e-mail em minúsculas e sem espaços para evitar duplicidade de contas."""
    return (email or "").strip().lower()


def validar_cpf(cpf: str) -> bool:
    """Verifica se o CPF possui onze dígitos e dígitos verificadores matematicamente válidos."""
    if not cpf or not isinstance(cpf, str):
        return False
    digitos = normalizar_cpf(cpf)
    if len(digitos) != 11 or len(set(digitos)) == 1:
        return False
    nums = [int(d) for d in digitos]
    soma_1 = sum(nums[i] * (10 - i) for i in range(9))
    resto_1 = soma_1 % 11
    d10 = 0 if resto_1 < 2 else 11 - resto_1
    if nums[9] != d10:
        return False
    soma_2 = sum(nums[i] * (11 - i) for i in range(10))
    resto_2 = soma_2 % 11
    d11 = 0 if resto_2 < 2 else 11 - resto_2
    return nums[10] == d11


def validar_cnpj(cnpj: str) -> bool:
    """Verifica se o CNPJ possui quatorze dígitos e dígitos verificadores válidos."""
    if not cnpj or not isinstance(cnpj, str):
        return False
    digitos = normalizar_cnpj(cnpj)
    if len(digitos) != 14 or len(set(digitos)) == 1:
        return False
    nums = [int(d) for d in digitos]
    pesos_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma_1 = sum(nums[i] * pesos_1[i] for i in range(12))
    resto_1 = soma_1 % 11
    d13 = 0 if resto_1 < 2 else 11 - resto_1
    if nums[12] != d13:
        return False
    pesos_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma_2 = sum(nums[i] * pesos_2[i] for i in range(13))
    resto_2 = soma_2 % 11
    d14 = 0 if resto_2 < 2 else 11 - resto_2
    return nums[13] == d14


def validar_email(email: str) -> bool:
    """Valida se o endereço respeita o padrão RFC básico com usuário e domínio."""
    if not email or not isinstance(email, str):
        return False
    return bool(re.match(r"^[\w\.+-]+@[\w\.-]+\.\w+$", email.strip()))
