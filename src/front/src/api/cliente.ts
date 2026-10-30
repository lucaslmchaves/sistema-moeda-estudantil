// Cliente base para requisições HTTP fetch com tratamento tolerante de respostas.
import { extrairMensagemErro } from '../utils/erros';
import { EVENTO_SESSAO_EXPIRADA, limparSessao, obterToken } from '../utils/sessao';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Monta os cabeçalhos: JSON quando o corpo é texto e o token da sessão, se houver.
function montarCabecalhos(opcoes?: RequestInit): Record<string, string> {
  const cabecalhos: Record<string, string> = {};
  if (typeof opcoes?.body === 'string') cabecalhos['Content-Type'] = 'application/json';
  const token = obterToken();
  if (token) cabecalhos.Authorization = `Bearer ${token}`;
  return { ...cabecalhos, ...(opcoes?.headers as Record<string, string>) };
}

// Executa chamadas HTTP padronizadas convertendo erros e respostas vazias.
export async function requisicao<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
  const url = `${API_URL}${caminho}`;
  const tinhaSessao = obterToken() !== null;

  let resposta: Response;
  try {
    resposta = await fetch(url, {
      ...opcoes,
      headers: montarCabecalhos(opcoes),
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
    if (resposta.status === 401 && tinhaSessao) {
      limparSessao();
      window.dispatchEvent(new Event(EVENTO_SESSAO_EXPIRADA));
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

// Monta o endereço completo de um arquivo servido pela API, como a foto de uma vantagem.
export function urlDaApi(caminho: string): string {
  return `${API_URL}${caminho}`;
}
