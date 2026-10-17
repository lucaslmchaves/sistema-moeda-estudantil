// Cliente HTTP para operações de Aluno na API.
import { requisicao } from './cliente';
import type { Aluno, AlunoAtualizar, AlunoCriar } from '../tipos/aluno';

// Obtém a lista completa de alunos cadastrados.
export async function listarAlunos(): Promise<Aluno[]> {
  return requisicao<Aluno[]>('/alunos');
}

// Busca os dados detalhados de um aluno por identificador.
export async function buscarAlunoPorId(id: number): Promise<Aluno> {
  return requisicao<Aluno>(`/alunos/${id}`);
}

// Cadastra um novo aluno com dados sanitizados.
export async function criarAluno(dados: AlunoCriar): Promise<Aluno> {
  const payload: AlunoCriar = {
    nome: dados.nome.trim(),
    email: dados.email.trim(),
    cpf: dados.cpf.trim(),
    rg: dados.rg.trim(),
    endereco: dados.endereco.trim(),
    curso: dados.curso.trim(),
    id_instituicao: dados.id_instituicao,
    login: dados.login.trim(),
    senha: dados.senha,
  };
  return requisicao<Aluno>('/alunos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Atualiza os dados cadastrais permitidos de um aluno.
export async function atualizarAluno(id: number, dados: AlunoAtualizar): Promise<Aluno> {
  const payload: AlunoAtualizar = {};
  if (dados.nome !== undefined) payload.nome = dados.nome.trim();
  if (dados.email !== undefined) payload.email = dados.email.trim();
  if (dados.cpf !== undefined) payload.cpf = dados.cpf.trim();
  if (dados.rg !== undefined) payload.rg = dados.rg.trim();
  if (dados.endereco !== undefined) payload.endereco = dados.endereco.trim();
  if (dados.curso !== undefined) payload.curso = dados.curso.trim();
  if (dados.id_instituicao !== undefined) payload.id_instituicao = dados.id_instituicao;
  if (dados.senha !== undefined && dados.senha !== '') {
    payload.senha = dados.senha;
  }

  return requisicao<Aluno>(`/alunos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// Realiza a exclusão lógica do aluno informado.
export async function excluirAluno(id: number): Promise<void> {
  await requisicao<null>(`/alunos/${id}`, {
    method: 'DELETE',
  });
}
