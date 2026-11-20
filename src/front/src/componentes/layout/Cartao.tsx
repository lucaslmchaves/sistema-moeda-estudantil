// Superfície branca com borda fina, usada para agrupar conteúdo.
import React from 'react';
import { CLASSE_CARTAO } from '../../utils/estilos';

interface CartaoProps {
  children: React.ReactNode;
  className?: string;
  semEspaco?: boolean;
}

// Envolve o conteúdo no visual padrão de cartão.
export const Cartao: React.FC<CartaoProps> = ({ children, className = '', semEspaco = false }) => {
  return (
    <div className={`${CLASSE_CARTAO} ${semEspaco ? '' : 'p-6 sm:p-8'} ${className}`}>
      {children}
    </div>
  );
};
