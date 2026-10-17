"""Fábricas de geração de dados válidos para simplificar a criação de cenários de teste."""

import random


def gerar_cpf_valido() -> str:
    """Gera um CPF com dígitos verificadores matematicamente corretos."""
    nove_digitos = [random.randint(0, 9) for _ in range(9)]
    soma_1 = sum(nove_digitos[i] * (10 - i) for i in range(9))
    resto_1 = soma_1 % 11
    d1 = 0 if resto_1 < 2 else 11 - resto_1
    dez_digitos = nove_digitos + [d1]
    soma_2 = sum(dez_digitos[i] * (11 - i) for i in range(10))
    resto_2 = soma_2 % 11
    d2 = 0 if resto_2 < 2 else 11 - resto_2
    return "".join(map(str, dez_digitos + [d2]))


def gerar_cnpj_valido() -> str:
    """Gera um CNPJ com dígitos verificadores matematicamente válidos."""
    doze_digitos = [random.randint(0, 9) for _ in range(8)] + [0, 0, 0, 1]
    pesos_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma_1 = sum(doze_digitos[i] * pesos_1[i] for i in range(12))
    resto_1 = soma_1 % 11
    d1 = 0 if resto_1 < 2 else 11 - resto_1
    treze_digitos = doze_digitos + [d1]
    pesos_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma_2 = sum(treze_digitos[i] * pesos_2[i] for i in range(13))
    resto_2 = soma_2 % 11
    d2 = 0 if resto_2 < 2 else 11 - resto_2
    return "".join(map(str, treze_digitos + [d2]))


def dados_aluno(id_instituicao: int = 1, **sobrescrita) -> dict:
    """Retorna dicionário com dados válidos completos para cadastro de aluno."""
    sufixo = random.randint(1000, 9999)
    dados = {
        "nome": f"Estudante Teste {sufixo}",
        "email": f"aluno{sufixo}@universidade.edu.br",
        "cpf": gerar_cpf_valido(),
        "rg": f"MG-{sufixo}",
        "endereco": f"Avenida Brasil, {sufixo}",
        "curso": "Engenharia de Software",
        "id_instituicao": id_instituicao,
        "login": f"login.aluno{sufixo}",
        "senha": "senhaSegura123",
    }
    dados.update(sobrescrita)
    return dados


def dados_empresa(**sobrescrita) -> dict:
    """Retorna dicionário com dados válidos completos para cadastro de empresa parceira."""
    sufixo = random.randint(1000, 9999)
    dados = {
        "nome": f"Empresa Parceira {sufixo} Ltda",
        "email": f"contato{sufixo}@empresa.com.br",
        "cnpj": gerar_cnpj_valido(),
        "login": f"login.empresa{sufixo}",
        "senha": "senhaSegura123",
    }
    dados.update(sobrescrita)
    return dados
