"""Teste da sessão do banco nas rotas: o commit tem de acontecer antes da resposta sair."""

import inspect

from app.controller import dependencias


def test_todas_as_dependencias_de_servico_confirmam_a_sessao_antes_da_resposta():
    """A sessão usa escopo de função: sem isso, o cliente pode ler dados ainda não gravados."""
    fabricas = [
        obj
        for nome, obj in inspect.getmembers(dependencias, inspect.isfunction)
        if nome.startswith("obter_servico_") and "sessao" in inspect.signature(obj).parameters
    ]

    assert fabricas, "nenhuma dependência de serviço encontrada"
    for fabrica in fabricas:
        padrao = inspect.signature(fabrica).parameters["sessao"].default
        assert padrao.scope == "function", fabrica.__name__
