// Guarda de rota: só deixa passar quem está logado com um dos perfis permitidos.
import React, { useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAutenticacao } from '../hooks/useAutenticacao';
import type { TipoUsuario } from '../tipos/autenticacao';

interface RotaProtegidaProps {
  perfis: TipoUsuario[];
  children: React.ReactNode;
}

// Manda para o login quem não entrou e para o início quem não tem o perfil da tela.
export const RotaProtegida: React.FC<RotaProtegidaProps> = ({ perfis, children }) => {
  const { usuario } = useAutenticacao();
  const local = useLocation();
  const estavaLogado = useRef(Boolean(usuario));
  if (usuario) estavaLogado.current = true;

  if (!usuario) {
    // Quem acabou de sair não volta a esta tela no próximo login; quem chegou sem entrar, sim.
    const state = estavaLogado.current ? undefined : { origem: local.pathname };
    return <Navigate to="/entrar" replace state={state} />;
  }
  if (!perfis.includes(usuario.tipo_usuario)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
