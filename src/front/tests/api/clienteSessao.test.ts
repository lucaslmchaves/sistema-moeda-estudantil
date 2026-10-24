// @vitest-environment jsdom
// Testes do cliente HTTP com sessão: token, corpo em formulário e token recusado.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { requisicao, urlDaApi } from '../../src/api/cliente';
import { EVENTO_SESSAO_EXPIRADA, obterSessao, salvarSessao } from '../../src/utils/sessao';

const SESSAO = {
  token: 'token-abc',
  usuario: { id_usuario: 1, tipo_usuario: 'ALUNO' as const, nome: 'Ana', login: 'ana' },
};

function simularResposta(corpo: object, status = 200) {
  const fetchSimulado = vi.fn().mockResolvedValue({
    ok: status < 400,
    status,
    json: async () => corpo,
  });
  vi.stubGlobal('fetch', fetchSimulado);
  return fetchSimulado;
}

describe('requisicao com sessão', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('envia o token da sessão no cabeçalho Authorization', async () => {
    salvarSessao(SESSAO);
    const fetchSimulado = simularResposta({ ok: true });

    await requisicao('/moedas/extrato');

    const cabecalhos = fetchSimulado.mock.calls[0][1].headers;
    expect(cabecalhos.Authorization).toBe('Bearer token-abc');
  });

  it('não envia Authorization quando não há sessão', async () => {
    const fetchSimulado = simularResposta({ ok: true });

    await requisicao('/instituicoes');

    expect(fetchSimulado.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
  });

  it('declara JSON quando o corpo é texto e não declara quando é formulário', async () => {
    const fetchSimulado = simularResposta({ ok: true });

    await requisicao('/alunos', { method: 'POST', body: '{}' });
    await requisicao('/vantagens', { method: 'POST', body: new FormData() });

    expect(fetchSimulado.mock.calls[0][1].headers['Content-Type']).toBe('application/json');
    expect(fetchSimulado.mock.calls[1][1].headers).not.toHaveProperty('Content-Type');
  });

  it('apaga a sessão e avisa a aplicação quando a API recusa o token', async () => {
    salvarSessao(SESSAO);
    simularResposta({ detalhe: 'Sessão inválida ou expirada. Entre novamente.' }, 401);
    const aoExpirar = vi.fn();
    window.addEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);

    await expect(requisicao('/moedas/extrato')).rejects.toThrow('Sessão inválida ou expirada');

    window.removeEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
    expect(obterSessao()).toBeNull();
    expect(aoExpirar).toHaveBeenCalledTimes(1);
  });

  it('não dispara o aviso de sessão expirada quando o login falha sem sessão anterior', async () => {
    simularResposta({ detalhe: 'Login ou senha inválidos.' }, 401);
    const aoExpirar = vi.fn();
    window.addEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);

    await expect(requisicao('/autenticacao/entrar', { method: 'POST' })).rejects.toThrow(
      'Login ou senha inválidos.',
    );

    window.removeEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
    expect(aoExpirar).not.toHaveBeenCalled();
  });
});

describe('urlDaApi', () => {
  it('junta o endereço da API ao caminho do arquivo', () => {
    expect(urlDaApi('/uploads/foto.png')).toMatch(/\/uploads\/foto\.png$/);
  });
});
