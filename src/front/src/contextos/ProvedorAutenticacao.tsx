// Provedor que guarda a sessão e oferece entrar e sair a toda a aplicação.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { entrar as entrarNaApi } from '../api/autenticacao';
import { AutenticacaoContexto } from '../hooks/useAutenticacao';
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

  const entrar = useCallback(async (login: string, senha: string) => {
    const resposta = await entrarNaApi(login, senha);
    salvarSessao({ token: resposta.access_token, usuario: resposta.usuario });
    setUsuario(resposta.usuario);
    return resposta.usuario;
  }, []);

  const sair = useCallback(() => {
    limparSessao();
    setUsuario(null);
  }, []);

  // Quando a API recusa o token, a sessão já foi apagada e a tela volta ao login.
  useEffect(() => {
    const aoExpirar = () => setUsuario(null);
    window.addEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
    return () => window.removeEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
  }, []);

  const valor = useMemo(() => ({ usuario, entrar, sair }), [usuario, entrar, sair]);

  return <AutenticacaoContexto.Provider value={valor}>{children}</AutenticacaoContexto.Provider>;
};
