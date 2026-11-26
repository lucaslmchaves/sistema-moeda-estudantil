// Testes dos títulos das abas e do aviso de servidor demorando.
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  EVENTO_SERVIDOR_LENTO,
  LIMITE_DE_ESPERA_MS,
  acompanharDemora,
} from '../../src/utils/servidorLento';
import { tituloDaRota } from '../../src/utils/titulos';

describe('tituloDaRota', () => {
  it('dá um título a cada página e avisa quando o endereço não existe', () => {
    expect(tituloDaRota('/')).toBe('Moeda Estudantil');
    expect(tituloDaRota('/entrar/professor')).toBe('Entrar como professor · Moeda Estudantil');
    expect(tituloDaRota('/alunos/7/editar')).toBe('Meu cadastro · Moeda Estudantil');
    expect(tituloDaRota('/nada-aqui')).toBe('Página não encontrada · Moeda Estudantil');
  });
});

describe('acompanharDemora', () => {
  const avisos: boolean[] = [];
  const ouvir = (e: Event) => avisos.push((e as CustomEvent<boolean>).detail);

  beforeEach(() => {
    vi.useFakeTimers();
    avisos.length = 0;
    window.addEventListener(EVENTO_SERVIDOR_LENTO, ouvir);
  });
  afterEach(() => {
    window.removeEventListener(EVENTO_SERVIDOR_LENTO, ouvir);
    vi.useRealTimers();
  });

  it('não avisa quando a resposta chega rápido', () => {
    const encerrar = acompanharDemora();
    vi.advanceTimersByTime(LIMITE_DE_ESPERA_MS - 1);
    encerrar();
    vi.advanceTimersByTime(LIMITE_DE_ESPERA_MS);
    expect(avisos).toEqual([]);
  });

  it('avisa quando demora e desliga só depois da última chamada lenta', () => {
    const primeira = acompanharDemora();
    const segunda = acompanharDemora();
    vi.advanceTimersByTime(LIMITE_DE_ESPERA_MS);
    primeira();
    expect(avisos[avisos.length - 1]).toBe(true);
    segunda();
    expect(avisos[avisos.length - 1]).toBe(false);
  });
});
