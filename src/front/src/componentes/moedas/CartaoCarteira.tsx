// Cartão da carteira em índigo: o saldo em destaque, o titular e as ações principais.
import React from 'react';
import { NumeroAnimado } from '../animacao/NumeroAnimado';
import { SimboloMarca } from '../marca/Marca';
import { ValorMoedas } from '../marca/Moedas';
import { Esqueleto } from '../feedback/Carregando';

interface CartaoCarteiraProps {
  rotulo: string;
  saldo: number | null;
  titular: string;
  perfil: string;
  detalhes?: { rotulo: string; valor: React.ReactNode }[];
  children?: React.ReactNode;
}

export const CartaoCarteira: React.FC<CartaoCarteiraProps> = ({
  rotulo,
  saldo,
  titular,
  perfil,
  detalhes = [],
  children,
}) => (
  <section
    aria-label={rotulo}
    className="relative isolate flex flex-col overflow-hidden rounded-[20px] bg-linear-to-br from-anil-escuro to-anil-fundo p-6 text-white shadow-flutuante sm:p-8"
  >
    <svg
      aria-hidden="true"
      className="absolute -top-32 -right-32 -z-10 size-80 text-ouro-300 opacity-[0.18]"
      viewBox="0 0 200 200"
    >
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="44" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/70">{rotulo}</span>
      <SimboloMarca tamanho={26} />
    </div>
    <div className="mt-6 mb-8 min-h-[64px]">
      {saldo === null ? (
        <Esqueleto className="h-14 w-48 bg-white/10" />
      ) : (
        <NumeroAnimado valor={saldo}>{(n) => <ValorMoedas valor={n} tamanho="xl" />}</NumeroAnimado>
      )}
    </div>
    {detalhes.length > 0 && (
      <dl className="mb-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
        {detalhes.map((d) => (
          <div key={d.rotulo}>
            <dt className="text-xs text-white/60">{d.rotulo}</dt>
            <dd className="numeros mt-1 text-[15px] font-medium">{d.valor}</dd>
          </div>
        ))}
      </dl>
    )}
    <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="truncate text-[15px] font-medium">{titular}</p>
        <p className="text-xs text-white/60">{perfil}</p>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  </section>
);

// Classe dos botões claros usados dentro do cartão escuro.
export const CLASSE_BOTAO_CLARO =
  'inline-flex h-10 items-center justify-center gap-2 rounded-controle bg-white px-4 text-sm font-medium text-tinta no-underline transition hover:bg-anil-100';
export const CLASSE_BOTAO_CONTORNO_CLARO =
  'inline-flex h-10 items-center justify-center gap-2 rounded-controle border border-white/20 px-4 text-sm font-medium text-white no-underline transition hover:bg-white/10';
