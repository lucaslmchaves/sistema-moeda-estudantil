// @vitest-environment jsdom
// Testes dos hooks do extrato, da exclusão do cadastro e da mensagem de navegação.
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { consultarExtrato } from '../../src/api/moedas';
import { AutenticacaoContexto } from '../../src/hooks/useAutenticacao';
import { useExclusaoDoCadastro } from '../../src/hooks/useExclusaoDoCadastro';
import { useExtrato } from '../../src/hooks/useExtrato';
import { useMensagemNavegacao } from '../../src/hooks/useMensagemNavegacao';

const navegar = vi.fn();

vi.mock('react-router-dom', async (importarOriginal) => ({
  ...(await importarOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navegar,
}));
vi.mock('../../src/api/moedas');

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

describe('useMensagemNavegacao', () => {
  it('devolve a mensagem enviada pela tela anterior e permite dispensá-la', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[{ pathname: '/', state: { mensagemSucesso: 'Tudo certo!' } }]}>
        {children}
      </MemoryRouter>
    );

    const hook = renderHook(() => useMensagemNavegacao(), { wrapper });
    await waitFor(() => expect(hook.result.current.mensagem).toBe('Tudo certo!'));

    act(() => hook.result.current.setMensagem(null));
    expect(hook.result.current.mensagem).toBeNull();
  });

  it('não mostra nada quando não há mensagem', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter>{children}</MemoryRouter>
    );

    const hook = renderHook(() => useMensagemNavegacao(), { wrapper });

    expect(hook.result.current.mensagem).toBeNull();
  });
});
