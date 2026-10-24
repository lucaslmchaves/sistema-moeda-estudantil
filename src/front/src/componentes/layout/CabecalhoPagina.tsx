// Cabeçalho padrão de página, com título, descrição e ações.
import React from 'react';

interface CabecalhoPaginaProps {
  titulo: string;
  descricao: string;
  children?: React.ReactNode;
}

// Mostra o título da tela e os botões de ação que vierem como filhos.
export const CabecalhoPagina: React.FC<CabecalhoPaginaProps> = ({
  titulo,
  descricao,
  children,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{titulo}</h1>
        <p className="mt-1 text-slate-500">{descricao}</p>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};
