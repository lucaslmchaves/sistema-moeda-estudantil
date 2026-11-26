// Aviso exibido quando ainda não há registros cadastrados.
import React from 'react';
import { Icone, type NomeIcone } from '../icones/Icone';

interface EstadoVazioProps {
  titulo: string;
  mensagem: string;
  icone?: NomeIcone;
  children?: React.ReactNode;
}

// Explica que a lista está vazia e oferece a primeira ação, se houver.
export const EstadoVazio: React.FC<EstadoVazioProps> = ({
  titulo,
  mensagem,
  icone = 'sparkle',
  children,
}) => {
  return (
    <div className="flex flex-col items-center rounded-cartao border border-dashed border-linha-forte bg-superficie-2 px-6 py-16 text-center">
      <span className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-anil-100 text-anil">
        <Icone nome={icone} tamanho={22} />
      </span>
      <h3 className="text-lg font-semibold tracking-[-0.01em] text-tinta">{titulo}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-tinta-3">{mensagem}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};
