// Testes da leitura das movimentações do extrato.
import { describe, expect, it } from 'vitest';
import type { TransacaoExtrato } from '../../src/tipos/moedas';
import {
  agruparPorDia,
  lerMovimentacao,
  rotuloDoDia,
  totaisDoExtrato,
} from '../../src/utils/extrato';

const transacao = (parcial: Partial<TransacaoExtrato>): TransacaoExtrato => ({
  id_transacao: 1,
  tipo: 'ENVIO_MOEDAS',
  data_hora: '2026-11-20T15:00:00Z',
  valor: 10,
  descricao: '',
  ...parcial,
});

describe('lerMovimentacao', () => {
  it('separa o professor e o motivo de um recebimento', () => {
    expect(lerMovimentacao(transacao({ descricao: 'De Ana Souza: Ajudou na monitoria.' }))).toEqual(
      {
        tipo: 'recebido',
        titulo: 'Ana Souza',
        detalhe: 'Ajudou na monitoria.',
      },
    );
  });

  it('separa o aluno de um envio do professor', () => {
    const lida = lerMovimentacao(
      transacao({ valor: -5, descricao: 'Para Beatriz: Ótima prova: nota 10.' }),
    );
    expect(lida.tipo).toBe('enviado');
    expect(lida.titulo).toBe('Beatriz');
    expect(lida.detalhe).toBe('Ótima prova: nota 10.');
  });

  it('lê a vantagem e o código do cupom de um resgate', () => {
    const lida = lerMovimentacao(
      transacao({
        tipo: 'RESGATE_VANTAGEM',
        valor: -40,
        descricao: 'Resgate de "Café (grande)" (código AB12CD)',
      }),
    );
    expect(lida).toEqual({
      tipo: 'resgate',
      titulo: 'Café (grande)',
      detalhe: 'Resgate de vantagem',
      codigo: 'AB12CD',
    });
  });

  it('mostra o texto original quando o formato é desconhecido', () => {
    expect(lerMovimentacao(transacao({ descricao: 'Crédito do semestre' }))).toEqual({
      tipo: 'outro',
      titulo: 'Crédito do semestre',
      detalhe: '',
    });
  });
});

describe('totaisDoExtrato', () => {
  it('soma entradas e saídas separadamente', () => {
    expect(
      totaisDoExtrato([
        transacao({ valor: 30 }),
        transacao({ valor: -12 }),
        transacao({ valor: 5 }),
      ]),
    ).toEqual({
      entradas: 35,
      saidas: 12,
    });
  });
});

describe('rotuloDoDia e agruparPorDia', () => {
  const agora = new Date(2026, 10, 20, 18, 0);

  it('nomeia hoje, ontem e as outras datas', () => {
    expect(rotuloDoDia(new Date(2026, 10, 20, 9).toISOString(), agora)).toBe('Hoje');
    expect(rotuloDoDia(new Date(2026, 10, 19, 9).toISOString(), agora)).toBe('Ontem');
    expect(rotuloDoDia(new Date(2026, 9, 3, 9).toISOString(), agora)).toBe('3 de outubro');
  });

  it('agrupa as movimentações seguidas do mesmo dia', () => {
    const grupos = agruparPorDia(
      [
        transacao({ id_transacao: 1, data_hora: new Date(2026, 10, 20, 10).toISOString() }),
        transacao({ id_transacao: 2, data_hora: new Date(2026, 10, 20, 8).toISOString() }),
        transacao({ id_transacao: 3, data_hora: new Date(2026, 10, 18, 8).toISOString() }),
      ],
      agora,
    );
    expect(grupos.map((g) => [g.dia, g.itens.length])).toEqual([
      ['Hoje', 2],
      ['18 de novembro', 1],
    ]);
  });
});
