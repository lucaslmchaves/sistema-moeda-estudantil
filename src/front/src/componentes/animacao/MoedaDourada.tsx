// Moeda de ouro desenhada em SVG e a palavra que vira moeda ao passar o ponteiro.
import React from 'react';

export const MoedaDourada: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
    <circle cx="32" cy="32" r="31" fill="var(--color-ouro-500)" />
    <circle cx="32" cy="32" r="27" fill="var(--color-ouro-300)" />
    <circle cx="32" cy="32" r="21" fill="none" stroke="var(--color-ouro-500)" strokeWidth="2.5" />
    <text
      x="32"
      y="43"
      textAnchor="middle"
      fontSize="32"
      fontStyle="italic"
      fontFamily="var(--font-serif)"
      fill="var(--color-ouro-700)"
    >
      M
    </text>
  </svg>
);

export const PalavraQueViraMoeda: React.FC<{ palavra: string; className?: string }> = ({
  palavra,
  className = '',
}) => (
  <span className="vira-moeda" tabIndex={0}>
    <span className="vira-moeda-giro">
      <span className={`vira-moeda-face ${className}`}>{palavra}</span>
      <span className="vira-moeda-face vira-moeda-verso" aria-hidden="true">
        <MoedaDourada className="size-[1.05em] drop-shadow-lg" />
      </span>
    </span>
  </span>
);
