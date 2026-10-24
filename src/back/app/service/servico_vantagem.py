"""Serviço com as regras de negócio e os casos de uso da entidade Vantagem."""

from app.model.vantagem import Vantagem
from app.repository.interfaces import IArmazenamentoFoto, IRepositorioVantagem
from app.service.excecoes import DadoInvalido, NaoEncontrado
from app.service.regras_cadastro import exigir_texto

DESCRICAO_TAMANHO_MAXIMO = 255
CUSTO_MAXIMO = 1_000_000
FOTO_TAMANHO_MAXIMO = 2 * 1024 * 1024


def detectar_extensao_foto(conteudo: bytes) -> str | None:
    """Reconhece JPEG, PNG e WebP pelos primeiros bytes e devolve a extensão do arquivo."""
    if conteudo.startswith(b"\xff\xd8\xff"):
        return "jpg"
    if conteudo.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if conteudo[:4] == b"RIFF" and conteudo[8:12] == b"WEBP":
        return "webp"
    return None


class ServicoVantagem:
    """Aplica as regras de cadastro, consulta e exclusão das vantagens das empresas."""

    def __init__(self, repo_vantagem: IRepositorioVantagem, armazenamento: IArmazenamentoFoto):
        """Recebe o repositório e o armazenamento de fotos por interface."""
        self.repo_vantagem = repo_vantagem
        self.armazenamento = armazenamento

    def cadastrar_vantagem(self, id_empresa: int, dados: dict, foto: bytes) -> Vantagem:
        """Valida os dados e a foto, guarda a foto e cadastra a vantagem da empresa."""
        descricao = self._validar_descricao(dados.get("descricao"))
        custo = self._validar_custo(dados.get("custo"))
        extensao = self._validar_foto(foto)

        vantagem = Vantagem(
            id_empresa=id_empresa,
            descricao=descricao,
            custo=custo,
            foto=self.armazenamento.salvar(foto, extensao),
        )
        return self.repo_vantagem.salvar(vantagem)

    def listar_vantagens(self) -> list[Vantagem]:
        """Devolve o catálogo de vantagens ativas, de todas as empresas."""
        return self.repo_vantagem.listar()

    def listar_vantagens_da_empresa(self, id_empresa: int) -> list[Vantagem]:
        """Devolve as vantagens ativas da empresa."""
        return self.repo_vantagem.listar_por_empresa(id_empresa)

    def excluir_vantagem(self, id_empresa: int, id_vantagem: int) -> bool:
        """Inativa a vantagem da empresa sem apagar os resgates já feitos."""
        vantagem = self.repo_vantagem.buscar_por_id(id_vantagem)
        if vantagem is None or vantagem.id_empresa != id_empresa:
            raise NaoEncontrado("Vantagem não encontrada.")
        return self.repo_vantagem.marcar_excluida(vantagem)

    def _validar_descricao(self, descricao: object) -> str:
        """Exige uma descrição preenchida e dentro do tamanho permitido."""
        texto = exigir_texto("descricao", descricao)
        if len(texto) > DESCRICAO_TAMANHO_MAXIMO:
            raise DadoInvalido(
                f"A descrição deve ter no máximo {DESCRICAO_TAMANHO_MAXIMO} caracteres."
            )
        return texto

    def _validar_custo(self, custo: object) -> int:
        """Exige um custo inteiro entre 1 e o limite do sistema."""
        if isinstance(custo, bool) or not isinstance(custo, int):
            raise DadoInvalido("O custo deve ser um número inteiro de moedas.")
        if not 1 <= custo <= CUSTO_MAXIMO:
            raise DadoInvalido(f"O custo deve estar entre 1 e {CUSTO_MAXIMO} moedas.")
        return custo

    def _validar_foto(self, foto: bytes) -> str:
        """Confere o tamanho e o formato da foto e devolve a extensão para guardá-la."""
        if not foto:
            raise DadoInvalido("A foto do produto é obrigatória.")
        if len(foto) > FOTO_TAMANHO_MAXIMO:
            raise DadoInvalido("A foto deve ter no máximo 2 MB.")
        extensao = detectar_extensao_foto(foto)
        if extensao is None:
            raise DadoInvalido("A foto deve estar no formato JPEG, PNG ou WebP.")
        return extensao
