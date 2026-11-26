// Linhas do extrato: quem enviou ou recebeu, o motivo, o cupom e o valor.
import React, { useState } from 'react';
import type { TransacaoExtrato } from '../../tipos/moedas';
import { agruparPorDia, horaDe, lerMovimentacao, rotuloDoDia } from '../../utils/extrato';
import { Icone, type NomeIcone } from '../icones/Icone';
import { ValorMoedas } from '../marca/Moedas';

const VISUAL: Record<string, { icone: NomeIcone; tom: string }> = {
  recebido: { icone: 'arrow-down-left', tom: 'bg-positivo-fundo text-positivo' },
  enviado: { icone: 'paper-plane-tilt', tom: 'bg-anil-100 text-anil' },
  resgate: { icone: 'ticket', tom: 'bg-aviso-fundo text-aviso' },
  outro: { icone: 'coins', tom: 'bg-superficie-2 text-tinta-2' },
};

// Botão que copia o código do cupom e confirma por alguns segundos.
const CodigoCupom: React.FC<{ codigo: string }> = ({ codigo }) => {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      // Sem acesso à área de transferência, o código continua visível para copiar à mão.
    }
  };
  return (
    <button
      type="button"
      onClick={copiar}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-linha-forte bg-superficie-2 px-2 py-0.5 font-mono text-xs font-medium tracking-wider text-tinta transition hover:border-tinta-3"
      aria-label={copiado ? `Código ${codigo} copiado` : `Copiar código do cupom ${codigo}`}
    >
      {codigo}
      <Icone nome={copiado ? 'check' : 'copy'} tamanho={13} className="text-tinta-3" />
    </button>
  );
};

// Uma movimentação, com ícone pelo tipo e valor colorido pelo sentido.
export const ItemMovimentacao: React.FC<{ transacao: TransacaoExtrato; comDia?: boolean }> = ({
  transacao,
  comDia = false,
}) => {
  const lida = lerMovimentacao(transacao);
  const visual = VISUAL[lida.tipo];
  const quando = comDia
    ? `${rotuloDoDia(transacao.data_hora)}, ${horaDe(transacao.data_hora)}`
    : horaDe(transacao.data_hora);
  const prefixo = lida.tipo === 'recebido' ? 'De ' : lida.tipo === 'enviado' ? 'Para ' : '';

  return (
    <li className="flex items-start gap-4 px-5 py-4 sm:px-6">
      <span
        className={`mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full ${visual.tom}`}
      >
        <Icone nome={visual.icone} tamanho={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-tinta">
          {prefixo && <span className="font-normal text-tinta-3">{prefixo}</span>}
          {lida.titulo}
        </p>
        {lida.codigo ? (
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-tinta-3">
            Cupom <CodigoCupom codigo={lida.codigo} />
          </p>
        ) : (
          lida.detalhe && (
            <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-tinta-2">
              {lida.detalhe}
            </p>
          )
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 pl-2">
        <ValorMoedas
          valor={transacao.valor}
          sinal
          semMoeda
          semUnidade
          tamanho="md"
          className={transacao.valor >= 0 ? 'text-positivo' : 'text-tinta'}
        />
        <span className="numeros text-xs text-tinta-3">{quando}</span>
      </div>
    </li>
  );
};

// Lista simples, já ordenada, com o dia escrito em cada linha.
export const ListaMovimentacoes: React.FC<{ transacoes: TransacaoExtrato[] }> = ({
  transacoes,
}) => (
  <ul className="divide-y divide-linha">
    {transacoes.map((t) => (
      <ItemMovimentacao key={t.id_transacao} transacao={t} comDia />
    ))}
  </ul>
);

// Lista agrupada por dia, com o nome do dia como separador.
export const ListaMovimentacoesPorDia: React.FC<{ transacoes: TransacaoExtrato[] }> = ({
  transacoes,
}) => (
  <div>
    {agruparPorDia(transacoes).map(({ dia, itens }) => (
      <section key={dia} aria-label={dia}>
        <h3 className="sticky top-14 z-[1] border-b border-linha bg-superficie-2/95 px-5 py-2 text-xs font-medium text-tinta-3 backdrop-blur-sm first:rounded-t-cartao sm:px-6 lg:top-0">
          {dia}
        </h3>
        <ul className="divide-y divide-linha">
          {itens.map((t) => (
            <ItemMovimentacao key={t.id_transacao} transacao={t} />
          ))}
        </ul>
      </section>
    ))}
  </div>
);
