// Cliente HTTP para o login e a identificação do usuário.
import { requisicao } from './cliente';
import type { RespostaLogin } from '../tipos/autenticacao';

// Entra no sistema e devolve o token e o usuário dono dele.
export async function entrar(login: string, senha: string): Promise<RespostaLogin> {
  return requisicao<RespostaLogin>('/autenticacao/entrar', {
    method: 'POST',
    body: JSON.stringify({ login: login.trim(), senha }),
  });
}
