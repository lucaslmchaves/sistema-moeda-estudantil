// @vitest-environment jsdom
// Testes do hook do catálogo de vantagens, com a API simulada.
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { consultarExtrato, resgatarVantagem } from '../../../src/api/moedas';
import { listarVantagens } from '../../../src/api/vantagens';
import { useCatalogo } from '../../../src/hooks/moedas/useCatalogo';

vi.mock('../../../src/api/moedas');
vi.mock('../../../src/api/vantagens');

const ALMOCO = {
  id_vantagem: 5,
  descricao: 'Almoço grátis',
  foto: '/uploads/a.png',
  custo: 60,
  id_empresa: 2,
  nome_empresa: 'Cantina',
};

async function montar() {
  const hook = renderHook(() => useCatalogo());
  await waitFor(() => expect(hook.result.current.carregando).toBe(false));
  await waitFor(() => expect(hook.result.current.saldo).not.toBeNull());
  return hook;
}

describe('useCatalogo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listarVantagens).mockResolvedValue([ALMOCO]);
    vi.mocked(consultarExtrato).mockResolvedValue({ saldo: 100, transacoes: [] });
    vi.mocked(resgatarVantagem).mockResolvedValue({
      id_transacao: 9,
      id_vantagem: 5,
      valor: 60,
      codigo: 'ABCD2345',
    });
  });

  it('carrega o catálogo e o saldo do aluno', async () => {
    const hook = await montar();

    expect(hook.result.current.vantagens).toEqual([ALMOCO]);
    expect(hook.result.current.saldo).toBe(100);
  });

  it('mostra o erro quando o catálogo não carrega', async () => {
    vi.mocked(listarVantagens).mockRejectedValue(new Error('Erro interno do servidor.'));
    const hook = renderHook(() => useCatalogo());

    await waitFor(() => expect(hook.result.current.carregando).toBe(false));

    expect(hook.result.current.erro).toBe('Erro interno do servidor.');
  });

  it('pede confirmação antes de resgatar e permite desistir', async () => {
    const hook = await montar();

    act(() => hook.result.current.abrirResgate(ALMOCO));
    expect(hook.result.current.vantagemParaResgatar).toEqual(ALMOCO);

    act(() => hook.result.current.fecharResgate());
    expect(hook.result.current.vantagemParaResgatar).toBeNull();
    expect(resgatarVantagem).not.toHaveBeenCalled();
  });

  it('resgata, mostra o código do cupom e atualiza o saldo', async () => {
    const hook = await montar();
    act(() => hook.result.current.abrirResgate(ALMOCO));
    vi.mocked(consultarExtrato).mockResolvedValue({ saldo: 40, transacoes: [] });

    await act(async () => {
      await hook.result.current.confirmarResgate();
    });

    expect(resgatarVantagem).toHaveBeenCalledWith(5);
    expect(hook.result.current.sucesso).toBe(
      'Resgate realizado! Código do cupom: ABCD2345. Enviamos o cupom para o seu e-mail.',
    );
    expect(hook.result.current.saldo).toBe(40);
    expect(hook.result.current.vantagemParaResgatar).toBeNull();
  });

  it('mostra o erro da API quando o resgate é recusado', async () => {
    vi.mocked(resgatarVantagem).mockRejectedValue(
      new Error('Saldo insuficiente: você tem 10 moedas e a vantagem custa 60.'),
    );
    const hook = await montar();
    act(() => hook.result.current.abrirResgate(ALMOCO));

    await act(async () => {
      await hook.result.current.confirmarResgate();
    });

    expect(hook.result.current.erro).toContain('Saldo insuficiente');
    expect(hook.result.current.sucesso).toBeNull();
    expect(hook.result.current.vantagemParaResgatar).toBeNull();
  });
});
