// Tipos de dados e payloads da entidade Empresa Parceira.

export interface Empresa {
  id_usuario: number;
  nome: string;
  email: string;
  cnpj: string;
  login: string;
  ativo: boolean;
}

export interface EmpresaCriar {
  nome: string;
  email: string;
  cnpj: string;
  login: string;
  senha: string;
}

export interface EmpresaAtualizar {
  nome?: string;
  email?: string;
  cnpj?: string;
  senha?: string;
}

// Valores digitados no formulário de empresa parceira.
export type EmpresaFormulario = {
  nome: string;
  email: string;
  cnpj: string;
  login: string;
  senha: string;
};
