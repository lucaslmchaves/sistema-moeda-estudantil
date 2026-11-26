// Moedas caindo pela tela para comemorar um envio ou uma troca.
import React, { useEffect, useState } from 'react';
import { podeAnimar } from '../../utils/movimento';
import { MoedaDourada } from './MoedaDourada';

const QUANTIDADE = 28;
const DURACAO_TOTAL_MS = 3200;

function sortearMoedas() {
  return Array.from({ length: QUANTIDADE }, (_, id) => ({
    id,
    esquerda: Math.random() * 96,
    tamanho: 18 + Math.random() * 26,
    atraso: Math.random() * 700,
    duracao: 1500 + Math.random() * 900,
    giro: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360),
  }));
}

export const ChuvaDeMoedas: React.FC = () => {
  const [moedas] = useState(() => (podeAnimar() ? sortearMoedas() : []));
  const [acabou, setAcabou] = useState(false);

  useEffect(() => {
    const fim = window.setTimeout(() => setAcabou(true), DURACAO_TOTAL_MS);
    return () => window.clearTimeout(fim);
  }, []);

  if (acabou || moedas.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {moedas.map((m) => (
        <span
          key={m.id}
          className="moeda-caindo absolute top-0"
          style={
            {
              left: `${m.esquerda}%`,
              width: m.tamanho,
              height: m.tamanho,
              animationDelay: `${m.atraso}ms`,
              animationDuration: `${m.duracao}ms`,
              '--giro': `${m.giro}deg`,
            } as React.CSSProperties
          }
        >
          <MoedaDourada className="size-full drop-shadow" />
        </span>
      ))}
    </div>
  );
};
