// Indicador de carregamento com texto informativo.
import React from 'react';

interface CarregandoProps {
  mensagem?: string;
}

// Avisa o usuário de que uma operação assíncrona está em andamento.
export const Carregando: React.FC<CarregandoProps> = ({ mensagem = 'Carregando...' }) => {
  return (
    <div role="status" className="flex items-center justify-center p-12 font-medium text-slate-500">
      <span>⏳ {mensagem}</span>
    </div>
  );
};
