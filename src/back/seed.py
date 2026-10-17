"""Script idempotente para carga inicial de dados no banco."""

from sqlalchemy import select

from model.conta import Conta
from model.enums import TipoUsuario
from model.instituicao_ensino import InstituicaoEnsino
from model.professor import Professor
from repository.database import SessionLocal
from model.seguranca import hash_senha


def seed() -> None:
    """Executa a inserção idempotente das instituições e professores iniciais."""
    sessao = SessionLocal()
    try:
        instituicoes_dados = [
            "PUC Minas",
            "Instituto Tecnológico do Futuro",
        ]
        instituicoes_map: dict[str, InstituicaoEnsino] = {}

        for nome_inst in instituicoes_dados:
            inst = sessao.execute(
                select(InstituicaoEnsino).where(InstituicaoEnsino.nome == nome_inst)
            ).scalar_one_or_none()
            if not inst:
                inst = InstituicaoEnsino(nome=nome_inst)
                sessao.add(inst)
                sessao.flush()
                print(f"[CARGA_INICIAL] Instituição criada: {nome_inst}")
            instituicoes_map[nome_inst] = inst

        professores_dados = [
            {
                "login": "prof.carlos",
                "senha": "senha1234",
                "nome": "Carlos Eduardo Silva",
                "cpf": "11144477735",
                "departamento": "Ciência da Computação",
                "instituicao": "PUC Minas",
            },
            {
                "login": "prof.ana",
                "senha": "senha1234",
                "nome": "Ana Paula Souza",
                "cpf": "22255588846",
                "departamento": "Engenharia de Software",
                "instituicao": "PUC Minas",
            },
            {
                "login": "prof.marcos",
                "senha": "senha1234",
                "nome": "Marcos Vinicius Pereira",
                "cpf": "33366699957",
                "departamento": "Sistemas de Informação",
                "instituicao": "Instituto Tecnológico do Futuro",
            },
        ]

        for p_data in professores_dados:
            prof_existente = sessao.execute(
                select(Professor).where(Professor.login == p_data["login"])
            ).scalar_one_or_none()

            if not prof_existente:
                inst = instituicoes_map[p_data["instituicao"]]
                novo_prof = Professor(
                    login=p_data["login"],
                    senha_hash=hash_senha(p_data["senha"]),
                    tipo_usuario=TipoUsuario.PROFESSOR,
                    ativo=True,
                    nome=p_data["nome"],
                    cpf=p_data["cpf"],
                    departamento=p_data["departamento"],
                    id_instituicao=inst.id_instituicao,
                )
                sessao.add(novo_prof)
                sessao.flush()

                conta_prof = Conta(id_usuario=novo_prof.id_usuario, saldo=1000)
                sessao.add(conta_prof)
                print(f"[CARGA_INICIAL] Professor cadastrado: {p_data['nome']} ({p_data['login']})")
            else:
                if prof_existente.cpf != p_data["cpf"]:
                    prof_existente.cpf = p_data["cpf"]

        sessao.commit()
        print("[CARGA_INICIAL] Carga de dados inicial finalizada com sucesso.")
    except Exception as erro:
        sessao.rollback()
        print(f"[CARGA_INICIAL] Erro durante a execução da carga: {erro}")
        raise
    finally:
        sessao.close()


if __name__ == "__main__":
    seed()
