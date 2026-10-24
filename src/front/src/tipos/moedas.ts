// Tipos do envio de moedas, do resgate de vantagens e do extrato.

export type TipoTransacao = 'ENVIO_MOEDAS' | 'RESGATE_VANTAGEM';

export interface EnvioMoedasCriar {
  id_aluno: number;
  valor: number;
  mensagem: string;
}

export interface EnvioMoedasResposta {
  id_transacao: number;
  id_aluno: number;
  valor: number;
  mensagem: string;
}

export interface ResgateResposta {
  id_transacao: number;
  id_vantagem: number;
  valor: number;
  codigo: string;
}

export interface TransacaoExtrato {
  id_transacao: number;
  tipo: TipoTransacao;
  data_hora: string;
  valor: number;
  descricao: string;
}

export interface Extrato {
  saldo: number;
  transacoes: TransacaoExtrato[];
}

// Valores digitados no formulário de envio de moedas.
export type EnvioMoedasFormulario = {
  id_aluno: number | '';
  valor: string;
  mensagem: string;
};
