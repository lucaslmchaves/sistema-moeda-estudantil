// Validação síncrona, em português, dos formulários do sistema.

import { cnpjValido, cpfValido } from './documentos';
import {
  CURSOS,
  emailValido,
  enderecoValido,
  loginValido,
  nomeCompletoValido,
  nomeDeEmpresaValido,
  rgValido,
} from './regrasDeCampos';

export type ErrosValidacao = Record<string, string>;

export interface DadosValidacaoAluno {
  nome?: string;
  email?: string;
  cpf?: string;
  rg?: string;
  endereco?: string;
  curso?: string;
  id_instituicao?: number | string;
  login?: string;
  senha?: string;
  confirmarSenha?: string;
}

export interface DadosValidacaoEmpresa {
  nome?: string;
  email?: string;
  cnpj?: string;
  login?: string;
  senha?: string;
  confirmarSenha?: string;
}

const SENHA_MINIMA = 8;
const SENHA_MAXIMA = 72; // limite do bcrypt usado no back-end

// Marca o campo como obrigatório quando o texto está vazio ou só tem espaços.
function exigirTexto(erros: ErrosValidacao, campo: string, rotulo: string, valor?: string): void {
  if (!valor || !valor.trim()) {
    erros[campo] = `O campo ${rotulo} é obrigatório.`;
  }
}

// Exige o campo preenchido e, preenchido, no formato esperado.
function exigirFormato(
  erros: ErrosValidacao,
  campo: string,
  rotulo: string,
  valor: string | undefined,
  valido: (texto: string) => boolean,
  mensagem: string,
): void {
  exigirTexto(erros, campo, rotulo, valor);
  if (!erros[campo] && !valido((valor ?? '').trim())) erros[campo] = mensagem;
}

// Login novo: sem espaços nem acentos, para não dar erro na hora de entrar.
function validarLoginNovo(erros: ErrosValidacao, login?: string): void {
  exigirFormato(
    erros,
    'login',
    'login',
    login,
    loginValido,
    'Use de 3 a 60 letras sem acento, números, ponto, traço ou sublinhado.',
  );
}

// Exige um e-mail preenchido e com formato válido.
function validarEmail(erros: ErrosValidacao, email?: string): void {
  if (!email || !email.trim()) {
    erros.email = 'O campo e-mail é obrigatório.';
  } else if (!emailValido(email.trim())) {
    erros.email = 'Por favor, informe um endereço de e-mail válido.';
  }
}

// Confere a senha sem alterá-la; na edição ela só é validada se for informada.
function validarSenha(erros: ErrosValidacao, senha: string | undefined, edicao: boolean): void {
  if (edicao && !senha) return;
  const sujeito = edicao ? 'A nova senha' : 'A senha';
  if (!senha) {
    erros.senha = 'O campo senha é obrigatório.';
  } else if (!senha.trim()) {
    erros.senha = `${sujeito} não pode conter apenas espaços.`;
  } else if (senha.length < SENHA_MINIMA) {
    erros.senha = `${sujeito} deve conter no mínimo ${SENHA_MINIMA} caracteres.`;
  } else if (senha.length > SENHA_MAXIMA) {
    erros.senha = `${sujeito} deve conter no máximo ${SENHA_MAXIMA} caracteres.`;
  } else if (!/\p{L}/u.test(senha) || !/\d/.test(senha)) {
    erros.senha = `${sujeito} deve ter pelo menos uma letra e um número.`;
  }
}

// Quando a tela pede a confirmação, as duas senhas precisam ser iguais.
function validarConfirmacao(erros: ErrosValidacao, senha?: string, confirmacao?: string): void {
  if (confirmacao === undefined || !senha) return;
  if (!confirmacao) {
    erros.confirmarSenha = 'Confirme a senha.';
  } else if (confirmacao !== senha) {
    erros.confirmarSenha = 'As senhas não são iguais.';
  }
}

// Valida os dados do formulário de aluno e devolve um erro por campo inválido.
export function validarAluno(dados: DadosValidacaoAluno, edicao = false): ErrosValidacao {
  const erros: ErrosValidacao = {};
  exigirFormato(
    erros,
    'nome',
    'nome',
    dados.nome,
    nomeCompletoValido,
    'Informe o nome e o sobrenome, só com letras.',
  );
  validarEmail(erros, dados.email);
  exigirFormato(erros, 'cpf', 'CPF', dados.cpf, cpfValido, 'O CPF informado não é válido.');
  exigirFormato(erros, 'rg', 'RG', dados.rg, rgValido, 'Informe um RG válido. Ex.: MG-12.345.678.');
  exigirFormato(
    erros,
    'endereco',
    'endereço',
    dados.endereco,
    enderecoValido,
    'Informe a rua e o número. Ex.: Rua da Bahia, 1200 (ou s/n).',
  );
  exigirFormato(
    erros,
    'curso',
    'curso',
    dados.curso,
    (curso) => CURSOS.includes(curso),
    'Escolha um curso da lista.',
  );
  if (!dados.id_instituicao || String(dados.id_instituicao) === '') {
    erros.id_instituicao = 'Selecione uma instituição de ensino.';
  }
  if (!edicao) validarLoginNovo(erros, dados.login);
  validarSenha(erros, dados.senha, edicao);
  validarConfirmacao(erros, dados.senha, dados.confirmarSenha);
  return erros;
}

