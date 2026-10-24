// Testes dos clientes HTTP de vantagens, moedas e login: caminho, método e corpo enviados.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { entrar } from '../../src/api/autenticacao';
import { requisicao } from '../../src/api/cliente';
import { consultarExtrato, enviarMoedas, resgatarVantagem } from '../../src/api/moedas';
import {
  criarVantagem,
  excluirVantagem,
  listarMinhasVantagens,
  listarVantagens,
} from '../../src/api/vantagens';

vi.mock('../../src/api/cliente');

describe('clientes da API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requisicao).mockResolvedValue(null);
  });

  it('entrar envia o login sem espaços e a senha como está', async () => {
    await entrar('  ana.silva ', ' senha com espaço ');

    expect(requisicao).toHaveBeenCalledWith('/autenticacao/entrar', {
      method: 'POST',
      body: JSON.stringify({ login: 'ana.silva', senha: ' senha com espaço ' }),
    });
  });

  it('lista o catálogo e as vantagens da empresa', async () => {
    await listarVantagens();
    await listarMinhasVantagens();

    expect(requisicao).toHaveBeenNthCalledWith(1, '/vantagens');
    expect(requisicao).toHaveBeenNthCalledWith(2, '/vantagens/minhas');
  });

  it('cria a vantagem como formulário com descrição, custo e foto', async () => {
    const foto = new File(['x'], 'foto.png', { type: 'image/png' });

    await criarVantagem('  Almoço  ', 60, foto);

    const [caminho, opcoes] = vi.mocked(requisicao).mock.calls[0];
    const corpo = opcoes?.body as FormData;
    expect(caminho).toBe('/vantagens');
    expect(opcoes?.method).toBe('POST');
    expect(corpo.get('descricao')).toBe('Almoço');
    expect(corpo.get('custo')).toBe('60');
    expect((corpo.get('foto') as File).name).toBe('foto.png');
  });

  it('exclui a vantagem pelo identificador', async () => {
    await excluirVantagem(7);

    expect(requisicao).toHaveBeenCalledWith('/vantagens/7', { method: 'DELETE' });
  });

  it('envia moedas com a mensagem sem espaços nas pontas', async () => {
    await enviarMoedas({ id_aluno: 3, valor: 50, mensagem: '  Parabéns  ' });

    expect(requisicao).toHaveBeenCalledWith('/moedas/enviar', {
      method: 'POST',
      body: JSON.stringify({ id_aluno: 3, valor: 50, mensagem: 'Parabéns' }),
    });
  });

  it('resgata a vantagem e consulta o extrato', async () => {
    await resgatarVantagem(4);
    await consultarExtrato();

    expect(requisicao).toHaveBeenNthCalledWith(1, '/moedas/resgatar', {
      method: 'POST',
      body: JSON.stringify({ id_vantagem: 4 }),
    });
    expect(requisicao).toHaveBeenNthCalledWith(2, '/moedas/extrato');
  });
});
