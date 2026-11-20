// Cabeçalho padrão de página, com título, descrição e ações.
import React from 'react';

interface CabecalhoPaginaProps {
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  children?: React.ReactNode;
}

// Mostra o título da tela e os botões de ação que vierem como filhos.
export const CabecalhoPagina: React.FC<CabecalhoPaginaProps> = ({
  titulo,
  descricao,
  children,
}) => {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <h1 className="titulo-display text-[32px] text-tinta sm:text-[40px]">{titulo}</h1>
        {descricao && <p className="mt-2 max-w-2xl text-[15px] text-tinta-3">{descricao}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
};
