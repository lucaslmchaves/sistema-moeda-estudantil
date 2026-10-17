// Testes unitários para o cliente HTTP base com simulação global de fetch.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { requisicao } from '../../src/api/cliente';

describe('requisicao', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve retornar dados JSON em caso de resposta com sucesso 200', async () => {
    const dadosMock = { id_usuario: 1, nome: 'Aluno Teste' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => dadosMock,
      }),
    );

    const resultado = await requisicao<typeof dadosMock>('/alunos/1');
    expect(resultado).toEqual(dadosMock);
  });

  it('deve retornar null em caso de resposta 204 sem conteúdo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      }),
    );

    const resultado = await requisicao<null>('/alunos/1', { method: 'DELETE' });
    expect(resultado).toBeNull();
  });

  it('deve lançar erro formatado com detalhe quando resposta não for ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ detalhe: 'CPF informado já está cadastrado.' }),
      }),
    );

    await expect(requisicao('/alunos', { method: 'POST' })).rejects.toThrow(
      'CPF informado já está cadastrado.',
    );
  });

  it('deve converter falha de rede TypeError em mensagem amigável em português', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(requisicao('/alunos')).rejects.toThrow(
      'Não foi possível conectar ao servidor. Verifique se a API está no ar.',
    );
  });
});
