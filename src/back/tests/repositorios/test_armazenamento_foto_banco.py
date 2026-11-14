"""Testes do ArmazenamentoFotoBanco: gravação e leitura das fotos no banco."""

from sqlalchemy.orm import Session

from app.repository.armazenamento_foto_banco import ArmazenamentoFotoBanco


def test_salvar_grava_a_foto_no_banco_e_devolve_o_caminho_publico(sessao: Session):
    """A foto vira uma linha da tabela e o caminho devolvido leva até ela."""
    armazenamento = ArmazenamentoFotoBanco(sessao)

    caminho = armazenamento.salvar(b"conteudo-da-foto", "png")

    assert caminho.startswith("/fotos/")
    foto = armazenamento.obter(int(caminho.removeprefix("/fotos/")))
    assert foto is not None
    assert foto.conteudo == b"conteudo-da-foto"
    assert foto.extensao == "png"


def test_cada_foto_recebe_um_caminho_diferente(sessao: Session):
    """Duas fotos iguais não se sobrescrevem."""
    armazenamento = ArmazenamentoFotoBanco(sessao)

    assert armazenamento.salvar(b"a", "jpg") != armazenamento.salvar(b"a", "jpg")


def test_obter_foto_inexistente_devolve_none(sessao: Session):
    """Pedir uma foto que não existe não levanta erro."""
    assert ArmazenamentoFotoBanco(sessao).obter(999) is None
