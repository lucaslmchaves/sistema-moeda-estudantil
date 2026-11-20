// Indicadores de carregamento: blocos no formato do conteúdo e um aviso acessível.
import React from 'react';

interface CarregandoProps {
  mensagem?: string;
  linhas?: number;
}

// Bloco cinza pulsando no lugar de um conteúdo que ainda não chegou.
export const Esqueleto: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    aria-hidden="true"
    className={`block animate-pulsar rounded-lg bg-tinta/[0.07] ${className}`}
  />
);

// Avisa o usuário de que uma operação assíncrona está em andamento.
export const Carregando: React.FC<CarregandoProps> = ({
  mensagem = 'Carregando...',
  linhas = 3,
}) => {
  return (
    <div role="status" className="flex flex-col gap-3">
      <span className="sr-only">{mensagem}</span>
      <Esqueleto className="h-9 w-64" />
      <Esqueleto className="mb-4 h-4 w-96 max-w-full" />
      {Array.from({ length: linhas }, (_, i) => (
        <Esqueleto key={i} className="h-16 w-full" />
      ))}
    </div>
  );
};
