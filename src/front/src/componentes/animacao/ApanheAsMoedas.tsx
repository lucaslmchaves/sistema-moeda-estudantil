// Mini-game: moedas caindo dentro do quadro; a cada uma apanhada, outra aparece.
import React, { useRef, useState } from 'react';
import { MoedaDourada } from './MoedaDourada';

const MOEDAS_NA_TELA = 7;

interface MoedaDoJogo {
  id: number;
  esquerda: number;
  tamanho: number;
  atraso: number;
  duracao: number;
}

function novaMoeda(id: number, atraso: number): MoedaDoJogo {
  return {
    id,
    esquerda: 4 + Math.random() * 82,
    tamanho: 30 + Math.random() * 18,
    atraso,
    duracao: 2600 + Math.random() * 1600,
  };
}

export const ApanheAsMoedas: React.FC<{ convite?: string }> = ({
  convite = 'Toque nas moedas enquanto espera:',
}) => {
  const proximo = useRef(MOEDAS_NA_TELA);
  const [apanhadas, setApanhadas] = useState(0);
  const [moedas, setMoedas] = useState(() =>
    Array.from({ length: MOEDAS_NA_TELA }, (_, i) => novaMoeda(i, i * 420)),
  );

  const apanhar = (id: number) => {
    setApanhadas((n) => n + 1);
    setMoedas((atuais) => atuais.map((m) => (m.id === id ? novaMoeda(proximo.current++, 0) : m)));
  };

  return (
    <>
      <div className="relative mt-5 h-44 w-full overflow-hidden rounded-cartao bg-linear-to-b from-anil-escuro to-anil-fundo">
        {moedas.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-label="Apanhar moeda"
            onPointerDown={() => apanhar(m.id)}
            className="moeda-do-jogo absolute cursor-pointer p-0 transition-transform active:scale-75"
            style={{
              left: `${m.esquerda}%`,
              width: m.tamanho,
              height: m.tamanho,
              animationDelay: `${m.atraso}ms`,
              animationDuration: `${m.duracao}ms`,
            }}
          >
            <MoedaDourada className="size-full drop-shadow-lg" />
          </button>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-tinta-3">
        {convite} <strong className="numeros font-semibold text-tinta">{apanhadas}</strong> apanhada
        {apanhadas === 1 ? '' : 's'}. É só um mini-game, não entram no saldo.
      </p>
    </>
  );
};
