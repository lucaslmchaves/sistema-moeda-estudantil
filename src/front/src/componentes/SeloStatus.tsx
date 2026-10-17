// Selo colorido que indica se o cadastro está ativo ou inativo.
import React from 'react';

interface SeloStatusProps {
  ativo: boolean;
}

// Mostra a situação do cadastro com cor e texto.
export const SeloStatus: React.FC<SeloStatusProps> = ({ ativo }) => {
  const cor = ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  return (
    <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${cor}`}>
      {ativo ? 'Ativo' : 'Inativo'}
    </span>
  );
};
