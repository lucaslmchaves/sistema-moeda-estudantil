// Tipos de dados e payloads da entidade Aluno.

export interface Aluno {
  id_usuario: number;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  id_instituicao: number;
  login: string;
  ativo: boolean;
}

export interface AlunoResumo {
  id_usuario: number;
  nome: string;
  curso: string;
}

export interface AlunoCriar {
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  id_instituicao: number;
  login: string;
  senha: string;
}

export interface AlunoAtualizar {
  nome?: string;
  email?: string;
  cpf?: string;
  rg?: string;
  endereco?: string;
  curso?: string;
  id_instituicao?: number;
  senha?: string;
}

// Valores digitados no formulário de aluno (a instituição fica vazia até ser escolhida).
export type AlunoFormulario = {
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  id_instituicao: number | '';
  login: string;
  senha: string;
};
