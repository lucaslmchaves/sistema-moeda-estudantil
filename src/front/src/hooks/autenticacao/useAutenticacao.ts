// Contexto e hook de autenticação: quem está logado e como entrar e sair.
import { createContext, useContext } from 'react';
import type { UsuarioLogado } from '../../tipos/autenticacao';

// Recebe o usuário antes de a sessão ser salva e levanta um erro para recusar o login.
export type ConferirUsuario = (usuario: UsuarioLogado) => void;

export interface ContextoAutenticacao {
  usuario: UsuarioLogado | null;
  aviso: string | null;
  entrar: (login: string, senha: string, conferir?: ConferirUsuario) => Promise<UsuarioLogado>;
  sair: (aviso?: string) => void;
  limparAviso: () => void;
}

export const AutenticacaoContexto = createContext<ContextoAutenticacao | null>(null);

// Devolve o usuário logado e as ações de entrar e sair; só funciona dentro do provedor.
export function useAutenticacao(): ContextoAutenticacao {
  const contexto = useContext(AutenticacaoContexto);
  if (!contexto) {
    throw new Error('useAutenticacao deve ser usado dentro de ProvedorAutenticacao.');
  }
  return contexto;
}
