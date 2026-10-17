// Testes unitários para utilitários de formatação de CPF e CNPJ.
import { describe, expect, it } from 'vitest';
import { formatarCpf, formatarCnpj } from '../../src/utils/formatacao';

describe('formatacao', () => {
  it('deve formatar CPF com 11 dígitos', () => {
    expect(formatarCpf('12345678909')).toBe('123.456.789-09');
    expect(formatarCpf('123.456.789-09')).toBe('123.456.789-09');
  });

  it('deve manter texto original se CPF não tiver 11 dígitos', () => {
    expect(formatarCpf('12345')).toBe('12345');
    expect(formatarCpf('')).toBe('');
  });

  it('deve formatar CNPJ com 14 dígitos', () => {
    expect(formatarCnpj('00000000000191')).toBe('00.000.000/0001-91');
    expect(formatarCnpj('00.000.000/0001-91')).toBe('00.000.000/0001-91');
  });

  it('deve manter texto original se CNPJ não tiver 14 dígitos', () => {
    expect(formatarCnpj('1234')).toBe('1234');
    expect(formatarCnpj('')).toBe('');
  });
});
