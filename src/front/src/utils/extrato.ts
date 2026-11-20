// Leitura das movimentações do extrato: separa quem enviou, o motivo e o código do cupom.
import type { TransacaoExtrato } from '../tipos/moedas';

export type TipoMovimentacao = 'recebido' | 'enviado' | 'resgate' | 'outro';

export interface MovimentacaoLida {
  tipo: TipoMovimentacao;
  titulo: string;
  detalhe: string;
  codigo?: string;
}

const ENVIO = /^(De|Para) (.+?): ([\s\S]*)$/;
const RESGATE = /^Resgate de "([\s\S]+)" \(código ([^)]+)\)$/;

// Transforma a descrição da API em título e detalhe; se o formato mudar, mostra o texto original.
export function lerMovimentacao(transacao: TransacaoExtrato): MovimentacaoLida {
  const { descricao } = transacao;
  const resgate = RESGATE.exec(descricao);
  if (transacao.tipo === 'RESGATE_VANTAGEM' && resgate) {
    return {
      tipo: 'resgate',
      titulo: resgate[1],
      detalhe: 'Resgate de vantagem',
      codigo: resgate[2],
    };
  }
  const envio = ENVIO.exec(descricao);
  if (transacao.tipo === 'ENVIO_MOEDAS' && envio) {
    return {
      tipo: envio[1] === 'De' ? 'recebido' : 'enviado',
      titulo: envio[2],
      detalhe: envio[3],
    };
  }
  return { tipo: 'outro', titulo: descricao, detalhe: '' };
}

// Soma o que entrou e o que saiu da conta.
export function totaisDoExtrato(transacoes: TransacaoExtrato[]) {
  return transacoes.reduce(
    (acc, t) => {
      if (t.valor >= 0) acc.entradas += t.valor;
      else acc.saidas += -t.valor;
      return acc;
    },
    { entradas: 0, saidas: 0 },
  );
}

const DIA = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' });
const DIA_ANO = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const HORA = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

function chaveDoDia(data: Date): string {
  return `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`;
}

// Nomeia o dia da movimentação: hoje, ontem ou a data por extenso.
export function rotuloDoDia(iso: string, agora: Date = new Date()): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  const ontem = new Date(agora);
  ontem.setDate(agora.getDate() - 1);
  if (chaveDoDia(data) === chaveDoDia(agora)) return 'Hoje';
  if (chaveDoDia(data) === chaveDoDia(ontem)) return 'Ontem';
  return data.getFullYear() === agora.getFullYear() ? DIA.format(data) : DIA_ANO.format(data);
}

// Hora e minuto da movimentação.
export function horaDe(iso: string): string {
  const data = new Date(iso);
  return Number.isNaN(data.getTime()) ? '' : HORA.format(data);
}

// Agrupa as movimentações por dia, mantendo a ordem recebida.
export function agruparPorDia(transacoes: TransacaoExtrato[], agora: Date = new Date()) {
  const grupos: { dia: string; itens: TransacaoExtrato[] }[] = [];
  for (const t of transacoes) {
    const dia = rotuloDoDia(t.data_hora, agora);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.dia === dia) ultimo.itens.push(t);
    else grupos.push({ dia, itens: [t] });
  }
  return grupos;
}
