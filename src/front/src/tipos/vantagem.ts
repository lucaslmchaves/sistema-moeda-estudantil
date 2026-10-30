// Tipos da entidade Vantagem e do formulário de cadastro.

export interface Vantagem {
  id_vantagem: number;
  descricao: string;
  foto: string;
  custo: number;
  id_empresa: number;
  nome_empresa: string;
}

// Valores digitados no formulário de vantagem (a foto fica vazia até ser escolhida).
export type VantagemFormulario = {
  descricao: string;
  custo: string;
  foto: File | null;
};
