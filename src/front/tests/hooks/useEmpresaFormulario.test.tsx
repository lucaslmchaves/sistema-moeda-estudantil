// @vitest-environment jsdom
// Testes do hook do formulário de empresa parceira, com a API simulada.
import { act, renderHook, waitFor } from '@testing-library/react';
import type { FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { atualizarEmpresa, buscarEmpresaPorId, criarEmpresa } from '../../src/api/empresas';
import { useEmpresaFormulario } from '../../src/hooks/useEmpresaFormulario';

const navegar = vi.fn();

vi.mock('react-router-dom', () => ({ useNavigate: () => navegar }));
vi.mock('../../src/api/empresas');

const EMPRESA = {
  id_usuario: 9,
  nome: 'Livraria Horizonte',
  email: 'contato@livraria.com',
  cnpj: '11444777000161',
  login: 'livraria.horizonte',
  ativo: true,
};

const novoEvento = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent;

function montar(id?: string) {
  return renderHook(() => useEmpresaFormulario(id));
}

describe('useEmpresaFormulario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(buscarEmpresaPorId).mockResolvedValue(EMPRESA);
    vi.mocked(criarEmpresa).mockResolvedValue(EMPRESA);
    vi.mocked(atualizarEmpresa).mockResolvedValue(EMPRESA);
  });

  it('no cadastro, o formulário abre vazio e sem carregamento', () => {
    const hook = montar();

    expect(hook.result.current.edicao).toBe(false);
    expect(hook.result.current.carregandoDados).toBe(false);
    expect(hook.result.current.valores.nome).toBe('');
  });

  it('na edição, preenche o formulário com a empresa e deixa a senha em branco', async () => {
    const hook = montar('9');

    expect(hook.result.current.carregandoDados).toBe(true);
    await waitFor(() => expect(hook.result.current.carregandoDados).toBe(false));

    expect(hook.result.current.edicao).toBe(true);
    expect(hook.result.current.valores.cnpj).toBe('11444777000161');
    expect(hook.result.current.valores.senha).toBe('');
  });

  it('mostra a mensagem de erro quando o carregamento falha', async () => {
    vi.mocked(buscarEmpresaPorId).mockRejectedValue(new Error('Empresa parceira não encontrada.'));
    const hook = montar('9');

    await waitFor(() => expect(hook.result.current.carregandoDados).toBe(false));

    expect(hook.result.current.erroGeral).toBe('Empresa parceira não encontrada.');
  });

  it('não chama a API e mostra um erro por campo quando o formulário está vazio', async () => {
    const hook = montar();

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(criarEmpresa).not.toHaveBeenCalled();
    expect(Object.keys(hook.result.current.erros)).toEqual(
      expect.arrayContaining(['nome', 'email', 'cnpj', 'login', 'senha']),
    );
  });

  it('cadastra a empresa e volta para a lista com a mensagem de sucesso', async () => {
    const hook = montar();
    act(() => {
      hook.result.current.definirValores({
        nome: 'Livraria Horizonte',
        email: 'contato@livraria.com',
        cnpj: '11.444.777/0001-61',
        login: 'livraria.horizonte',
        senha: 'senha-segura-1',
      });
    });

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(criarEmpresa).toHaveBeenCalledWith({
      nome: 'Livraria Horizonte',
      email: 'contato@livraria.com',
      cnpj: '11.444.777/0001-61',
      login: 'livraria.horizonte',
      senha: 'senha-segura-1',
    });
    expect(navegar).toHaveBeenCalledWith('/empresas', {
      state: { mensagemSucesso: 'Empresa Livraria Horizonte cadastrada com sucesso!' },
    });
  });

  it('na edição, atualiza sem enviar o login e sem senha quando ela está em branco', async () => {
    const hook = montar('9');
    await waitFor(() => expect(hook.result.current.carregandoDados).toBe(false));

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    const [id, dados] = vi.mocked(atualizarEmpresa).mock.calls[0];
    expect(id).toBe(9);
    expect(dados).not.toHaveProperty('login');
    expect(dados).not.toHaveProperty('senha');
    expect(navegar).toHaveBeenCalledWith('/empresas', {
      state: { mensagemSucesso: 'Empresa Livraria Horizonte atualizada com sucesso!' },
    });
  });

  it('mostra o erro da API e não navega quando o cadastro é recusado', async () => {
    vi.mocked(criarEmpresa).mockRejectedValue(new Error('O CNPJ informado já está cadastrado.'));
    const hook = montar();
    act(() => {
      hook.result.current.definirValores({
        nome: 'Loja',
        email: 'loja@teste.com',
        cnpj: '11444777000161',
        login: 'loja',
        senha: 'senha-segura-1',
      });
    });

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(hook.result.current.erroGeral).toBe('O CNPJ informado já está cadastrado.');
    expect(navegar).not.toHaveBeenCalled();
  });
});