// Valida os dados do formulário de empresa e devolve um erro por campo inválido.
export function validarEmpresa(dados: DadosValidacaoEmpresa, edicao = false): ErrosValidacao {
  const erros: ErrosValidacao = {};
  exigirFormato(
    erros,
    'nome',
    'nome',
    dados.nome,
    nomeDeEmpresaValido,
    'Informe o nome da empresa.',
  );
  validarEmail(erros, dados.email);
  exigirFormato(erros, 'cnpj', 'CNPJ', dados.cnpj, cnpjValido, 'O CNPJ informado não é válido.');
  if (!edicao) validarLoginNovo(erros, dados.login);
  validarSenha(erros, dados.senha, edicao);
  validarConfirmacao(erros, dados.senha, dados.confirmarSenha);
  return erros;
}

export interface DadosValidacaoLogin {
  login?: string;
  senha?: string;
}

export interface DadosValidacaoEnvioMoedas {
  id_aluno?: number | string;
  valor?: string;
  mensagem?: string;
}

export interface DadosValidacaoVantagem {
  descricao?: string;
  custo?: string;
  foto?: Pick<File, 'type' | 'size'> | null;
}

export const MENSAGEM_TAMANHO_MAXIMO = 500;
const DESCRICAO_TAMANHO_MAXIMO = 255;
export const CUSTO_MAXIMO = 1_000_000;
export const FOTO_TAMANHO_MAXIMO = 2 * 1024 * 1024;
const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];

// Confere um número inteiro positivo digitado como texto, dentro do limite.
function validarInteiroPositivo(
  erros: ErrosValidacao,
  campo: string,
  rotulo: string,
  valor: string | undefined,
  maximo: number,
): void {
  const texto = (valor ?? '').trim();
  if (!texto) {
    erros[campo] = `O campo ${rotulo} é obrigatório.`;
  } else if (!/^\d+$/.test(texto) || Number(texto) < 1) {
    erros[campo] = `O ${rotulo} deve ser um número inteiro maior que zero.`;
  } else if (Number(texto) > maximo) {
    erros[campo] = `O ${rotulo} deve ser no máximo ${maximo}.`;
  }
}

// Valida o formulário de login: os dois campos são obrigatórios.
export function validarLogin(dados: DadosValidacaoLogin): ErrosValidacao {
  const erros: ErrosValidacao = {};
  exigirTexto(erros, 'login', 'login', dados.login);
  if (!dados.senha) erros.senha = 'O campo senha é obrigatório.';
  return erros;
}

// Valida o envio de moedas: aluno escolhido, valor inteiro positivo e motivo preenchido.
export function validarEnvioMoedas(dados: DadosValidacaoEnvioMoedas): ErrosValidacao {
  const erros: ErrosValidacao = {};
  if (!dados.id_aluno || String(dados.id_aluno) === '') {
    erros.id_aluno = 'Selecione o aluno que vai receber as moedas.';
  }
  validarInteiroPositivo(erros, 'valor', 'valor', dados.valor, Number.MAX_SAFE_INTEGER);
  exigirTexto(erros, 'mensagem', 'mensagem', dados.mensagem);
  if (!erros.mensagem && (dados.mensagem ?? '').trim().length > MENSAGEM_TAMANHO_MAXIMO) {
    erros.mensagem = `A mensagem deve ter no máximo ${MENSAGEM_TAMANHO_MAXIMO} caracteres.`;
  }
  return erros;
}

// Valida o cadastro de vantagem: descrição, custo inteiro e foto no formato e tamanho aceitos.
export function validarVantagem(dados: DadosValidacaoVantagem): ErrosValidacao {
  const erros: ErrosValidacao = {};
  exigirTexto(erros, 'descricao', 'descrição', dados.descricao);
  if (!erros.descricao && (dados.descricao ?? '').trim().length > DESCRICAO_TAMANHO_MAXIMO) {
    erros.descricao = `A descrição deve ter no máximo ${DESCRICAO_TAMANHO_MAXIMO} caracteres.`;
  }
  validarInteiroPositivo(erros, 'custo', 'custo', dados.custo, CUSTO_MAXIMO);
  if (!dados.foto) {
    erros.foto = 'Escolha a foto do produto.';
  } else if (!TIPOS_FOTO.includes(dados.foto.type)) {
    erros.foto = 'A foto deve estar no formato JPEG, PNG ou WebP.';
  } else if (dados.foto.size > FOTO_TAMANHO_MAXIMO) {
    erros.foto = 'A foto deve ter no máximo 2 MB.';
  }
  return erros;
}
