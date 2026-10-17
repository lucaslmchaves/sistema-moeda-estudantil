// @vitest-environment jsdom
// Testes do hook genérico de formulário.
import { act, renderHook } from '@testing-library/react';
import type { FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useFormulario } from '../../src/hooks/useFormulario';
import type { ErrosValidacao } from '../../src/utils/validacao';

type Valores = { nome: string; email: string };

const VALORES_INICIAIS: Valores = { nome: '', email: '' };
const validar = (valores: Valores): ErrosValidacao =>
  valores.nome ? {} : { nome: 'O campo nome é obrigatório.' };
const novoEvento = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent;

function montar() {
  return renderHook(() => useFormulario<Valores>({ valoresIniciais: VALORES_INICIAIS, validar }));
}

describe('useFormulario', () => {
  it('mostra o erro do campo e não envia quando a validação falha', async () => {
    const { result } = montar();
    const aoSalvar = vi.fn();
    let enviou = true;

    await act(async () => {
      enviou = await result.current.submeter(novoEvento(), aoSalvar);
    });

    expect(enviou).toBe(false);
    expect(aoSalvar).not.toHaveBeenCalled();
    expect(result.current.erros.nome).toBe('O campo nome é obrigatório.');
  });

  it('apaga o erro do campo assim que ele é alterado', async () => {
    const { result } = montar();
    await act(async () => {
      await result.current.submeter(novoEvento(), vi.fn());
    });

    act(() => result.current.alterarCampo('nome', 'Ana'));

    expect(result.current.erros.nome).toBeUndefined();
    expect(result.current.valores.nome).toBe('Ana');
  });

  it('envia os valores e devolve true quando a validação passa', async () => {
    const { result } = montar();
    const aoSalvar = vi.fn().mockResolvedValue(undefined);
    act(() => result.current.alterarCampo('nome', 'Ana'));
    let enviou = false;

    await act(async () => {
      enviou = await result.current.submeter(novoEvento(), aoSalvar);
    });

    expect(enviou).toBe(true);
    expect(aoSalvar).toHaveBeenCalledWith({ nome: 'Ana', email: '' });
    expect(result.current.salvando).toBe(false);
  });

  it('transforma a falha do envio em mensagem de erro geral', async () => {
    const { result } = montar();
    act(() => result.current.alterarCampo('nome', 'Ana'));
    const aoSalvar = vi.fn().mockRejectedValue(new Error('O CPF informado já está cadastrado.'));
    let enviou = true;

    await act(async () => {
      enviou = await result.current.submeter(novoEvento(), aoSalvar);
    });

    expect(enviou).toBe(false);
    expect(result.current.erroGeral).toBe('O CPF informado já está cadastrado.');
    expect(result.current.salvando).toBe(false);
  });

  it('impede o envio nativo do formulário', async () => {
    const { result } = montar();
    const evento = novoEvento();

    await act(async () => {
      await result.current.submeter(evento, vi.fn());
    });

    expect(evento.preventDefault).toHaveBeenCalled();
  });

  it('mescla vários valores de uma vez', () => {
    const { result } = montar();

    act(() => result.current.definirValores({ nome: 'Ana', email: 'ana@teste.com' }));

    expect(result.current.valores).toEqual({ nome: 'Ana', email: 'ana@teste.com' });
  });
});
