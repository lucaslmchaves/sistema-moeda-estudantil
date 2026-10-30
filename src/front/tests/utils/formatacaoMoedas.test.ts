// Testes da formatação de moedas e de data e hora.
import { describe, expect, it } from 'vitest';
import { formatarDataHora, formatarMoedas } from '../../src/utils/formatacao';

describe('formatarMoedas', () => {
  it('usa o singular para uma moeda e o plural para as demais', () => {
    expect(formatarMoedas(1)).toBe('1 moeda');
    expect(formatarMoedas(0)).toBe('0 moedas');
    expect(formatarMoedas(50)).toBe('50 moedas');
  });

  it('separa os milhares com ponto', () => {
    expect(formatarMoedas(1000)).toBe('1.000 moedas');
    expect(formatarMoedas(1250000)).toBe('1.250.000 moedas');
  });
});

describe('formatarDataHora', () => {
  it('escreve a data no padrão brasileiro, com hora e minutos', () => {
    expect(formatarDataHora('2026-10-17T15:30:00')).toMatch(/^17\/10\/(26|2026),? 15:30$/);
  });

  it('devolve o texto original quando a data é inválida', () => {
    expect(formatarDataHora('ontem')).toBe('ontem');
  });
});
