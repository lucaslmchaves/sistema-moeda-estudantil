"""Rótulos em português dos campos, usados nas mensagens de erro ao usuário."""

ROTULOS_CAMPOS = {
    "nome": "nome",
    "email": "e-mail",
    "cpf": "CPF",
    "cnpj": "CNPJ",
    "rg": "RG",
    "endereco": "endereço",
    "curso": "curso",
    "id_instituicao": "instituição",
    "login": "login",
    "senha": "senha",
    "id": "identificador",
    "descricao": "descrição",
    "custo": "custo",
    "foto": "foto",
    "valor": "valor",
    "mensagem": "mensagem",
    "id_aluno": "aluno",
    "id_vantagem": "vantagem",
    "body": "corpo",
}


def rotulo_do_campo(campo: str) -> str:
    """Devolve o rótulo em português do campo, ou o próprio nome se não houver."""
    return ROTULOS_CAMPOS.get(campo, campo)
