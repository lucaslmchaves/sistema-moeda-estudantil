// @vitest-environment jsdom
// Testes do armazenamento da sessão no navegador.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Sessao } from '../../src/tipos/autenticacao';
import { limparSessao, obterSessao, obterToken, salvarSessao } from '../../src/utils/sessao';

const SESSAO: Sessao = {
  token: 'token-abc',
  usuario: { id_usuario: 3, tipo_usuario: 'ALUNO', nome: 'Ana', login: 'ana' },
};

describe('sessao', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('devolve null quando não há sessão salva', () => {
    expect(obterSessao()).toBeNull();
    expect(obterToken()).toBeNull();
  });

  it('salva e lê a sessão, e devolve o token', () => {
    salvarSessao(SESSAO);

    expect(obterSessao()).toEqual(SESSAO);
    expect(obterToken()).toBe('token-abc');
  });

  it('apaga a sessão ao limpar', () => {
    salvarSessao(SESSAO);

    limparSessao();

    expect(obterSessao()).toBeNull();
  });

  it('ignora conteúdo corrompido ou incompleto', () => {
    localStorage.setItem('moeda-estudantil:sessao', 'isso não é json');
    expect(obterSessao()).toBeNull();

    localStorage.setItem('moeda-estudantil:sessao', JSON.stringify({ token: 'x' }));
    expect(obterSessao()).toBeNull();
  });

  it('não quebra quando o armazenamento do navegador está indisponível', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });

    expect(obterSessao()).toBeNull();
    expect(() => salvarSessao(SESSAO)).not.toThrow();
    expect(() => limparSessao()).not.toThrow();
  });
});
