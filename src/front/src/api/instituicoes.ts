// Cliente HTTP para listagem de Instituições de Ensino.
import { requisicao } from './cliente';
import type { Instituicao } from '../tipos/instituicao';

// Obtém a lista de instituições de ensino conveniadas.
export async function listarInstituicoes(): Promise<Instituicao[]> {
  return requisicao<Instituicao[]>('/instituicoes');
}
