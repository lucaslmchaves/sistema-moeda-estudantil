"""Regras de formato dos dados de cadastro, as mesmas conferidas pelas telas do front-end."""

import re

# A mesma lista aparece em src/front/src/utils/regrasDeCampos.ts.
CURSOS = (
    "Administração",
    "Análise e Desenvolvimento de Sistemas",
    "Arquitetura e Urbanismo",
    "Biomedicina",
    "Ciência da Computação",
    "Ciências Biológicas",
    "Ciências Contábeis",
    "Ciências Econômicas",
    "Cinema e Audiovisual",
    "Comunicação Social",
    "Design",
    "Direito",
    "Educação Física",
    "Enfermagem",
    "Engenharia Aeronáutica",
    "Engenharia Ambiental",
    "Engenharia Civil",
    "Engenharia de Computação",
    "Engenharia de Controle e Automação",
    "Engenharia de Produção",
    "Engenharia de Software",
    "Engenharia Elétrica",
    "Engenharia Mecânica",
    "Engenharia Mecatrônica",
    "Engenharia Química",
    "Farmácia",
    "Filosofia",
    "Física",
    "Fisioterapia",
    "Geografia",
    "História",
    "Jogos Digitais",
    "Jornalismo",
    "Letras",
    "Matemática",
    "Medicina",
    "Medicina Veterinária",
    "Nutrição",
    "Odontologia",
    "Pedagogia",
    "Psicologia",
    "Publicidade e Propaganda",
    "Redes de Computadores",
    "Relações Internacionais",
    "Serviço Social",
    "Sistemas de Informação",
    "Teologia",
    "Outro",
)

# Letra de qualquer alfabeto, com ou sem acento.
_LETRA = r"[^\W\d_]"
_PARTE_DO_NOME = rf"(?:{_LETRA}|['.\-])+"


def nome_completo_valido(texto: str) -> bool:
    """Nome e sobrenome, só com letras e os sinais comuns em nomes."""
    formato = rf"{_PARTE_DO_NOME}(?: +{_PARTE_DO_NOME})+"
    return bool(re.fullmatch(formato, texto)) and len(re.findall(_LETRA, texto)) >= 4


def nome_de_empresa_valido(texto: str) -> bool:
    """Pelo menos dois caracteres, com alguma letra."""
    return len(texto) >= 2 and bool(re.search(_LETRA, texto))


def rg_valido(texto: str) -> bool:
    """Até duas letras do estado e de 5 a 9 dígitos, com ou sem pontos e traço."""
    limpo = re.sub(r"[.\s-]", "", texto)
    return bool(re.fullmatch(r"[A-Za-z]{0,2}[0-9]{5,9}[Xx]?", limpo))


def endereco_valido(texto: str) -> bool:
    """Precisa do nome da rua e de um número (ou "s/n")."""
    tem_rua = bool(re.search(rf"{_LETRA}{{3,}}", texto))
    tem_numero = bool(
        re.search(
            r"(^|[\s,])([0-9]{1,6}[A-Za-z]?(?=$|[\s,.;/-])|s/?n(?=$|[\s,.;-]))",
            texto,
            re.IGNORECASE,
        )
    )
    return len(texto) >= 8 and tem_rua and tem_numero


def curso_valido(texto: str) -> bool:
    """O curso precisa estar na lista oferecida."""
    return texto in CURSOS


def login_valido(texto: str) -> bool:
    """De 3 a 60 letras sem acento, números, ponto, traço ou sublinhado."""
    return bool(re.fullmatch(r"[A-Za-z0-9._-]{3,60}", texto))


def senha_tem_letra_e_numero(senha: str) -> bool:
    """A senha mistura pelo menos uma letra e um número."""
    return bool(re.search(_LETRA, senha)) and bool(re.search(r"[0-9]", senha))
