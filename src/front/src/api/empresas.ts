// Cliente HTTP para operações de Empresa Parceira na API.
import { requisicao } from './cliente';
import type { Empresa, EmpresaAtualizar, EmpresaCriar } from '../tipos/empresa';

// Obtém a lista completa de empresas parceiras cadastradas.
export async function listarEmpresas(): Promise<Empresa[]> {
  return requisicao<Empresa[]>('/empresas');
}

// Busca os dados detalhados de uma empresa por identificador.
export async function buscarEmpresaPorId(id: number): Promise<Empresa> {
  return requisicao<Empresa>(`/empresas/${id}`);
}

// Cadastra uma nova empresa parceira com dados sanitizados.
export async function criarEmpresa(dados: EmpresaCriar): Promise<Empresa> {
  const payload: EmpresaCriar = {
    nome: dados.nome.trim(),
    email: dados.email.trim(),
    cnpj: dados.cnpj.trim(),
    login: dados.login.trim(),
    senha: dados.senha,
  };
  return requisicao<Empresa>('/empresas', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Atualiza os dados cadastrais permitidos de uma empresa parceira.
export async function atualizarEmpresa(id: number, dados: EmpresaAtualizar): Promise<Empresa> {
  const payload: EmpresaAtualizar = {};
  if (dados.nome !== undefined) payload.nome = dados.nome.trim();
  if (dados.email !== undefined) payload.email = dados.email.trim();
  if (dados.cnpj !== undefined) payload.cnpj = dados.cnpj.trim();
  if (dados.senha !== undefined && dados.senha !== '') {
    payload.senha = dados.senha;
  }

  return requisicao<Empresa>(`/empresas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// Realiza a exclusão lógica da empresa parceira informada.
export async function excluirEmpresa(id: number): Promise<void> {
  await requisicao<null>(`/empresas/${id}`, {
    method: 'DELETE',
  });
}
