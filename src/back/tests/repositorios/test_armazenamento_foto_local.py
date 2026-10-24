"""Testes do ArmazenamentoFotoLocal: gravação das fotos em disco."""

from pathlib import Path

from app.repository.armazenamento_foto_local import ArmazenamentoFotoLocal


def test_salvar_grava_o_arquivo_na_pasta_e_devolve_o_caminho_publico(tmp_path: Path):
    """O arquivo vai para a pasta com nome único e o caminho devolvido começa com /uploads."""
    armazenamento = ArmazenamentoFotoLocal(str(tmp_path / "fotos"))

    caminho = armazenamento.salvar(b"conteudo-da-foto", "png")

    assert caminho.startswith("/uploads/") and caminho.endswith(".png")
    arquivo = tmp_path / "fotos" / caminho.removeprefix("/uploads/")
    assert arquivo.read_bytes() == b"conteudo-da-foto"


def test_cada_foto_recebe_um_nome_diferente(tmp_path: Path):
    """Duas fotos iguais não se sobrescrevem."""
    armazenamento = ArmazenamentoFotoLocal(str(tmp_path))

    assert armazenamento.salvar(b"a", "jpg") != armazenamento.salvar(b"a", "jpg")
    assert len(list(tmp_path.iterdir())) == 2
