// @vitest-environment jsdom
// Testes do hook que recebe a mensagem de sucesso enviada pela tela anterior.
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { useMensagemNavegacao } from '../../../src/hooks/geral/useMensagemNavegacao';

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
