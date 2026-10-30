"""Testes unitários das regras da classe abstrata MembroInstituicao."""

import pytest

from app.model.membro_instituicao import MembroInstituicao


def test_membro_instituicao_extrato_abstrato_levanta_not_implemented():
    """Garante que a chamada ao método abstrato extrato levanta NotImplementedError."""
    with pytest.raises(NotImplementedError):
        MembroInstituicao.extrato(None)
