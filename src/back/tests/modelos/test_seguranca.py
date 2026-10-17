"""Testes do hash e da verificação de senhas."""

from model.seguranca import hash_senha, verificar_senha


def test_hash_senha_nao_guarda_a_senha_em_texto_puro():
    """O hash difere da senha original."""
    assert hash_senha("minhaSenha123") != "minhaSenha123"


def test_hash_senha_gera_hashes_diferentes_para_a_mesma_senha():
    """O salt aleatório faz cada hash ser único."""
    assert hash_senha("minhaSenha123") != hash_senha("minhaSenha123")


def test_verificar_senha_aceita_a_correta_e_recusa_a_errada():
    """Só a senha original confere com o hash."""
    senha_hash = hash_senha("minhaSenha123")

    assert verificar_senha("minhaSenha123", senha_hash) is True
    assert verificar_senha("outraSenha123", senha_hash) is False
    assert verificar_senha("", senha_hash) is False


def test_verificar_senha_preserva_espacos_da_senha():
    """Espaços fazem parte da senha."""
    senha_hash = hash_senha("  com espaços  ")

    assert verificar_senha("  com espaços  ", senha_hash) is True
    assert verificar_senha("com espaços", senha_hash) is False


def test_verificar_senha_com_hash_invalido_devolve_false():
    """Um hash corrompido nunca autentica nem levanta erro."""
    assert verificar_senha("qualquer", "isto-nao-e-um-hash") is False
    assert verificar_senha("qualquer", "") is False
