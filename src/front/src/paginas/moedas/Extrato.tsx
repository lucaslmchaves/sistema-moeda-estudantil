// Página de extrato: saldo e movimentações do aluno ou do professor logado.
import { Icone } from '../../componentes/icones/Icone';
import { classeControle } from '../../utils/estilos';
import React, { useState } from 'react';
import { CabecalhoPagina } from '../../componentes/layout/CabecalhoPagina';
import { Carregando } from '../../componentes/feedback/Carregando';
import { EstadoVazio } from '../../componentes/feedback/EstadoVazio';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { ValorMoedas } from '../../componentes/marca/Moedas';
import { ListaMovimentacoesPorDia } from '../../componentes/moedas/ListaMovimentacoes';
import { useAutenticacao } from '../../hooks/autenticacao/useAutenticacao';
import { useExtrato } from '../../hooks/moedas/useExtrato';
import { filtrarMovimentacoes, totaisDoExtrato } from '../../utils/extrato';

type Filtro = 'todas' | 'entradas' | 'saidas';

// Mostra o saldo, os totais e as movimentações agrupadas por dia, com filtro por sentido.
export const Extrato: React.FC = () => {
  const { extrato, carregando, erro, setErro } = useExtrato();
  const { usuario } = useAutenticacao();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [busca, setBusca] = useState('');
  const professor = usuario?.tipo_usuario === 'PROFESSOR';

  const transacoes = extrato?.transacoes ?? [];
  const totais = totaisDoExtrato(transacoes);
  const entradas = transacoes.filter((t) => t.valor >= 0);
  const saidas = transacoes.filter((t) => t.valor < 0);
  const doFiltro = filtro === 'entradas' ? entradas : filtro === 'saidas' ? saidas : transacoes;
  const visiveis = filtrarMovimentacoes(doFiltro, busca);

  const filtros: { id: Filtro; rotulo: string; quantidade: number }[] = [
    { id: 'todas', rotulo: 'Todas', quantidade: transacoes.length },
    { id: 'entradas', rotulo: professor ? 'Créditos' : 'Recebidas', quantidade: entradas.length },
    { id: 'saidas', rotulo: professor ? 'Enviadas' : 'Trocas', quantidade: saidas.length },
  ];

  return (
    <div>
      <CabecalhoPagina
        titulo="Extrato"
        descricao={
          professor
            ? 'O seu saldo e as moedas que você já enviou.'
            : 'O seu saldo, as moedas recebidas e as trocas por vantagens.'
        }
      />
      <MensagemAlerta tipo="erro" mensagem={erro} onFechar={() => setErro(null)} />

      {carregando ? (
        <Carregando mensagem="Carregando extrato..." />
      ) : (
        extrato && (
          <>
            <dl className="mb-8 grid overflow-hidden rounded-cartao border border-linha bg-superficie sm:grid-cols-[1.4fr_1fr_1fr]">
              <div className="bg-anil-100 p-6 sm:p-7">
                <dt className="text-sm text-tinta-2">Saldo atual</dt>
                <dd className="mt-3">
                  <ValorMoedas valor={extrato.saldo} tamanho="lg" />
                </dd>
              </div>
              <div className="border-t border-linha p-6 sm:border-t-0 sm:border-l sm:p-7">
                <dt className="text-sm text-tinta-3">{professor ? 'Créditos' : 'Recebidas'}</dt>
                <dd className="mt-3">
                  <ValorMoedas valor={totais.entradas} tamanho="lg" sinal semUnidade />
                </dd>
              </div>
              <div className="border-t border-linha p-6 sm:border-t-0 sm:border-l sm:p-7">
                <dt className="text-sm text-tinta-3">{professor ? 'Enviadas' : 'Trocadas'}</dt>
                <dd className="mt-3">
                  <ValorMoedas valor={-totais.saidas} tamanho="lg" sinal semUnidade />
                </dd>
              </div>
            </dl>

            {transacoes.length === 0 ? (
              <EstadoVazio
                icone="receipt"
                titulo="Nenhuma movimentação"
                mensagem={
                  professor
                    ? 'Quando você enviar moedas a um aluno, o envio aparece aqui.'
                    : 'Quando um professor enviar moedas para você, elas aparecem aqui.'
                }
              />
            ) : (
              <section className="rounded-cartao border border-linha bg-superficie">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linha px-5 py-3 sm:px-6">
                  <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Movimentações</h2>
                  <div role="group" aria-label="Filtrar movimentações" className="flex gap-1">
                    {filtros.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        aria-pressed={filtro === f.id}
                        onClick={() => setFiltro(f.id)}
                        className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition ${
                          filtro === f.id
                            ? 'bg-anil text-white'
                            : 'text-tinta-2 hover:bg-tinta/5 hover:text-tinta'
                        }`}
                      >
                        {f.rotulo}
                        <span
                          className={`numeros text-xs ${filtro === f.id ? 'text-white/70' : 'text-tinta-3'}`}
                        >
                          {f.quantidade}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative border-b border-linha px-5 py-3 sm:px-6">
                  <Icone
                    nome="magnifying-glass"
                    tamanho={16}
                    className="pointer-events-none absolute top-1/2 left-8 -translate-y-1/2 text-tinta-3 sm:left-9"
                  />
                  <input
                    type="search"
                    aria-label="Buscar nas movimentações"
                    placeholder={
                      professor ? 'Buscar por aluno ou motivo' : 'Buscar por nome, motivo ou cupom'
                    }
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className={`${classeControle(false)} h-9 py-1.5 pl-9 text-sm`}
                  />
                </div>
                {visiveis.length === 0 ? (
                  <p className="px-6 py-12 text-center text-sm text-tinta-3">
                    {busca.trim()
                      ? 'Nada encontrado para essa busca.'
                      : 'Nada por aqui com este filtro.'}
                  </p>
                ) : (
                  <ListaMovimentacoesPorDia transacoes={visiveis} />
                )}
              </section>
            )}
          </>
        )
      )}
    </div>
  );
};
