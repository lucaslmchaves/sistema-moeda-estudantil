// Contexto e hook de autenticação: quem está logado e como entrar e sair.
import { createContext, useContext } from 'react';
import type { UsuarioLogado } from '../tipos/autenticacao';

export interface ContextoAutenticacao {
  usuario: UsuarioLogado | null;
  entrar: (login: string, senha: string) => Promise<UsuarioLogado>;
  sair: () => void;
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
