// Barra superior com o logotipo e os links das áreas do sistema.
import React from 'react';
import { NavLink } from 'react-router-dom';
import { classeLinkNavegacao } from '../utils/estilos';

const LINKS = [
  { para: '/', rotulo: 'Início' },
  { para: '/alunos', rotulo: 'Alunos' },
  { para: '/empresas', rotulo: 'Empresas Parceiras' },
];

// Mostra a navegação principal, destacando a área em que o usuário está.
export const Cabecalho: React.FC = () => {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
      <NavLink to="/" className="text-xl font-bold text-indigo-600 no-underline">
        🪙 Moeda Estudantil
      </NavLink>
      <nav aria-label="Navegação principal" className="flex gap-6">
        {LINKS.map(({ para, rotulo }) => (
          <NavLink
            key={para}
            to={para}
            end={para === '/'}
            className={({ isActive }) => classeLinkNavegacao(isActive)}
          >
            {rotulo}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};
