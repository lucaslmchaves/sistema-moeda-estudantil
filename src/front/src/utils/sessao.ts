// Guarda a sessão do usuário no navegador, tolerando armazenamento indisponível.
import type { Sessao } from '../tipos/autenticacao';

const CHAVE_SESSAO = 'moeda-estudantil:sessao';
export const EVENTO_SESSAO_EXPIRADA = 'moeda-estudantil:sessao-expirada';

// Lê a sessão salva; devolve null se não houver ou se o conteúdo estiver corrompido.
export function obterSessao(): Sessao | null {
  try {
    const texto = localStorage.getItem(CHAVE_SESSAO);
    if (!texto) return null;
    const sessao = JSON.parse(texto) as Sessao;
    return sessao?.token && sessao?.usuario ? sessao : null;
  } catch {
    return null;
  }
}

// Salva a sessão depois do login.
export function salvarSessao(sessao: Sessao): void {
  try {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  } catch {
    // Sem armazenamento, a sessão vale só até recarregar a página.
  }
}

// Apaga a sessão ao sair ou quando o token deixa de valer.
export function limparSessao(): void {
  try {
    localStorage.removeItem(CHAVE_SESSAO);
  } catch {
    // Nada a limpar quando o armazenamento não está disponível.
  }
}

// Devolve só o token da sessão, para enviar nas requisições.
export function obterToken(): string | null {
  return obterSessao()?.token ?? null;
}
