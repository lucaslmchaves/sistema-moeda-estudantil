// Página do aluno: catálogo das vantagens das empresas parceiras e resgate com moedas.
import React from 'react';
import { urlDaApi } from '../../api/cliente';
import { CabecalhoPagina } from '../../componentes/layout/CabecalhoPagina';
import { Carregando } from '../../componentes/feedback/Carregando';
import { EstadoVazio } from '../../componentes/feedback/EstadoVazio';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { ModalConfirmacao } from '../../componentes/feedback/ModalConfirmacao';
import { useCatalogo } from '../../hooks/moedas/useCatalogo';
import { CLASSE_CARTAO, classeBotao } from '../../utils/estilos';
import { formatarMoedas } from '../../utils/formatacao';

// Mostra um cartão por vantagem, com foto, empresa, custo e o botão de resgate.
export const CatalogoVantagens: React.FC = () => {
  const catalogo = useCatalogo();
  const { vantagemParaResgatar: escolhida, saldo } = catalogo;

  return (
    <div>
      <CabecalhoPagina
        titulo="Vantagens"
        descricao={
          saldo === null
            ? 'Troque as suas moedas por vantagens'
            : `Troque as suas moedas por vantagens. Seu saldo: ${formatarMoedas(saldo)}`
        }
      />

      <MensagemAlerta
        tipo="sucesso"
        mensagem={catalogo.sucesso}
        onFechar={() => catalogo.setSucesso(null)}
      />
      <MensagemAlerta
        tipo="erro"
        mensagem={catalogo.erro}
        onFechar={() => catalogo.setErro(null)}
      />

      {catalogo.carregando ? (
        <Carregando mensagem="Carregando vantagens..." />
      ) : catalogo.vantagens.length === 0 ? (
        <EstadoVazio
          titulo="Nenhuma vantagem disponível"
          mensagem="As empresas parceiras ainda não cadastraram vantagens."
        />
      ) : (
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {catalogo.vantagens.map((vantagem) => (
            <article
              key={vantagem.id_vantagem}
              className={`${CLASSE_CARTAO} mb-0 flex flex-col p-0`}
            >
              <img
                src={urlDaApi(vantagem.foto)}
                alt={vantagem.descricao}
                className="h-44 w-full rounded-t-lg object-cover"
              />
              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-semibold text-slate-800">{vantagem.descricao}</h2>
                <p className="mb-4 text-sm text-slate-500">{vantagem.nome_empresa}</p>
                <div className="mt-auto flex items-center justify-between">
                  <strong className="text-indigo-600">{formatarMoedas(vantagem.custo)}</strong>
                  <button
                    type="button"
                    className={classeBotao('primario', true)}
                    disabled={saldo !== null && saldo < vantagem.custo}
                    onClick={() => catalogo.abrirResgate(vantagem)}
                  >
                    Resgatar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ModalConfirmacao
        aberto={escolhida !== null}
        titulo="Confirmar resgate"
        mensagem={
          escolhida
            ? `Trocar ${formatarMoedas(escolhida.custo)} por "${escolhida.descricao}" (${escolhida.nome_empresa})? Você receberá o cupom por e-mail.`
            : ''
        }
        textoConfirmar="Resgatar"
        carregando={catalogo.resgatando}
        onConfirmar={catalogo.confirmarResgate}
        onCancelar={catalogo.fecharResgate}
      />
    </div>
  );
};
