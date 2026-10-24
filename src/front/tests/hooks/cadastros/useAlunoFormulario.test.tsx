// @vitest-environment jsdom
// Testes do hook do formulário de aluno, com a API simulada.
import { act, renderHook, waitFor } from '@testing-library/react';
import type { FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { atualizarAluno, buscarAlunoPorId, criarAluno } from '../../../src/api/alunos';
import { listarInstituicoes } from '../../../src/api/instituicoes';
import { useAlunoFormulario } from '../../../src/hooks/cadastros/useAlunoFormulario';

const navegar = vi.fn();

vi.mock('react-router-dom', () => ({ useNavigate: () => navegar }));
vi.mock('../../../src/api/alunos');
vi.mock('../../../src/api/instituicoes');

const INSTITUICOES = [
  { id_instituicao: 1, nome: 'PUC Minas' },
  { id_instituicao: 2, nome: 'Instituto Tecnológico' },
];

const ALUNO = {
  id_usuario: 7,
  nome: 'Ana Souza',
  email: 'ana@teste.com',
  cpf: '52998224725',
  rg: 'MG-1',
  endereco: 'Rua 1',
  curso: 'ES',
  id_instituicao: 2,
  login: 'ana.souza',
  ativo: true,
};

const novoEvento = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent;

function preencher(hook: ReturnType<typeof montar>) {
  act(() => {
    hook.result.current.definirValores({
      nome: 'Ana Souza',
      email: 'ana@teste.com',
      cpf: '529.982.247-25',
      rg: 'MG-1',
      endereco: 'Rua 1',
      curso: 'ES',
      login: 'ana.souza',
      senha: 'senha-segura-1',
    });
  });
}

function montar(id?: string) {
  return renderHook(() => useAlunoFormulario(id));
}

describe('useAlunoFormulario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listarInstituicoes).mockResolvedValue(INSTITUICOES);
    vi.mocked(buscarAlunoPorId).mockResolvedValue(ALUNO);
    vi.mocked(criarAluno).mockResolvedValue(ALUNO);
    vi.mocked(atualizarAluno).mockResolvedValue(ALUNO);
  });

  it('no cadastro, carrega as instituições e escolhe a primeira', async () => {
    const hook = montar();

    await waitFor(() => expect(hook.result.current.carregandoDados).toBe(false));

    expect(hook.result.current.edicao).toBe(false);
    expect(hook.result.current.instituicoes).toEqual(INSTITUICOES);
    expect(hook.result.current.valores.id_instituicao).toBe(1);
  });

  it('na edição, preenche o formulário com o aluno e deixa a senha em branco', async () => {
    const hook = montar('7');

    await waitFor(() => expect(hook.result.current.carregandoDados).toBe(false));

    expect(hook.result.current.edicao).toBe(true);
    expect(hook.result.current.valores.nome).toBe('Ana Souza');
    expect(hook.result.current.valores.id_instituicao).toBe(2);
    expect(hook.result.current.valores.senha).toBe('');
  });

  it('mostra a mensagem de erro quando o carregamento falha', async () => {
    vi.mocked(listarInstituicoes).mockRejectedValue(new Error('Erro interno do servidor.'));
    const hook = montar();

    await waitFor(() => expect(hook.result.current.carregandoDados).toBe(false));

    expect(hook.result.current.erroGeral).toBe('Erro interno do servidor.');
  });

  it('não chama a API e mostra um erro por campo quando o formulário está vazio', async () => {
    const hook = montar();
    await waitFor(() => expect(hook.result.current.carregandoDados).toBe(false));

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(criarAluno).not.toHaveBeenCalled();
    expect(Object.keys(hook.result.current.erros)).toEqual(
      expect.arrayContaining(['nome', 'email', 'cpf', 'rg', 'endereco', 'curso', 'login', 'senha']),
    );
  });

  it('cadastra o aluno e vai para o login com a mensagem de sucesso', async () => {
    const hook = montar();
    await waitFor(() => expect(hook.result.current.carregandoDados).toBe(false));
    preencher(hook);

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(criarAluno).toHaveBeenCalledWith({
      nome: 'Ana Souza',
      email: 'ana@teste.com',
      cpf: '529.982.247-25',
      rg: 'MG-1',
      endereco: 'Rua 1',
      curso: 'ES',
      id_instituicao: 1,
      login: 'ana.souza',
      senha: 'senha-segura-1',
    });
    expect(navegar).toHaveBeenCalledWith('/entrar', {
      state: {
        mensagemSucesso:
          'Aluno Ana Souza cadastrado com sucesso! Entre com o seu login e a sua senha.',
      },
    });
  });

  it('na edição, atualiza sem enviar o login e sem senha quando ela está em branco', async () => {
    const hook = montar('7');
    await waitFor(() => expect(hook.result.current.carregandoDados).toBe(false));

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    const [id, dados] = vi.mocked(atualizarAluno).mock.calls[0];
    expect(id).toBe(7);
    expect(dados).not.toHaveProperty('login');
    expect(dados).not.toHaveProperty('senha');
    expect(navegar).toHaveBeenCalledWith('/', {
      state: { mensagemSucesso: 'Aluno Ana Souza atualizado com sucesso!' },
    });
  });

  it('mostra o erro da API e não navega quando o cadastro é recusado', async () => {
    vi.mocked(criarAluno).mockRejectedValue(new Error('O CPF informado já está cadastrado.'));
    const hook = montar();
    await waitFor(() => expect(hook.result.current.carregandoDados).toBe(false));
    preencher(hook);

    await act(async () => {
      await hook.result.current.enviar(novoEvento());
    });

    expect(hook.result.current.erroGeral).toBe('O CPF informado já está cadastrado.');
    expect(navegar).not.toHaveBeenCalled();
  });
});
