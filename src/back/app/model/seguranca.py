"""Módulo de segurança para geração e validação de senhas com bcrypt."""

import bcrypt


def hash_senha(senha: str) -> str:
    """Gera hash bcrypt com salt aleatório para armazenamento seguro de credenciais."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(senha.encode("utf-8"), salt).decode("utf-8")


def verificar_senha(senha: str, senha_hash: str) -> bool:
    """Valida a senha em texto contra o hash armazenado para autenticação."""
    if not senha or not senha_hash:
        return False
    try:
        return bcrypt.checkpw(senha.encode("utf-8"), senha_hash.encode("utf-8"))
    except Exception:
        return False
