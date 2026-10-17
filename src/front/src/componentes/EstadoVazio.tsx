// Aviso exibido quando ainda não há registros cadastrados.
import React from 'react';

interface EstadoVazioProps {
  titulo: string;
  mensagem: string;
  children?: React.ReactNode;
}

// Explica que a lista está vazia e oferece a primeira ação, se houver.
export const EstadoVazio: React.FC<EstadoVazioProps> = ({ titulo, mensagem, children }) => {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-12 text-center text-slate-500">
      <h3 className="text-lg font-semibold text-slate-800">{titulo}</h3>
      <p className="mt-2 mb-6">{mensagem}</p>
      {children}
    </div>
  );
};
