// Barra superior com o logotipo, os links do perfil e a saída do sistema.
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../hooks/useAutenticacao';
import { classeBotao, classeLinkNavegacao } from '../utils/estilos';
import { linksDoUsuario } from '../utils/navegacao';

// Mostra a navegação do perfil logado, destacando a área atual, e o botão de sair.
export const Cabecalho: React.FC = () => {
  const { usuario, sair } = useAutenticacao();
  const navigate = useNavigate();

  // Encerra a sessão e leva o usuário à tela de login.
  const aoSair = () => {
    navigate('/entrar');
    sair();
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
      <NavLink to="/" className="text-xl font-bold text-indigo-600 no-underline">
        🪙 Moeda Estudantil
      </NavLink>
      <nav aria-label="Navegação principal" className="flex flex-wrap items-center gap-2">
        {linksDoUsuario(usuario).map(({ para, rotulo }) => (
          <NavLink
            key={para}
            to={para}
            end={para === '/'}
            className={({ isActive }) => classeLinkNavegacao(isActive)}
          >
            {rotulo}
          </NavLink>
        ))}
        {usuario && (
          <>
            <span className="ml-2 text-sm text-slate-500">Olá, {usuario.nome}</span>
            <button type="button" className={classeBotao('secundario', true)} onClick={aoSair}>
              Sair
            </button>
          </>
        )}
      </nav>
    </header>
  );
};
