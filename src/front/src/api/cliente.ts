// Cliente base para requisições HTTP fetch com tratamento tolerante de respostas.
import { extrairMensagemErro } from '../utils/erros';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Executa chamadas HTTP padronizadas convertendo erros e respostas vazias.
export async function requisicao<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
  const url = `${API_URL}${caminho}`;
  const cabecalhos: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opcoes?.headers as Record<string, string>),
  };

  let resposta: Response;
  try {
    resposta = await fetch(url, {
      ...opcoes,
      headers: cabecalhos,
    });
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se a API está no ar.');
    }
    throw err;
  }

  if (!resposta.ok) {
    let corpoErro: unknown;
    try {
      corpoErro = await resposta.json();
    } catch {
      corpoErro = await resposta.text();
    }
    const mensagem = extrairMensagemErro(corpoErro);
    const erro = new Error(mensagem);
    (erro as unknown as { status: number }).status = resposta.status;
    throw erro;
  }

  if (resposta.status === 204) {
    return null as T;
  }

  return (await resposta.json()) as T;
}
