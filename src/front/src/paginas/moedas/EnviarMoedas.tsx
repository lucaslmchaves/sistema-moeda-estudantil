// Página em que o professor envia moedas a um aluno, com o motivo do reconhecimento.
import React, { useMemo, useState } from 'react';
import { CabecalhoPagina } from '../../componentes/layout/CabecalhoPagina';
import { CampoFormulario } from '../../componentes/formulario/CampoFormulario';
import { Carregando } from '../../componentes/feedback/Carregando';
import { ChuvaDeMoedas } from '../../componentes/animacao/ChuvaDeMoedas';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { Icone } from '../../componentes/icones/Icone';
import { Avatar } from '../../componentes/marca/Avatar';
import { ValorMoedas } from '../../componentes/marca/Moedas';
import { useEnviarMoedas } from '../../hooks/moedas/useEnviarMoedas';
import { classeBotao, classeControle } from '../../utils/estilos';

const VALORES_RAPIDOS = [10, 25, 50, 100];
const LIMITE_MENSAGEM = 500;

function semAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Monta o formulário de envio: aluno, valor em moedas e mensagem obrigatória.
export const EnviarMoedas: React.FC = () => {
  const form = useEnviarMoedas();
  const { valores, erros } = form;
  const [busca, setBusca] = useState('');

  const alunosFiltrados = useMemo(() => {
    const termo = semAcentos(busca.trim());
    if (!termo) return form.alunos;
    return form.alunos.filter((a) => semAcentos(`${a.nome} ${a.curso}`).includes(termo));
  }, [busca, form.alunos]);

  if (form.carregandoAlunos) return <Carregando mensagem="Carregando alunos..." />;

  const escolhido = form.alunos.find((a) => a.id_usuario === valores.id_aluno);
  const valor = Number(valores.valor);
  const valorValido = Number.isFinite(valor) && valor > 0;
  const saldoDepois = form.saldo !== null && valorValido ? form.saldo - valor : null;
  const excede = saldoDepois !== null && saldoDepois < 0;

  return (
    <div>
      <CabecalhoPagina
        titulo="Enviar moedas"
        descricao="Reconheça um aluno e conte o motivo. Ele recebe um aviso por e-mail."
      />

      {form.sucesso && <ChuvaDeMoedas />}
      <MensagemAlerta
        tipo="sucesso"
        mensagem={form.sucesso}
        onFechar={() => form.setSucesso(null)}
      />
      <MensagemAlerta
        tipo="erro"
        mensagem={form.erroGeral ?? form.erroSaldo}
        onFechar={() => form.setErroGeral(null)}
      />

      <form
        noValidate
        onSubmit={form.enviar}
        className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="flex flex-col gap-6">
          <fieldset className="rounded-cartao border border-linha bg-superficie">
            <legend className="sr-only">Aluno</legend>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linha px-5 py-4 sm:px-6">
              <h2 className="text-[15px] font-semibold tracking-[-0.01em]">1. Escolha o aluno</h2>
              <div className="relative w-full sm:w-64">
                <Icone
                  nome="magnifying-glass"
                  tamanho={16}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-tinta-3"
                />
                <input
                  type="search"
                  aria-label="Buscar aluno por nome ou curso"
                  placeholder="Buscar por nome ou curso"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className={`${classeControle(false)} h-9 py-1.5 pl-9 text-sm`}
                />
              </div>
            </div>
            <div
              role="radiogroup"
              aria-label="Aluno"
              aria-invalid={Boolean(erros.id_aluno)}
              aria-describedby={erros.id_aluno ? 'id_aluno-erro' : undefined}
              className="max-h-[320px] overflow-y-auto p-2"
            >
              {alunosFiltrados.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-tinta-3">
                  Nenhum aluno encontrado.
                </p>
              ) : (
                alunosFiltrados.map((aluno) => {
                  const marcado = valores.id_aluno === aluno.id_usuario;
                  return (
                    <label
                      key={aluno.id_usuario}
                      className={`flex cursor-pointer items-center gap-3 rounded-controle px-3 py-2.5 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-anil ${
                        marcado ? 'bg-anil-100' : 'hover:bg-superficie-2'
                      }`}
                    >
                      <input
                        type="radio"
                        name="id_aluno"
                        className="sr-only"
                        checked={marcado}
                        onChange={() => form.alterarCampo('id_aluno', aluno.id_usuario)}
                      />
                      <Avatar nome={aluno.nome} tamanho="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-medium">{aluno.nome}</span>
                        <span className="block truncate text-[13px] text-tinta-3">
                          {aluno.curso}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`inline-flex size-5 items-center justify-center rounded-full border transition ${
                          marcado
                            ? 'border-anil bg-anil text-white'
                            : 'border-linha-forte bg-superficie'
                        }`}
                      >
                        {marcado && <Icone nome="check" tamanho={12} />}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
            {erros.id_aluno && (
              <p
                id="id_aluno-erro"
                role="alert"
                className="flex items-center gap-1.5 border-t border-linha px-6 py-3 text-[13px] font-medium text-negativo"
              >
                <Icone nome="warning-circle" tamanho={15} />
                {erros.id_aluno}
              </p>
            )}
          </fieldset>

          <section className="rounded-cartao border border-linha bg-superficie">
            <h2 className="border-b border-linha px-5 py-4 text-[15px] font-semibold tracking-[-0.01em] sm:px-6">
              2. Valor e motivo
            </h2>
            <div className="flex flex-col gap-6 p-5 sm:p-6">
              <CampoFormulario
                id="valor"
                rotulo="Quantidade de moedas"
                erro={erros.valor}
                obrigatorio
              >
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    id="valor"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    placeholder="0"
                    value={valores.valor}
                    onChange={(e) => form.alterarCampo('valor', e.target.value)}
                    aria-invalid={Boolean(erros.valor)}
                    aria-describedby={erros.valor ? 'valor-erro' : undefined}
                    className={`${classeControle(Boolean(erros.valor))} numeros max-w-36 text-lg font-medium`}
                  />
                  {VALORES_RAPIDOS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => form.alterarCampo('valor', String(v))}
                      aria-pressed={valores.valor === String(v)}
                      className={`numeros h-10 cursor-pointer rounded-full border px-4 text-sm font-medium transition ${
                        valores.valor === String(v)
                          ? 'border-tinta bg-tinta text-white'
                          : 'border-linha-forte text-tinta-2 hover:border-tinta-3 hover:text-tinta'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </CampoFormulario>

              <CampoFormulario
                id="mensagem"
                rotulo="Motivo do reconhecimento"
                erro={erros.mensagem}
                obrigatorio
              >
                <textarea
                  id="mensagem"
                  rows={4}
                  maxLength={LIMITE_MENSAGEM}
                  placeholder="Ex.: Apresentou o seminário com muita clareza e ajudou a turma nas dúvidas."
                  className={`${classeControle(Boolean(erros.mensagem))} resize-y leading-relaxed`}
                  value={valores.mensagem}
                  onChange={(e) => form.alterarCampo('mensagem', e.target.value)}
                  aria-invalid={Boolean(erros.mensagem)}
                  aria-describedby={erros.mensagem ? 'mensagem-erro' : 'mensagem-contador'}
                />
                <span id="mensagem-contador" className="numeros self-end text-xs text-tinta-3">
                  {valores.mensagem.length}/{LIMITE_MENSAGEM}
                </span>
              </CampoFormulario>
            </div>
          </section>
        </div>

        <aside className="rounded-cartao border border-linha bg-superficie p-6 lg:sticky lg:top-12">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Resumo</h2>
          <div className="mt-5 flex items-center gap-3 rounded-controle bg-superficie-2 p-3">
            {escolhido ? (
              <>
                <Avatar nome={escolhido.nome} tamanho="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{escolhido.nome}</p>
                  <p className="truncate text-xs text-tinta-3">{escolhido.curso}</p>
                </div>
              </>
            ) : (
              <p className="py-1.5 text-sm text-tinta-3">Nenhum aluno escolhido</p>
            )}
          </div>
          <dl className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-tinta-3">Seu saldo</dt>
              <dd>
                {form.saldo === null ? (
                  '–'
                ) : (
                  <ValorMoedas valor={form.saldo} tamanho="sm" semUnidade />
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-tinta-3">Envio</dt>
              <dd className="numeros font-semibold">{valorValido ? `−${valor}` : '–'}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-linha pt-3">
              <dt className="font-medium">Saldo depois</dt>
              <dd className={excede ? 'text-negativo' : ''}>
                {saldoDepois === null ? (
                  '–'
                ) : (
                  <ValorMoedas valor={saldoDepois} tamanho="md" semUnidade />
                )}
              </dd>
            </div>
          </dl>
          {excede && (
            <p className="mt-3 text-[13px] font-medium text-negativo">
              Saldo insuficiente para este valor.
            </p>
          )}
          <button
            type="submit"
            className={`${classeBotao('primario', 'grande')} mt-6 w-full`}
            disabled={form.salvando || excede}
          >
            {form.salvando ? 'Enviando...' : 'Enviar moedas'}
            {!form.salvando && <Icone nome="paper-plane-tilt" tamanho={18} />}
          </button>
        </aside>
      </form>
    </div>
  );
};
