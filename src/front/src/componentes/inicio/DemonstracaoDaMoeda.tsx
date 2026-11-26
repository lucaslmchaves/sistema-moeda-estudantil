// Demonstração interativa do caminho de uma moeda: cada passo mostra a tela correspondente.
// Avança sozinha até a pessoa escolher um passo.
import React, { useEffect, useState } from 'react';
import { podeAnimar } from '../../utils/movimento';
import { NumeroAnimado } from '../animacao/NumeroAnimado';
import { Icone, type NomeIcone } from '../icones/Icone';
import { Avatar } from '../marca/Avatar';
import { ValorMoedas } from '../marca/Moedas';

export const DURACAO_DO_PASSO_MS = 4500;

const PASSOS: { icone: NomeIcone; titulo: string; texto: string }[] = [
  {
    icone: 'chalkboard-teacher',
    titulo: 'O professor reconhece',
    texto: 'Escolhe o aluno, informa quantas moedas e escreve o motivo.',
  },
  {
    icone: 'paper-plane-tilt',
    titulo: 'O aluno recebe',
    texto: 'As moedas entram no saldo e um aviso chega por e-mail.',
  },
  {
    icone: 'gift',
    titulo: 'Troca por vantagens',
    texto: 'No catálogo das empresas parceiras, com cupom e código para conferir.',
  },
];

const CLASSE_TELA = 'cascata flex w-full max-w-sm flex-col gap-3';
const CLASSE_FICHA = 'rounded-2xl bg-superficie p-4 text-tinta shadow-elevado';

const Pessoa: React.FC<{ nome: string; detalhe: string }> = ({ nome, detalhe }) => (
  <div className="flex items-center gap-3">
    <Avatar nome={nome} tamanho="sm" />
    <div className="min-w-0">
      <p className="truncate text-sm font-medium">{nome}</p>
      <p className="truncate text-xs text-tinta-3">{detalhe}</p>
    </div>
  </div>
);

const Saldo: React.FC<{ valor: number }> = ({ valor }) => (
  <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
    <p className="text-xs text-white/70">Saldo do aluno</p>
    <div className="mt-2">
      <NumeroAnimado valor={valor}>{(n) => <ValorMoedas valor={n} tamanho="xl" />}</NumeroAnimado>
    </div>
  </div>
);

// Uma tela para cada passo, na mesma ordem da lista.
const TELAS: React.FC[] = [
  () => (
    <div className={CLASSE_TELA}>
      <p className="text-sm text-white/70">Enviar moedas</p>
      <div className={CLASSE_FICHA}>
        <Pessoa nome="Beatriz Andrade" detalhe="Engenharia de Software" />
      </div>
      <div className={CLASSE_FICHA}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-tinta-3">Quantidade</span>
          <ValorMoedas valor={120} tamanho="sm" />
        </div>
        <p className="mt-3 border-t border-linha pt-3 text-[13px] leading-snug text-tinta-2">
          “Ajudou a turma a entender o exercício antes da prova.”
        </p>
      </div>
      <span className="inline-flex h-11 items-center justify-center gap-2 rounded-controle bg-white text-sm font-semibold text-anil-escuro">
        Enviar moedas
        <Icone nome="paper-plane-tilt" tamanho={16} />
      </span>
    </div>
  ),
  () => (
    <div className={CLASSE_TELA}>
      <Saldo valor={160} />
      <div className={`${CLASSE_FICHA} flex items-center justify-between gap-3`}>
        <Pessoa nome="Prof. Carlos Eduardo" detalhe="enviou moedas para você" />
        <ValorMoedas valor={120} tamanho="sm" sinal semUnidade />
      </div>
      <div className={`${CLASSE_FICHA} flex items-center gap-3 text-sm`}>
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-anil-100 text-anil">
          <Icone nome="envelope-simple" tamanho={16} />
        </span>
        Aviso enviado para o seu e-mail
      </div>
    </div>
  ),
  () => (
    <div className={CLASSE_TELA}>
      <Saldo valor={140} />
      <div className={`${CLASSE_FICHA} flex items-center justify-between gap-3`}>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Café com pão de queijo</p>
          <p className="text-xs text-tinta-3">Cantina do Campus</p>
        </div>
        <ValorMoedas valor={-20} tamanho="sm" sinal semUnidade />
      </div>
      <div className={`${CLASSE_FICHA} flex items-center gap-3`}>
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-aviso-fundo text-aviso">
          <Icone nome="ticket" tamanho={16} />
        </span>
        <div>
          <p className="text-xs text-tinta-3">Cupom da troca</p>
          <p className="font-mono text-[15px] font-semibold tracking-[0.12em]">LTWVGBZ2</p>
        </div>
      </div>
    </div>
  ),
];

export const DemonstracaoDaMoeda: React.FC = () => {
  const [passo, setPasso] = useState(0);
  const [automatico, setAutomatico] = useState(podeAnimar);
  const Tela = TELAS[passo];

  useEffect(() => {
    if (!automatico) return;
    const proximo = window.setTimeout(
      () => setPasso((n) => (n + 1) % PASSOS.length),
      DURACAO_DO_PASSO_MS,
    );
    return () => window.clearTimeout(proximo);
  }, [automatico, passo]);

  const escolher = (indice: number) => {
    setAutomatico(false);
    setPasso(indice);
  };

  return (
    <section aria-labelledby="caminho">
      <h2 id="caminho" className="titulo-display mb-10 text-4xl sm:text-5xl">
        O caminho de uma <em className="font-serif font-normal text-anil">moeda</em>.
      </h2>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
        <ol className="flex flex-col gap-3">
          {PASSOS.map((item, i) => {
            const ativo = i === passo;
            return (
              <li key={item.titulo} className="flex flex-1">
                <button
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => escolher(i)}
                  className={`relative flex w-full cursor-pointer items-start gap-4 overflow-hidden rounded-cartao border p-5 text-left transition duration-300 ${
                    ativo
                      ? 'border-anil-200 bg-superficie shadow-elevado'
                      : 'border-linha bg-transparent hover:border-anil-200 hover:bg-superficie'
                  }`}
                >
                  <span
                    className={`inline-flex size-11 shrink-0 items-center justify-center rounded-2xl transition ${
                      ativo ? 'bg-anil text-white' : 'bg-anil-100 text-anil'
                    }`}
                  >
                    <Icone nome={item.icone} tamanho={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-semibold tracking-[-0.02em]">
                      {item.titulo}
                    </span>
                    <span
                      className={`mt-1 block text-[15px] leading-relaxed text-tinta-2 ${ativo ? '' : 'max-lg:hidden'}`}
                    >
                      {item.texto}
                    </span>
                  </span>
                  <span aria-hidden="true" className="font-serif text-4xl text-ouro-500 italic">
                    {i + 1}
                  </span>
                  {ativo && automatico && (
                    <span
                      aria-hidden="true"
                      className="barra-de-tempo absolute bottom-0 left-0 h-1 w-full bg-anil"
                      style={{ animationDuration: `${DURACAO_DO_PASSO_MS}ms` }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
        <div
          aria-live="polite"
          className="flex min-h-[380px] items-center max-lg:order-first justify-center rounded-[28px] bg-linear-to-br from-anil-escuro to-anil-fundo p-6 text-white shadow-flutuante sm:p-10"
        >
          <Tela key={passo} />
        </div>
      </div>
    </section>
  );
};
