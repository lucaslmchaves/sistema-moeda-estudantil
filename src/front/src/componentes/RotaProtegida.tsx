// Guarda de rota: só deixa passar quem está logado com um dos perfis permitidos.
import React from 'react';
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

  if (!usuario) {
    return <Navigate to="/entrar" replace state={{ origem: local.pathname }} />;
  }
  if (!perfis.includes(usuario.tipo_usuario)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
