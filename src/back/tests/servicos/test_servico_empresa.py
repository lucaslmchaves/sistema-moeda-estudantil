"""Testes unitários das regras de negócio e validações do ServicoEmpresa."""

import pytest
from sqlalchemy.orm import Session

from repository.repositorio_empresa import RepositorioEmpresa
from service.excecoes import Conflito, DadoInvalido, NaoEncontrado
from service.servico_empresa import ServicoEmpresa
from tests.fabricas import dados_empresa


def test_cadastrar_empresa_com_dados_validos_salva_com_sucesso(sessao: Session):
    """Garante que empresa parceira com dados válidos é persistida com CNPJ normalizado."""
    servico = ServicoEmpresa(RepositorioEmpresa(sessao))
    payload = dados_empresa(cnpj="00.000.000/0001-91")

    empresa = servico.cadastrar_empresa(payload)
    sessao.commit()

    assert empresa.id_usuario is not None
    assert empresa.cnpj == "00000000000191"
    assert empresa.autenticar(payload["senha"]) is True


def test_cadastrar_empresa_com_cnpj_invalido_levanta_dado_invalido(sessao: Session):
    """Rejeita cadastros de empresas parceiras com CNPJ inválido."""
    servico = ServicoEmpresa(RepositorioEmpresa(sessao))
    payload = dados_empresa(cnpj="11.111.111/1111-11")

    with pytest.raises(DadoInvalido, match="CNPJ inválido"):
        servico.cadastrar_empresa(payload)


def test_cadastrar_empresa_com_campos_vazios_levanta_dado_invalido(sessao: Session):
    """Rejeita cadastros de empresas cujo nome ou login contenham apenas espaços em branco."""
    servico = ServicoEmpresa(RepositorioEmpresa(sessao))

    with pytest.raises(DadoInvalido, match="O campo nome não pode ficar vazio"):
        servico.cadastrar_empresa(dados_empresa(nome="   "))

    with pytest.raises(DadoInvalido, match="O campo login não pode ficar vazio"):
        servico.cadastrar_empresa(dados_empresa(login="   "))


def test_cadastrar_empresa_com_cnpj_com_e_sem_mascara_levanta_conflito(sessao: Session):
    """Garante que CNPJs digitados com ou sem pontuação colidam na validação de unicidade."""
    servico = ServicoEmpresa(RepositorioEmpresa(sessao))
    p1 = dados_empresa(cnpj="00.000.000/0001-91")
    servico.cadastrar_empresa(p1)
    sessao.commit()

    p2 = dados_empresa(cnpj="00000000000191")
    with pytest.raises(Conflito, match="CNPJ informado já está cadastrado"):
        servico.cadastrar_empresa(p2)


def test_atualizar_e_excluir_empresa_retorna_true_e_aplica_soft_delete(sessao: Session):
    """Testa atualização de razão social e confirma retorno True na exclusão lógica."""
    servico = ServicoEmpresa(RepositorioEmpresa(sessao))
    empresa = servico.cadastrar_empresa(dados_empresa())
    sessao.commit()

    servico.atualizar_empresa(empresa.id_usuario, {"nome": "Novo Nome Fantasia"})
    sessao.commit()

    buscada = servico.buscar_empresa(empresa.id_usuario)
    assert buscada.nome == "Novo Nome Fantasia"

    sucesso = servico.excluir_empresa(empresa.id_usuario)
    assert sucesso is True
    sessao.commit()

    with pytest.raises(NaoEncontrado):
        servico.buscar_empresa(empresa.id_usuario)
    assert len(servico.listar_empresas()) == 0
