// Validação síncrona, em português, dos formulários de aluno e de empresa parceira.

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
}

export interface DadosValidacaoEmpresa {
  nome?: string;
  email?: string;
  cnpj?: string;
  login?: string;
  senha?: string;
}

const REGEX_EMAIL = /^[\w.-]+@[\w.-]+\.\w+$/;
const SENHA_MINIMA = 8;
const SENHA_MAXIMA = 72; // limite do bcrypt usado no back-end

// Marca o campo como obrigatório quando o texto está vazio ou só tem espaços.
function exigirTexto(erros: ErrosValidacao, campo: string, rotulo: string, valor?: string): void {
  if (!valor || !valor.trim()) {
    erros[campo] = `O campo ${rotulo} é obrigatório.`;
  }
}

// Exige um e-mail preenchido e com formato válido.
function validarEmail(erros: ErrosValidacao, email?: string): void {
  if (!email || !email.trim()) {
    erros.email = 'O campo e-mail é obrigatório.';
  } else if (!REGEX_EMAIL.test(email.trim())) {
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
  }
}

// Valida os dados do formulário de aluno e devolve um erro por campo inválido.
export function validarAluno(dados: DadosValidacaoAluno, edicao = false): ErrosValidacao {
  const erros: ErrosValidacao = {};
  exigirTexto(erros, 'nome', 'nome', dados.nome);
  validarEmail(erros, dados.email);
  exigirTexto(erros, 'cpf', 'CPF', dados.cpf);
  exigirTexto(erros, 'rg', 'RG', dados.rg);
  exigirTexto(erros, 'endereco', 'endereço', dados.endereco);
  exigirTexto(erros, 'curso', 'curso', dados.curso);
  if (!dados.id_instituicao || String(dados.id_instituicao) === '') {
    erros.id_instituicao = 'Selecione uma instituição de ensino.';
  }
  if (!edicao) exigirTexto(erros, 'login', 'login', dados.login);
  validarSenha(erros, dados.senha, edicao);
  return erros;
}

// Valida os dados do formulário de empresa e devolve um erro por campo inválido.
export function validarEmpresa(dados: DadosValidacaoEmpresa, edicao = false): ErrosValidacao {
  const erros: ErrosValidacao = {};
  exigirTexto(erros, 'nome', 'nome', dados.nome);
  validarEmail(erros, dados.email);
  exigirTexto(erros, 'cnpj', 'CNPJ', dados.cnpj);
  if (!edicao) exigirTexto(erros, 'login', 'login', dados.login);
  validarSenha(erros, dados.senha, edicao);
  return erros;
}
