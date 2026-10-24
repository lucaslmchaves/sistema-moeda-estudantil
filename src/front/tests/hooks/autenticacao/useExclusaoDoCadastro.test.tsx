// @vitest-environment jsdom
// Testes do hook da exclusão do próprio cadastro, com a navegação simulada.
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AutenticacaoContexto } from '../../../src/hooks/autenticacao/useAutenticacao';
import { useExclusaoDoCadastro } from '../../../src/hooks/autenticacao/useExclusaoDoCadastro';

const navegar = vi.fn();

vi.mock('react-router-dom', () => ({ useNavigate: () => navegar }));

describe('useExclusaoDoCadastro', () => {
  const sair = vi.fn();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AutenticacaoContexto.Provider
      value={{ usuario: null, aviso: null, entrar: vi.fn(), sair, limparAviso: vi.fn() }}
    >
      {children}
    </AutenticacaoContexto.Provider>
  );

  beforeEach(() => vi.clearAllMocks());

  it('abre e fecha a confirmação sem excluir', () => {
    const excluir = vi.fn();
    const hook = renderHook(() => useExclusaoDoCadastro(excluir), { wrapper });

    act(() => hook.result.current.abrir());
    expect(hook.result.current.confirmando).toBe(true);
    act(() => hook.result.current.fechar());

    expect(hook.result.current.confirmando).toBe(false);
    expect(excluir).not.toHaveBeenCalled();
  });

  it('exclui, encerra a sessão e leva ao login com um aviso', async () => {
    const excluir = vi.fn().mockResolvedValue(undefined);
    const hook = renderHook(() => useExclusaoDoCadastro(excluir), { wrapper });

    await act(async () => {
      await hook.result.current.confirmar();
    });

    expect(excluir).toHaveBeenCalled();
    expect(sair).toHaveBeenCalledWith('Seu cadastro foi excluído.');
    expect(navegar).toHaveBeenCalledWith('/entrar');
  });

  it('mostra o erro e mantém a sessão quando a exclusão falha', async () => {
    const excluir = vi.fn().mockRejectedValue(new Error('Aluno não encontrado.'));
    const hook = renderHook(() => useExclusaoDoCadastro(excluir), { wrapper });
    act(() => hook.result.current.abrir());

    await act(async () => {
      await hook.result.current.confirmar();
    });

    expect(hook.result.current.erro).toBe('Aluno não encontrado.');
    expect(hook.result.current.confirmando).toBe(false);
    expect(sair).not.toHaveBeenCalled();
    expect(navegar).not.toHaveBeenCalled();
  });
});
