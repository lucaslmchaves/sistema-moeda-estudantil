// @vitest-environment jsdom
// Testes do hook de listagem com exclusão confirmada.
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { useListagem } from '../../src/hooks/useListagem';

interface Item {
  id: number;
  nome: string;
}

const ANA: Item = { id: 1, nome: 'Ana' };
const BIA: Item = { id: 2, nome: 'Bia' };

function montar(carregarFn: () => Promise<Item[]>, excluirFn = vi.fn(), mensagem?: string) {
  const entrada = mensagem ? [{ pathname: '/', state: { mensagemSucesso: mensagem } }] : ['/'];
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={entrada}>{children}</MemoryRouter>
  );
  return renderHook(
    () =>
      useListagem<Item>({
        carregarFn,
        excluirFn,
        obterId: (item) => item.id,
        obterNome: (item) => item.nome,
      }),
    { wrapper },
  );
}

describe('useListagem', () => {
  it('carrega os itens e encerra o estado de carregamento', async () => {
    const { result } = montar(vi.fn().mockResolvedValue([ANA, BIA]));

    expect(result.current.carregando).toBe(true);
    await waitFor(() => expect(result.current.carregando).toBe(false));

    expect(result.current.itens).toEqual([ANA, BIA]);
    expect(result.current.erro).toBeNull();
  });

  it('mostra a mensagem de erro quando o carregamento falha', async () => {
    const { result } = montar(vi.fn().mockRejectedValue(new Error('Erro interno do servidor.')));

    await waitFor(() => expect(result.current.carregando).toBe(false));

    expect(result.current.erro).toBe('Erro interno do servidor.');
    expect(result.current.itens).toEqual([]);
  });

  it('mostra a mensagem de sucesso enviada pela tela anterior', async () => {
    const { result } = montar(
      vi.fn().mockResolvedValue([]),
      vi.fn(),
      'Aluno Ana cadastrado com sucesso!',
    );

    await waitFor(() => expect(result.current.sucesso).toBe('Aluno Ana cadastrado com sucesso!'));
  });

  it('abre e fecha a confirmação de exclusão', async () => {
    const { result } = montar(vi.fn().mockResolvedValue([ANA]));
    await waitFor(() => expect(result.current.carregando).toBe(false));

    act(() => result.current.abrirConfirmacaoExclusao(ANA));
    expect(result.current.itemParaExcluir).toEqual(ANA);

    act(() => result.current.fecharConfirmacaoExclusao());
    expect(result.current.itemParaExcluir).toBeNull();
  });

  it('exclui o item confirmado, avisa o sucesso e recarrega a lista', async () => {
    const carregarFn = vi.fn().mockResolvedValueOnce([ANA, BIA]).mockResolvedValueOnce([BIA]);
    const excluirFn = vi.fn().mockResolvedValue(undefined);
    const { result } = montar(carregarFn, excluirFn);
    await waitFor(() => expect(result.current.carregando).toBe(false));

    act(() => result.current.abrirConfirmacaoExclusao(ANA));
    await act(async () => {
      await result.current.confirmarExclusao();
    });

    expect(excluirFn).toHaveBeenCalledWith(1);
    expect(result.current.sucesso).toBe('Cadastro "Ana" excluído com sucesso.');
    expect(result.current.itens).toEqual([BIA]);
    expect(result.current.itemParaExcluir).toBeNull();
  });

  it('mostra o erro e fecha a confirmação quando a exclusão falha', async () => {
    const excluirFn = vi.fn().mockRejectedValue(new Error('Aluno não encontrado.'));
    const { result } = montar(vi.fn().mockResolvedValue([ANA]), excluirFn);
    await waitFor(() => expect(result.current.carregando).toBe(false));

    act(() => result.current.abrirConfirmacaoExclusao(ANA));
    await act(async () => {
      await result.current.confirmarExclusao();
    });

    expect(result.current.erro).toBe('Aluno não encontrado.');
    expect(result.current.itemParaExcluir).toBeNull();
    expect(result.current.excluindo).toBe(false);
  });
});
