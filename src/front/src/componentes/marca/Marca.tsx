// Logotipo do sistema: duas moedas sobrepostas e o nome.
import React from 'react';

interface MarcaProps {
  compacta?: boolean;
  clara?: boolean;
}

// Símbolo desenhado em SVG para manter o traço nítido em qualquer tamanho.
export const SimboloMarca: React.FC<{ tamanho?: number }> = ({ tamanho = 28 }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <circle cx="12" cy="16" r="10" fill="var(--color-lavanda-300)" />
    <circle cx="20" cy="16" r="10" fill="var(--color-tinta)" />
    <circle
      cx="20"
      cy="16"
      r="5.5"
      fill="none"
      stroke="var(--color-lavanda-300)"
      strokeWidth="1.6"
    />
  </svg>
);

// Mostra o símbolo e, fora do modo compacto, o nome do sistema.
export const Marca: React.FC<MarcaProps> = ({ compacta = false, clara = false }) => (
  <span className="inline-flex items-center gap-2.5">
    <SimboloMarca />
    {!compacta && (
      <span
        className={`text-[15px] font-semibold whitespace-nowrap tracking-[-0.01em] ${clara ? 'text-white' : 'text-tinta'}`}
      >
        Moeda Estudantil
      </span>
    )}
  </span>
);
