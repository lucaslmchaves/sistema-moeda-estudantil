"""Testes do ServicoVantagem: cadastro com foto, consulta e exclusão das vantagens."""

import pytest
from sqlalchemy.orm import Session

from repository.repositorio_empresa import RepositorioEmpresa
from repository.repositorio_vantagem import RepositorioVantagem
from service.excecoes import DadoInvalido, NaoEncontrado
from service.servico_empresa import ServicoEmpresa
from service.servico_vantagem import (
    CUSTO_MAXIMO,
    DESCRICAO_TAMANHO_MAXIMO,
    FOTO_TAMANHO_MAXIMO,
    ServicoVantagem,
    detectar_extensao_foto,
)
from tests.fabricas import FOTO_JPEG, FOTO_PNG, FOTO_WEBP, dados_empresa
from tests.fakes import ArmazenamentoFotoFalso


@pytest.fixture
def armazenamento() -> ArmazenamentoFotoFalso:
    """Armazenamento de fotos em memória."""
    return ArmazenamentoFotoFalso()


@pytest.fixture
def servico(sessao: Session, armazenamento: ArmazenamentoFotoFalso) -> ServicoVantagem:
    """Serviço ligado ao repositório do banco de teste e ao armazenamento falso."""
    return ServicoVantagem(RepositorioVantagem(sessao), armazenamento)


@pytest.fixture
def empresa(sessao: Session):
    """Empresa parceira cadastrada."""
    return ServicoEmpresa(RepositorioEmpresa(sessao)).cadastrar_empresa(dados_empresa())


@pytest.mark.parametrize(
    "foto, extensao", [(FOTO_JPEG, "jpg"), (FOTO_PNG, "png"), (FOTO_WEBP, "webp")]
)
def test_detectar_extensao_reconhece_os_formatos_aceitos(foto, extensao):
    """JPEG, PNG e WebP são reconhecidos pelos primeiros bytes."""
    assert detectar_extensao_foto(foto) == extensao


def test_detectar_extensao_recusa_outros_formatos():
    """Texto, GIF e conteúdo vazio não são aceitos."""
    assert detectar_extensao_foto(b"GIF89a") is None
    assert detectar_extensao_foto(b"texto qualquer") is None
    assert detectar_extensao_foto(b"") is None


def test_cadastrar_vantagem_guarda_a_foto_e_a_vantagem_da_empresa(servico, armazenamento, empresa):
    """A vantagem fica com o caminho devolvido pelo armazenamento e pertence à empresa."""
    vantagem = servico.cadastrar_vantagem(
        empresa.id_usuario, {"descricao": "  Café grátis  ", "custo": 25}, FOTO_JPEG
    )

    assert vantagem.descricao == "Café grátis"
    assert vantagem.custo == 25
    assert vantagem.id_empresa == empresa.id_usuario
    assert vantagem.foto == "/uploads/foto-1.jpg"
    assert armazenamento.fotos == [(FOTO_JPEG, "jpg")]


@pytest.mark.parametrize(
    "dados, mensagem",
    [
        ({"descricao": "", "custo": 10}, "descrição não pode ficar vazio"),
        ({"descricao": "   ", "custo": 10}, "descrição não pode ficar vazio"),
        ({"descricao": "x" * (DESCRICAO_TAMANHO_MAXIMO + 1), "custo": 10}, "no máximo 255"),
        ({"descricao": "ok", "custo": 0}, "entre 1 e"),
        ({"descricao": "ok", "custo": -3}, "entre 1 e"),
        ({"descricao": "ok", "custo": CUSTO_MAXIMO + 1}, "entre 1 e"),
        ({"descricao": "ok", "custo": "10"}, "número inteiro"),
        ({"descricao": "ok", "custo": True}, "número inteiro"),
        ({"descricao": "ok"}, "número inteiro"),
    ],
)
def test_cadastrar_vantagem_recusa_dados_invalidos(servico, empresa, dados, mensagem):
    """Descrição e custo fora das regras são recusados com mensagem em português."""
    with pytest.raises(DadoInvalido, match=mensagem):
        servico.cadastrar_vantagem(empresa.id_usuario, dados, FOTO_PNG)


@pytest.mark.parametrize(
    "foto, mensagem",
    [
        (b"", "obrigatória"),
        (b"nao sou imagem", "JPEG, PNG ou WebP"),
        (FOTO_PNG + b"\x00" * FOTO_TAMANHO_MAXIMO, "no máximo 2 MB"),
    ],
)
def test_cadastrar_vantagem_recusa_foto_invalida_sem_guardar_nada(
    servico, armazenamento, empresa, foto, mensagem
):
    """Foto vazia, de outro formato ou grande demais é recusada antes de ser armazenada."""
    with pytest.raises(DadoInvalido, match=mensagem):
        servico.cadastrar_vantagem(empresa.id_usuario, {"descricao": "ok", "custo": 10}, foto)

    assert armazenamento.fotos == []


def test_listar_vantagens_e_da_empresa(servico, sessao, empresa):
    """O catálogo traz todas as vantagens; a lista da empresa, só as dela."""
    outra = ServicoEmpresa(RepositorioEmpresa(sessao)).cadastrar_empresa(dados_empresa())
    minha = servico.cadastrar_vantagem(empresa.id_usuario, {"descricao": "A", "custo": 1}, FOTO_PNG)
    dela = servico.cadastrar_vantagem(outra.id_usuario, {"descricao": "B", "custo": 2}, FOTO_PNG)

    assert {v.id_vantagem for v in servico.listar_vantagens()} == {
        minha.id_vantagem,
        dela.id_vantagem,
    }
    assert [v.id_vantagem for v in servico.listar_vantagens_da_empresa(empresa.id_usuario)] == [
        minha.id_vantagem
    ]


def test_excluir_vantagem_so_vale_para_a_empresa_dona(servico, sessao, empresa):
    """Outra empresa não exclui a vantagem; a dona exclui e ela some das listas."""
    outra = ServicoEmpresa(RepositorioEmpresa(sessao)).cadastrar_empresa(dados_empresa())
    vantagem = servico.cadastrar_vantagem(
        empresa.id_usuario, {"descricao": "A", "custo": 1}, FOTO_PNG
    )

    with pytest.raises(NaoEncontrado, match="Vantagem não encontrada"):
        servico.excluir_vantagem(outra.id_usuario, vantagem.id_vantagem)
    assert servico.excluir_vantagem(empresa.id_usuario, vantagem.id_vantagem) is True
    assert servico.listar_vantagens() == []
    with pytest.raises(NaoEncontrado):
        servico.excluir_vantagem(empresa.id_usuario, vantagem.id_vantagem)
