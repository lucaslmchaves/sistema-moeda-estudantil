// Página do aluno: catálogo das vantagens das empresas parceiras e resgate com moedas.
import React, { useMemo, useState } from 'react';
import { urlDaApi } from '../../api/cliente';
import { CabecalhoPagina } from '../../componentes/layout/CabecalhoPagina';
import { Esqueleto } from '../../componentes/feedback/Carregando';
import { EstadoVazio } from '../../componentes/feedback/EstadoVazio';
import { ChuvaDeMoedas } from '../../componentes/animacao/ChuvaDeMoedas';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { ModalConfirmacao } from '../../componentes/feedback/ModalConfirmacao';
import { Icone } from '../../componentes/icones/Icone';
import { ValorMoedas } from '../../componentes/marca/Moedas';
import { useCatalogo } from '../../hooks/moedas/useCatalogo';
import type { Vantagem } from '../../tipos/vantagem';
import { classeBotao, classeControle } from '../../utils/estilos';

type Ordem = 'menor' | 'maior';

function semAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Cartão de uma vantagem: foto, empresa, descrição, custo e o botão de troca.
const CartaoVantagem: React.FC<{
  vantagem: Vantagem;
  saldo: number | null;
  aoResgatar: () => void;
}> = ({ vantagem, saldo, aoResgatar }) => {
  const falta = saldo === null ? 0 : vantagem.custo - saldo;
  return (
    <article className="group flex flex-col overflow-hidden rounded-cartao border border-linha bg-superficie transition-[box-shadow,transform] duration-300 ease-saida hover:-translate-y-0.5 hover:shadow-elevado">
      <div className="relative aspect-[4/3] overflow-hidden bg-superficie-2">
        <img
          src={urlDaApi(vantagem.foto)}
          alt={vantagem.descricao}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 ease-saida group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-superficie/95 px-2.5 py-1 shadow-elevado backdrop-blur-sm">
          <ValorMoedas valor={vantagem.custo} tamanho="sm" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[13px] text-tinta-3">{vantagem.nome_empresa}</p>
        <h2 className="mt-1 text-[17px] leading-snug font-semibold tracking-[-0.01em]">
          {vantagem.descricao}
        </h2>
        <div className="mt-auto pt-5">
          {falta > 0 ? (
            <p className="flex h-10 items-center gap-2 text-sm text-tinta-3">
              <Icone nome="lock-simple" tamanho={16} />
              <span>
                Faltam <span className="numeros font-medium text-tinta-2">{falta}</span> moedas
              </span>
            </p>
          ) : (
            <button
              type="button"
              className={`${classeBotao('secundario')} w-full group-hover:border-tinta group-hover:bg-tinta group-hover:text-white`}
              onClick={aoResgatar}
            >
              Trocar por {vantagem.custo} moedas
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

// Mostra o catálogo com busca, filtro do que cabe no saldo e ordenação por custo.
export const CatalogoVantagens: React.FC = () => {
  const catalogo = useCatalogo();
  const { vantagemParaResgatar: escolhida, saldo, cupom } = catalogo;
  const [busca, setBusca] = useState('');
  const [soAlcance, setSoAlcance] = useState(false);
  const [ordem, setOrdem] = useState<Ordem>('menor');
  const [copiado, setCopiado] = useState(false);

  const visiveis = useMemo(() => {
    const termo = semAcentos(busca.trim());
    return catalogo.vantagens
      .filter((v) => !termo || semAcentos(`${v.descricao} ${v.nome_empresa}`).includes(termo))
      .filter((v) => !soAlcance || saldo === null || v.custo <= saldo)
      .sort((a, b) => (ordem === 'menor' ? a.custo - b.custo : b.custo - a.custo));
  }, [catalogo.vantagens, busca, soAlcance, saldo, ordem]);

  const copiarCupom = async () => {
    if (!cupom) return;
    try {
      await navigator.clipboard.writeText(cupom.codigo);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      // O código segue visível para copiar à mão.
    }
  };

  return (
    <div>
      <CabecalhoPagina
        titulo="Vantagens"
        descricao="Troque as suas moedas por produtos e descontos."
      >
        <div className="flex h-10 items-center gap-2 rounded-full border border-linha bg-superficie pr-4 pl-3 text-sm">
          <span className="text-tinta-3">Seu saldo</span>
          {saldo === null ? (
            <Esqueleto className="h-4 w-12" />
          ) : (
            <ValorMoedas valor={saldo} tamanho="sm" semUnidade />
          )}
        </div>
      </CabecalhoPagina>

      <MensagemAlerta
        tipo="erro"
        mensagem={catalogo.erro}
        onFechar={() => catalogo.setErro(null)}
      />

      {cupom && <ChuvaDeMoedas key={cupom.codigo} />}
      {cupom && (
        <div
          role="status"
          className="mb-8 flex animate-subir flex-col gap-5 rounded-cartao border border-positivo/20 bg-positivo-fundo p-5 sm:flex-row sm:items-center sm:p-6"
        >
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-superficie text-positivo">
            <Icone nome="ticket" tamanho={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-tinta">Troca feita: {cupom.vantagem.descricao}</p>
            <p className="mt-0.5 text-sm text-tinta-2">
              Apresente o código na {cupom.vantagem.nome_empresa}. Ele também foi enviado para o seu
              e-mail.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copiarCupom}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-controle border border-dashed border-positivo/40 bg-superficie px-4 font-mono text-[15px] font-semibold tracking-[0.12em] text-tinta transition hover:border-positivo"
              aria-label={copiado ? 'Código copiado' : `Copiar código ${cupom.codigo}`}
            >
              {cupom.codigo}
              <Icone nome={copiado ? 'check' : 'copy'} tamanho={16} className="text-tinta-3" />
            </button>
            <button
              type="button"
              onClick={() => {
                catalogo.fecharCupom();
                catalogo.setSucesso(null);
              }}
              aria-label="Fechar"
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-tinta-3 transition hover:bg-black/5 hover:text-tinta"
            >
              <Icone nome="x" tamanho={18} />
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 basis-64">
          <Icone
            nome="magnifying-glass"
            tamanho={16}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-tinta-3"
          />
          <input
            type="search"
            aria-label="Buscar vantagem ou empresa"
            placeholder="Buscar vantagem ou empresa"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={`${classeControle(false)} h-10 py-2 pl-10 text-sm`}
          />
        </div>
        <button
          type="button"
          aria-pressed={soAlcance}
          onClick={() => setSoAlcance((v) => !v)}
          className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
            soAlcance
              ? 'border-tinta bg-tinta text-white'
              : 'border-linha-forte bg-superficie text-tinta-2 hover:border-tinta-3 hover:text-tinta'
          }`}
        >
          {soAlcance && <Icone nome="check" tamanho={14} />}
          Cabe no meu saldo
        </button>
        <div className="relative">
          <select
            aria-label="Ordenar por custo"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value as Ordem)}
            className="h-10 cursor-pointer appearance-none rounded-full border border-linha-forte bg-superficie pr-10 pl-4 text-sm font-medium text-tinta-2 transition outline-none hover:border-tinta-3 focus-visible:border-anil"
          >
            <option value="menor">Menor custo</option>
            <option value="maior">Maior custo</option>
          </select>
          <Icone
            nome="caret-down"
            tamanho={14}
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-tinta-3"
          />
        </div>
      </div>

      {catalogo.carregando ? (
        <div role="status" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <span className="sr-only">Carregando vantagens...</span>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-cartao border border-linha bg-superficie"
            >
              <Esqueleto className="aspect-[4/3] rounded-none" />
              <div className="space-y-3 p-5">
                <Esqueleto className="h-3 w-1/3" />
                <Esqueleto className="h-5 w-3/4" />
                <Esqueleto className="mt-6 h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : catalogo.vantagens.length === 0 ? (
        <EstadoVazio
          icone="gift"
          titulo="Nenhuma vantagem disponível"
          mensagem="As empresas parceiras ainda não cadastraram vantagens. Volte em breve."
        />
      ) : visiveis.length === 0 ? (
        <EstadoVazio
          icone="magnifying-glass"
          titulo="Nada encontrado"
          mensagem={
            soAlcance
              ? 'Nenhuma vantagem com esses filtros cabe no seu saldo.'
              : 'Tente buscar por outro nome.'
          }
        >
          <button
            type="button"
            className={classeBotao('secundario')}
            onClick={() => {
              setBusca('');
              setSoAlcance(false);
            }}
          >
            Limpar filtros
          </button>
        </EstadoVazio>
      ) : (
        <div className="cascata grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visiveis.map((vantagem) => (
            <CartaoVantagem
              key={vantagem.id_vantagem}
              vantagem={vantagem}
              saldo={saldo}
              aoResgatar={() => catalogo.abrirResgate(vantagem)}
            />
          ))}
        </div>
      )}

      <ModalConfirmacao
        aberto={escolhida !== null}
        titulo="Confirmar troca"
        mensagem="O valor sai do seu saldo agora e o cupom chega por e-mail."
        textoConfirmar="Confirmar troca"
        textoCarregando="Trocando..."
        variante="primario"
        carregando={catalogo.resgatando}
        onConfirmar={catalogo.confirmarResgate}
        onCancelar={catalogo.fecharResgate}
      >
        {escolhida && (
          <div className="overflow-hidden rounded-controle border border-linha">
            <div className="flex items-center gap-4 p-3">
              <img
                src={urlDaApi(escolhida.foto)}
                alt=""
                className="size-14 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-medium">{escolhida.descricao}</p>
                <p className="truncate text-sm text-tinta-3">{escolhida.nome_empresa}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 border-t border-linha bg-superficie-2 text-sm">
              <div className="p-3">
                <dt className="text-tinta-3">Custo</dt>
                <dd className="numeros mt-0.5 font-semibold">−{escolhida.custo}</dd>
              </div>
              <div className="border-l border-linha p-3">
                <dt className="text-tinta-3">Saldo depois</dt>
                <dd className="numeros mt-0.5 font-semibold">
                  {saldo === null ? '–' : saldo - escolhida.custo}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </ModalConfirmacao>
    </div>
  );
};
