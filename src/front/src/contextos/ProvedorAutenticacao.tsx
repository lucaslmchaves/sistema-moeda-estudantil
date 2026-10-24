// Provedor que guarda a sessão e oferece entrar e sair a toda a aplicação.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { entrar as entrarNaApi } from '../api/autenticacao';
import { AutenticacaoContexto } from '../hooks/autenticacao/useAutenticacao';
import type { UsuarioLogado } from '../tipos/autenticacao';
import { EVENTO_SESSAO_EXPIRADA, limparSessao, obterSessao, salvarSessao } from '../utils/sessao';

interface ProvedorAutenticacaoProps {
  children: React.ReactNode;
}

// Mantém o usuário logado, restaura a sessão salva e encerra a sessão quando o token expira.
export const ProvedorAutenticacao: React.FC<ProvedorAutenticacaoProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(
    () => obterSessao()?.usuario ?? null,
  );

  const [aviso, setAviso] = useState<string | null>(null);

  const entrar = useCallback(async (login: string, senha: string) => {
    const resposta = await entrarNaApi(login, senha);
    salvarSessao({ token: resposta.access_token, usuario: resposta.usuario });
    setAviso(null);
    setUsuario(resposta.usuario);
    return resposta.usuario;
  }, []);

  const sair = useCallback((mensagem?: string) => {
    limparSessao();
    setAviso(mensagem ?? null);
    setUsuario(null);
  }, []);

  const limparAviso = useCallback(() => setAviso(null), []);

  // Quando a API recusa o token, a sessão já foi apagada e a tela volta ao login.
  useEffect(() => {
    const aoExpirar = () => setUsuario(null);
    window.addEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
    return () => window.removeEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
  }, []);

  const valor = useMemo(
    () => ({ usuario, aviso, entrar, sair, limparAviso }),
    [usuario, aviso, entrar, sair, limparAviso],
  );

  return <AutenticacaoContexto.Provider value={valor}>{children}</AutenticacaoContexto.Provider>;
};
