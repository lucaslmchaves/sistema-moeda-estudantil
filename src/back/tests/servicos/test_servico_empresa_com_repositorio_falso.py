"""Prova a inversão de dependência: o ServicoEmpresa funciona com qualquer repositório do contrato."""

import pytest

from service.excecoes import Conflito, NaoEncontrado
from service.servico_empresa import ServicoEmpresa
from tests.fabricas import dados_empresa
from tests.fakes import RepositorioEmpresaFalso


@pytest.fixture
def servico() -> ServicoEmpresa:
    """Serviço ligado a um repositório falso, sem banco."""
    return ServicoEmpresa(RepositorioEmpresaFalso())


def test_cadastrar_empresa_normaliza_cnpj_e_email(servico):
    """Guarda o CNPJ só com dígitos e o e-mail em minúsculas."""
    empresa = servico.cadastrar_empresa(
        dados_empresa(cnpj="11.444.777/0001-61", email="Contato@Loja.com")
    )

    assert empresa.cnpj == "11444777000161"
    assert empresa.email == "contato@loja.com"


def test_cadastrar_empresa_com_cnpj_repetido_levanta_conflito(servico):
    """O mesmo CNPJ com e sem máscara conta como repetido."""
    servico.cadastrar_empresa(dados_empresa(cnpj="11.444.777/0001-61"))

    with pytest.raises(Conflito, match="CNPJ"):
        servico.cadastrar_empresa(dados_empresa(cnpj="11444777000161"))


def test_atualizar_empresa_com_o_proprio_email_nao_gera_conflito(servico):
    """Reenviar o e-mail atual não conflita com o próprio cadastro."""
    empresa = servico.cadastrar_empresa(dados_empresa(email="a@loja.com"))

    atualizada = servico.atualizar_empresa(empresa.id_usuario, {"email": "A@Loja.com"})

    assert atualizada.email == "a@loja.com"


def test_excluir_empresa_devolve_true_e_a_empresa_deixa_de_ser_encontrada(servico):
    """A exclusão lógica devolve True e a empresa deixa de ser encontrada."""
    empresa = servico.cadastrar_empresa(dados_empresa())

    assert servico.excluir_empresa(empresa.id_usuario) is True
    with pytest.raises(NaoEncontrado):
        servico.buscar_empresa(empresa.id_usuario)
