// Cartão branco com borda e sombra leve, usado para agrupar conteúdo.
import React from 'react';
import { CLASSE_CARTAO } from '../utils/estilos';

interface CartaoProps {
  children: React.ReactNode;
}

// Envolve o conteúdo no visual padrão de cartão.
export const Cartao: React.FC<CartaoProps> = ({ children }) => {
  return <div className={CLASSE_CARTAO}>{children}</div>;
};
