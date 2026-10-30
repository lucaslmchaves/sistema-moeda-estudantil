// @vitest-environment jsdom
// Testes do hook de envio de moedas, com a API simulada.
import { act, renderHook, waitFor } from '@testing-library/react';
import type { FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listarAlunos } from '../../../src/api/alunos';
import { consultarExtrato, enviarMoedas } from '../../../src/api/moedas';
import { useEnviarMoedas } from '../../../src/hooks/moedas/useEnviarMoedas';

vi.mock('../../../src/api/alunos');
vi.mock('../../../src/api/moedas');

const ALUNOS = [
  { id_usuario: 3, nome: 'Ana Souza', curso: 'ES' },
  { id_usuario: 4, nome: 'Bia Lima', curso: 'SI' },
];

const novoEvento = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent;

async function montar() {
  const hook = renderHook(() => useEnviarMoedas());
  await waitFor(() => expect(hook.result.current.carregandoAlunos).toBe(false));
  await waitFor(() => expect(hook.result.current.saldo).not.toBeNull());
  return hook;
}

describe('useEnviarMoedas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listarAlunos).mockResolvedValue(ALUNOS);
    vi.mocked(consultarExtrato).mockResolvedValue({ saldo: 1000, transacoes: [] });
    vi.mocked(enviarMoedas).mockResolvedValue({
      id_transacao: 1,
      id_aluno: 3,
      valor: 50,
      mensagem: 'Parabéns',
    });
  });

  it('carrega os alunos e o saldo do professor', async () => {
    const hook = await montar();

    expect(hook.result.current.alunos).toEqual(ALUNOS);
    expect(hook.result.current.saldo).toBe(1000);
  });

  it('mostra um erro por campo e não envia quando o formulário está vazio', async () => {
    const hook = await montar();

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(enviarMoedas).not.toHaveBeenCalled();
    expect(Object.keys(hook.result.current.erros)).toEqual(
      expect.arrayContaining(['id_aluno', 'valor', 'mensagem']),
    );
  });

  it('envia as moedas, avisa o resultado, limpa o formulário e atualiza o saldo', async () => {
    const hook = await montar();
    act(() =>
      hook.result.current.definirValores({ id_aluno: 3, valor: '50', mensagem: 'Parabéns' }),
    );
    vi.mocked(consultarExtrato).mockResolvedValue({ saldo: 950, transacoes: [] });

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(enviarMoedas).toHaveBeenCalledWith({ id_aluno: 3, valor: 50, mensagem: 'Parabéns' });
    expect(hook.result.current.sucesso).toBe(
      '50 moedas enviadas para Ana Souza. O aluno foi avisado por e-mail.',
    );
    expect(hook.result.current.valores.valor).toBe('');
    expect(hook.result.current.valores.mensagem).toBe('');
    expect(hook.result.current.saldo).toBe(950);
  });

  it('mostra o erro da API e mantém o formulário quando o envio é recusado', async () => {
    vi.mocked(enviarMoedas).mockRejectedValue(
      new Error('Saldo insuficiente: você tem 1000 moedas e tentou enviar 2000.'),
    );
    const hook = await montar();
    act(() =>
      hook.result.current.definirValores({ id_aluno: 3, valor: '2000', mensagem: 'Parabéns' }),
    );

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(hook.result.current.erroGeral).toContain('Saldo insuficiente');
    expect(hook.result.current.sucesso).toBeNull();
    expect(hook.result.current.valores.valor).toBe('2000');
  });
});
