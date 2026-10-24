// @vitest-environment jsdom
// Testes do hook do formulário de vantagem, com a API simulada.
import { act, renderHook } from '@testing-library/react';
import type { FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { criarVantagem } from '../../../src/api/vantagens';
import { useVantagemFormulario } from '../../../src/hooks/cadastros/useVantagemFormulario';

const navegar = vi.fn();

vi.mock('react-router-dom', () => ({ useNavigate: () => navegar }));
vi.mock('../../../src/api/vantagens');

const novoEvento = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent;
const FOTO = new File(['x'], 'foto.png', { type: 'image/png' });

describe('useVantagemFormulario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(criarVantagem).mockResolvedValue({
      id_vantagem: 1,
      descricao: 'Almoço',
      foto: '/uploads/a.png',
      custo: 60,
      id_empresa: 2,
      nome_empresa: 'Cantina',
    });
  });

  it('mostra um erro por campo e não chama a API quando o formulário está vazio', async () => {
    const hook = renderHook(() => useVantagemFormulario());

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(criarVantagem).not.toHaveBeenCalled();
    expect(Object.keys(hook.result.current.erros)).toEqual(
      expect.arrayContaining(['descricao', 'custo', 'foto']),
    );
  });

  it('cadastra a vantagem com a foto e volta para a lista com a mensagem de sucesso', async () => {
    const hook = renderHook(() => useVantagemFormulario());
    act(() => {
      hook.result.current.alterarCampo('descricao', ' Almoço ');
      hook.result.current.alterarCampo('custo', '60');
      hook.result.current.alterarCampo('foto', FOTO);
    });

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(criarVantagem).toHaveBeenCalledWith(' Almoço ', 60, FOTO);
    expect(navegar).toHaveBeenCalledWith('/minhas-vantagens', {
      state: { mensagemSucesso: 'Vantagem "Almoço" cadastrada com sucesso!' },
    });
  });

  it('mostra o erro da API e não navega quando o cadastro é recusado', async () => {
    vi.mocked(criarVantagem).mockRejectedValue(new Error('A foto deve ter no máximo 2 MB.'));
    const hook = renderHook(() => useVantagemFormulario());
    act(() => {
      hook.result.current.alterarCampo('descricao', 'Almoço');
      hook.result.current.alterarCampo('custo', '60');
      hook.result.current.alterarCampo('foto', FOTO);
    });

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(hook.result.current.erroGeral).toBe('A foto deve ter no máximo 2 MB.');
    expect(navegar).not.toHaveBeenCalled();
  });
});
