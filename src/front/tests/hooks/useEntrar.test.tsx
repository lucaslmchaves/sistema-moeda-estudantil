// @vitest-environment jsdom
// Testes do hook do formulário de login, com a autenticação simulada.
import { act, renderHook } from '@testing-library/react';
import type { FormEvent, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEntrar } from '../../src/hooks/useEntrar';
import { AutenticacaoContexto } from '../../src/hooks/useAutenticacao';

const navegar = vi.fn();
let estadoDaRota: { origem?: string } | null = null;
const entrar = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => navegar,
  useLocation: () => ({ state: estadoDaRota }),
}));

const novoEvento = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent;

function montar() {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AutenticacaoContexto.Provider value={{ usuario: null, entrar, sair: vi.fn() }}>
      {children}
    </AutenticacaoContexto.Provider>
  );
  return renderHook(() => useEntrar(), { wrapper });
}

describe('useEntrar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    estadoDaRota = null;
    entrar.mockResolvedValue({ id_usuario: 1, tipo_usuario: 'ALUNO', nome: 'Ana', login: 'ana' });
  });

  it('não chama a autenticação e mostra um erro por campo quando o formulário está vazio', async () => {
    const hook = montar();

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(entrar).not.toHaveBeenCalled();
    expect(hook.result.current.erros).toEqual({
      login: 'O campo login é obrigatório.',
      senha: 'O campo senha é obrigatório.',
    });
  });

  it('autentica e vai para o início quando não há tela de origem', async () => {
    const hook = montar();
    act(() => hook.result.current.definirValores({ login: 'ana', senha: 'senha-segura-1' }));

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(entrar).toHaveBeenCalledWith('ana', 'senha-segura-1');
    expect(navegar).toHaveBeenCalledWith('/', { replace: true });
  });

  it('volta para a tela que o usuário queria abrir antes do login', async () => {
    estadoDaRota = { origem: '/extrato' };
    const hook = montar();
    act(() => hook.result.current.definirValores({ login: 'ana', senha: 'senha-segura-1' }));

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(navegar).toHaveBeenCalledWith('/extrato', { replace: true });
  });

  it('mostra o erro da API e não navega quando o login é recusado', async () => {
    entrar.mockRejectedValue(new Error('Login ou senha inválidos.'));
    const hook = montar();
    act(() => hook.result.current.definirValores({ login: 'ana', senha: 'errada' }));

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(hook.result.current.erroGeral).toBe('Login ou senha inválidos.');
    expect(navegar).not.toHaveBeenCalled();
  });
});
