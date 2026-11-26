// Tela de espera com tema de moedas, mostrada quando uma resposta demora (a primeira
// visita do dia é mais lenta). Enquanto isso, dá para apanhar as moedas que caem.
import React, { useEffect, useRef, useState } from 'react';
import { EVENTO_SERVIDOR_LENTO } from '../../utils/servidorLento';
import { podeAnimar } from '../../utils/movimento';
import { MoedaDourada } from '../animacao/MoedaDourada';

const FRASES = [
  'Contando as suas moedas…',
  'Polindo o ouro…',
  'Abrindo o cofre das vantagens…',
  'Conferindo os reconhecimentos…',
  'Quase lá…',
];
const TROCA_DE_FRASE_MS = 3500;
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

// Moedas caindo dentro do cartão; a cada uma apanhada, outra aparece.
const ApanheAsMoedas: React.FC = () => {
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
      <div className="relative mt-5 h-44 overflow-hidden rounded-cartao bg-linear-to-b from-anil-escuro to-anil-fundo">
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
        Toque nas moedas enquanto espera:{' '}
        <strong className="numeros font-semibold text-tinta">{apanhadas}</strong> apanhada
        {apanhadas === 1 ? '' : 's'}. É só um mini-game, não entram no saldo.
      </p>
    </>
  );
};

const Cartaz: React.FC = () => {
  const [frase, setFrase] = useState(0);
  const [comJogo, setComJogo] = useState(podeAnimar);

  useEffect(() => {
    const ciclo = window.setInterval(
      () => setFrase((n) => Math.min(n + 1, FRASES.length - 1)),
      TROCA_DE_FRASE_MS,
    );
    return () => window.clearInterval(ciclo);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex animate-surgir items-center justify-center bg-tinta/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-subir rounded-[20px] bg-superficie p-6 text-center shadow-flutuante">
        <MoedaDourada className="mx-auto size-14 animate-spin drop-shadow-lg [animation-duration:2.2s]" />
        <p role="status" className="mt-4 text-lg font-semibold tracking-[-0.01em] text-tinta">
          {FRASES[frase]}
        </p>
        <p className="mt-1 text-sm text-tinta-3">
          A primeira visita leva um pouco mais, até 1 minuto.
        </p>
        {comJogo && (
          <>
            <ApanheAsMoedas />
            <button
              type="button"
              onClick={() => setComJogo(false)}
              className="mt-4 cursor-pointer text-[13px] font-medium text-tinta-3 underline transition hover:text-tinta"
            >
              Pular mini-game
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const EsperaComMoedas: React.FC = () => {
  const [lento, setLento] = useState(false);

  useEffect(() => {
    const aoMudar = (evento: Event) => {
      setLento((evento as CustomEvent<boolean>).detail);
    };
    window.addEventListener(EVENTO_SERVIDOR_LENTO, aoMudar);
    return () => window.removeEventListener(EVENTO_SERVIDOR_LENTO, aoMudar);
  }, []);

  return lento ? <Cartaz /> : null;
};
