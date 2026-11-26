// Representação visual de quantias em moedas: a moeda desenhada e o valor formatado.
import React from 'react';

const NUMERO = new Intl.NumberFormat('pt-BR');

// Pequena moeda usada ao lado dos valores.
export const IconeMoeda: React.FC<{ tamanho?: number | string; className?: string }> = ({
  tamanho = '1em',
  className = '',
}) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 20 20"
    aria-hidden="true"
    focusable="false"
    className={`shrink-0 ${className}`}
  >
    <circle cx="10" cy="10" r="9" fill="var(--color-ouro-300)" />
    <circle cx="10" cy="10" r="5.6" fill="none" stroke="var(--color-ouro-700)" strokeWidth="1.5" />
  </svg>
);

type TamanhoValor = 'sm' | 'md' | 'lg' | 'xl';

const CLASSES_TAMANHO: Record<TamanhoValor, { numero: string; unidade: string; moeda: string }> = {
  sm: { numero: 'text-sm font-semibold', unidade: 'text-xs', moeda: '14' },
  md: { numero: 'text-base font-semibold', unidade: 'text-sm', moeda: '16' },
  lg: { numero: 'text-2xl font-medium tracking-[-0.02em]', unidade: 'text-sm', moeda: '20' },
  xl: {
    numero: 'text-5xl font-normal tracking-[-0.04em] sm:text-6xl',
    unidade: 'text-lg',
    moeda: '28',
  },
};

interface ValorMoedasProps {
  valor: number;
  tamanho?: TamanhoValor;
  sinal?: boolean;
  semMoeda?: boolean;
  semUnidade?: boolean;
  fundoEscuro?: boolean;
  className?: string;
}

// Escreve o valor com separador de milhar, a moeda e a palavra "moedas" em tom secundário.
export const ValorMoedas: React.FC<ValorMoedasProps> = ({
  valor,
  tamanho = 'md',
  sinal = false,
  semMoeda = false,
  semUnidade = false,
  fundoEscuro = false,
  className = '',
}) => {
  const c = CLASSES_TAMANHO[tamanho];
  const prefixo = sinal ? (valor > 0 ? '+' : valor < 0 ? '−' : '') : valor < 0 ? '−' : '';
  // Com sinal, o que entra é verde e o que sai é vermelho; zero fica neutro.
  let tom = '';
  if (sinal && valor > 0) tom = fundoEscuro ? 'text-emerald-300' : 'text-positivo';
  if (sinal && valor < 0) tom = fundoEscuro ? 'text-red-300' : 'text-negativo';
  return (
    <span
      className={`numeros inline-flex items-baseline gap-1.5 whitespace-nowrap ${tom} ${className}`}
    >
      {!semMoeda && <IconeMoeda tamanho={c.moeda} className="self-center" />}
      <span className={c.numero}>
        {prefixo}
        {NUMERO.format(Math.abs(valor))}
      </span>
      {!semUnidade && (
        <span className={`${c.unidade} font-normal opacity-70`}>
          {Math.abs(valor) === 1 ? 'moeda' : 'moedas'}
        </span>
      )}
    </span>
  );
};
