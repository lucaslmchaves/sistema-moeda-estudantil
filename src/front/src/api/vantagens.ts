// Cliente HTTP para operações de Vantagem na API.
import { requisicao } from './cliente';
import type { Vantagem } from '../tipos/vantagem';

// Obtém o catálogo com as vantagens de todas as empresas parceiras.
export async function listarVantagens(): Promise<Vantagem[]> {
  return requisicao<Vantagem[]>('/vantagens');
}

// Obtém as vantagens cadastradas pela empresa logada.
export async function listarMinhasVantagens(): Promise<Vantagem[]> {
  return requisicao<Vantagem[]>('/vantagens/minhas');
}

// Cadastra uma vantagem enviando a descrição, o custo e a foto como formulário.
export async function criarVantagem(
  descricao: string,
  custo: number,
  foto: File,
): Promise<Vantagem> {
  const formulario = new FormData();
  formulario.set('descricao', descricao.trim());
  formulario.set('custo', String(custo));
  formulario.set('foto', foto);
  return requisicao<Vantagem>('/vantagens', { method: 'POST', body: formulario });
}

// Exclui a vantagem da empresa logada, sem apagar os resgates já feitos.
export async function excluirVantagem(id: number): Promise<void> {
  await requisicao<null>(`/vantagens/${id}`, { method: 'DELETE' });
}
