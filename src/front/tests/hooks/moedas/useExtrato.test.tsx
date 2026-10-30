// @vitest-environment jsdom
// Testes do hook do extrato, com a API simulada.
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { consultarExtrato } from '../../../src/api/moedas';
import { useExtrato } from '../../../src/hooks/moedas/useExtrato';

vi.mock('../../../src/api/moedas');

describe('useExtrato', () => {
  beforeEach(() => vi.clearAllMocks());

  it('carrega o saldo e as movimentações', async () => {
    vi.mocked(consultarExtrato).mockResolvedValue({ saldo: 80, transacoes: [] });

    const hook = renderHook(() => useExtrato());
    await waitFor(() => expect(hook.result.current.carregando).toBe(false));

    expect(hook.result.current.extrato).toEqual({ saldo: 80, transacoes: [] });
    expect(hook.result.current.erro).toBeNull();
  });

  it('mostra a mensagem de erro quando o extrato não carrega', async () => {
    vi.mocked(consultarExtrato).mockRejectedValue(new Error('Erro interno do servidor.'));

    const hook = renderHook(() => useExtrato());
    await waitFor(() => expect(hook.result.current.carregando).toBe(false));

    expect(hook.result.current.extrato).toBeNull();
    expect(hook.result.current.erro).toBe('Erro interno do servidor.');
  });

  it('recarrega o extrato sob demanda', async () => {
    vi.mocked(consultarExtrato).mockResolvedValue({ saldo: 80, transacoes: [] });
    const hook = renderHook(() => useExtrato());
    await waitFor(() => expect(hook.result.current.extrato?.saldo).toBe(80));
    vi.mocked(consultarExtrato).mockResolvedValue({ saldo: 20, transacoes: [] });

    await act(async () => {
      await hook.result.current.recarregar();
    });

    expect(hook.result.current.extrato?.saldo).toBe(20);
  });
});
