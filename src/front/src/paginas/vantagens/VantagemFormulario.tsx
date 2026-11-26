// Página em que a empresa parceira cadastra uma vantagem com descrição, custo e foto.
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CabecalhoPagina } from '../../componentes/layout/CabecalhoPagina';
import { CampoFormulario } from '../../componentes/formulario/CampoFormulario';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { Icone } from '../../componentes/icones/Icone';
import { ValorMoedas } from '../../componentes/marca/Moedas';
import { useAutenticacao } from '../../hooks/autenticacao/useAutenticacao';
import { useVantagemFormulario } from '../../hooks/cadastros/useVantagemFormulario';
import { CLASSE_ACOES_FORMULARIO, classeBotao, classeControle } from '../../utils/estilos';

// Monta o formulário de vantagem, com a foto e uma prévia de como fica no catálogo.
export const VantagemFormulario: React.FC = () => {
  const form = useVantagemFormulario();
  const { valores, erros } = form;
  const { usuario } = useAutenticacao();
  const [previa, setPrevia] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const entradaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!valores.foto) {
      setPrevia(null);
      return;
    }
    const url = URL.createObjectURL(valores.foto);
    setPrevia(url);
    return () => URL.revokeObjectURL(url);
  }, [valores.foto]);

  const escolherArquivo = (arquivo: File | null | undefined) =>
    form.alterarCampo('foto', arquivo ?? null);
  const custo = Number(valores.custo);

  return (
    <div>
      <Link
        to="/minhas-vantagens"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-tinta-3 no-underline transition hover:text-tinta"
      >
        <Icone nome="arrow-left" tamanho={16} />
        Minhas vantagens
      </Link>
      <CabecalhoPagina
        titulo="Nova vantagem"
        descricao="Os alunos veem a vantagem no catálogo assim que você salvar."
      />

      <MensagemAlerta
        tipo="erro"
        mensagem={form.erroGeral}
        onFechar={() => form.setErroGeral(null)}
      />

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          noValidate
          onSubmit={form.enviar}
          className="flex flex-col gap-6 rounded-cartao border border-linha bg-superficie p-6 sm:p-8"
        >
          <CampoFormulario
            id="descricao"
            rotulo="Descrição"
            valor={valores.descricao}
            onChange={(e) => form.alterarCampo('descricao', e.target.value)}
            erro={erros.descricao}
            placeholder="Ex.: Desconto de 20% no almoço"
            obrigatorio
          />
          <CampoFormulario id="custo" rotulo="Custo em moedas" erro={erros.custo} obrigatorio>
            <input
              id="custo"
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="Ex.: 60"
              value={valores.custo}
              onChange={(e) => form.alterarCampo('custo', e.target.value)}
              aria-invalid={Boolean(erros.custo)}
              aria-describedby={erros.custo ? 'custo-erro' : undefined}
              className={`${classeControle(Boolean(erros.custo))} numeros max-w-[200px]`}
            />
          </CampoFormulario>

          <CampoFormulario
            id="foto"
            rotulo="Foto do produto"
            erro={erros.foto}
            dica="JPEG, PNG ou WebP, até 2 MB."
            obrigatorio
          >
            <label
              htmlFor="foto"
              onDragOver={(e) => {
                e.preventDefault();
                setArrastando(true);
              }}
              onDragLeave={() => setArrastando(false)}
              onDrop={(e) => {
                e.preventDefault();
                setArrastando(false);
                escolherArquivo(e.dataTransfer.files?.[0]);
              }}
              className={`flex cursor-pointer items-center gap-4 rounded-controle border border-dashed p-4 transition has-[:focus-visible]:border-anil has-[:focus-visible]:shadow-[0_0_0_4px_var(--color-anil-100)] ${
                erros.foto
                  ? 'border-negativo bg-negativo-fundo/40'
                  : arrastando
                    ? 'border-anil bg-anil-50'
                    : 'border-linha-forte bg-superficie-2 hover:border-tinta-3'
              }`}
            >
              {previa ? (
                <img src={previa} alt="" className="size-16 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="inline-flex size-16 shrink-0 items-center justify-center rounded-lg bg-superficie text-tinta-3">
                  <Icone nome="image" tamanho={26} />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-tinta">
                  {valores.foto ? valores.foto.name : 'Arraste a foto ou clique para escolher'}
                </span>
                <span className="block text-[13px] text-tinta-3">
                  {valores.foto ? 'Clique para trocar' : 'Use uma foto bem iluminada do produto'}
                </span>
              </span>
              <Icone nome="upload-simple" tamanho={20} className="text-tinta-3" />
              <input
                ref={entradaRef}
                id="foto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => escolherArquivo(e.target.files?.[0])}
                aria-invalid={Boolean(erros.foto)}
                aria-describedby={erros.foto ? 'foto-erro' : 'foto-dica'}
              />
            </label>
          </CampoFormulario>

          <div className={CLASSE_ACOES_FORMULARIO}>
            <Link to="/minhas-vantagens" className={classeBotao('fantasma')}>
              Cancelar
            </Link>
            <button type="submit" className={classeBotao('primario')} disabled={form.salvando}>
              {form.salvando ? 'Salvando...' : 'Cadastrar vantagem'}
            </button>
          </div>
        </form>

        <aside aria-label="Prévia no catálogo" className="lg:sticky lg:top-12">
          <p className="mb-3 text-sm text-tinta-3">Como os alunos vão ver</p>
          <article className="overflow-hidden rounded-cartao border border-linha bg-superficie shadow-elevado">
            <div className="relative aspect-[4/3] bg-superficie-2">
              {previa ? (
                <img src={previa} alt="" className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-tinta-3/60">
                  <Icone nome="image" tamanho={40} />
                </span>
              )}
              <span className="absolute top-3 left-3 rounded-full bg-superficie/95 px-2.5 py-1 shadow-elevado">
                <ValorMoedas valor={Number.isFinite(custo) && custo > 0 ? custo : 0} tamanho="sm" />
              </span>
            </div>
            <div className="p-5">
              <p className="text-[13px] text-tinta-3">{usuario?.nome}</p>
              <p className="mt-1 text-[17px] leading-snug font-semibold tracking-[-0.01em]">
                {valores.descricao.trim() || 'Descrição da vantagem'}
              </p>
              <span className={`${classeBotao('secundario')} pointer-events-none mt-5 w-full`}>
                Trocar por {Number.isFinite(custo) && custo > 0 ? custo : '–'} moedas
              </span>
            </div>
          </article>
        </aside>
      </div>
    </div>
  );
};
