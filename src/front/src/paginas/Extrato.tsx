// Página de extrato: saldo e movimentações do aluno ou do professor logado.
import React from 'react';
import { CabecalhoPagina } from '../componentes/CabecalhoPagina';
import { Cartao } from '../componentes/Cartao';
import { Carregando } from '../componentes/Carregando';
import { EstadoVazio } from '../componentes/EstadoVazio';
import { MensagemAlerta } from '../componentes/MensagemAlerta';
import { ColunaTabela, Tabela } from '../componentes/Tabela';
import { useExtrato } from '../hooks/useExtrato';
import type { TransacaoExtrato } from '../tipos/moedas';
import { formatarDataHora, formatarMoedas } from '../utils/formatacao';

// Pinta de verde o que entrou na conta e de vermelho o que saiu.
function ValorDaTransacao({ valor }: { valor: number }) {
  const cor = valor >= 0 ? 'text-emerald-700' : 'text-red-600';
  const sinal = valor >= 0 ? '+' : '−';
  return (
    <strong className={`whitespace-nowrap ${cor}`}>
      {sinal} {formatarMoedas(Math.abs(valor))}
    </strong>
  );
}

const COLUNAS: ColunaTabela<TransacaoExtrato>[] = [
  {
    cabecalho: 'Data',
    render: (t) => <span className="whitespace-nowrap">{formatarDataHora(t.data_hora)}</span>,
  },
  { cabecalho: 'Descrição', render: (t) => t.descricao },
  { cabecalho: 'Valor', alinhamento: 'right', render: (t) => <ValorDaTransacao valor={t.valor} /> },
];

// Mostra o saldo atual e a tabela de movimentações, da mais recente para a mais antiga.
export const Extrato: React.FC = () => {
  const { extrato, carregando, erro, setErro } = useExtrato();

  return (
    <div>
      <CabecalhoPagina titulo="Extrato" descricao="Seu saldo e as suas movimentações de moedas" />
      <MensagemAlerta tipo="erro" mensagem={erro} onFechar={() => setErro(null)} />

      {carregando ? (
        <Carregando mensagem="Carregando extrato..." />
      ) : (
        extrato && (
          <>
            <Cartao>
              <p className="text-sm text-slate-500">Saldo atual</p>
              <p className="text-3xl font-bold text-slate-800">{formatarMoedas(extrato.saldo)}</p>
            </Cartao>
            {extrato.transacoes.length === 0 ? (
              <EstadoVazio
                titulo="Nenhuma movimentação"
                mensagem="Assim que houver envio, recebimento ou troca de moedas, ela aparece aqui."
              />
            ) : (
              <Tabela
                colunas={COLUNAS}
                dados={extrato.transacoes}
                chaveExtrator={(t) => t.id_transacao}
              />
            )}
          </>
        )
      )}
    </div>
  );
};
