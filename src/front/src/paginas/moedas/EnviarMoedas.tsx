// Página em que o professor envia moedas a um aluno, com o motivo do reconhecimento.
import React from 'react';
import { CabecalhoPagina } from '../../componentes/layout/CabecalhoPagina';
import { CampoFormulario } from '../../componentes/formulario/CampoFormulario';
import { Cartao } from '../../componentes/layout/Cartao';
import { Carregando } from '../../componentes/feedback/Carregando';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { SelectFormulario } from '../../componentes/formulario/SelectFormulario';
import { useEnviarMoedas } from '../../hooks/moedas/useEnviarMoedas';
import { CLASSE_ACOES_FORMULARIO, classeBotao, classeControle } from '../../utils/estilos';
import { formatarMoedas } from '../../utils/formatacao';

// Monta o formulário de envio: aluno, valor em moedas e mensagem obrigatória.
export const EnviarMoedas: React.FC = () => {
  const form = useEnviarMoedas();
  const { valores, erros } = form;

  if (form.carregandoAlunos) return <Carregando mensagem="Carregando alunos..." />;

  return (
    <div>
      <CabecalhoPagina
        titulo="Enviar Moedas"
        descricao={
          form.saldo === null
            ? 'Reconheça um aluno com moedas'
            : `Reconheça um aluno com moedas. Seu saldo: ${formatarMoedas(form.saldo)}`
        }
      />

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

      <Cartao>
        <form noValidate onSubmit={form.enviar}>
          <div className="mb-6 flex flex-col gap-5">
            <SelectFormulario
              id="id_aluno"
              rotulo="Aluno"
              valor={valores.id_aluno}
              opcoes={form.alunos.map((a) => ({
                valor: a.id_usuario,
                rotulo: `${a.nome} — ${a.curso}`,
              }))}
              textoPadrao="Selecione o aluno..."
              onChange={(valor) => form.alterarCampo('id_aluno', valor)}
              erro={erros.id_aluno}
              obrigatorio
            />
            <CampoFormulario
              id="valor"
              rotulo="Quantidade de moedas"
              tipo="number"
              valor={valores.valor}
              onChange={(e) => form.alterarCampo('valor', e.target.value)}
              erro={erros.valor}
              placeholder="Ex: 50"
              obrigatorio
            />
            <CampoFormulario
              id="mensagem"
              rotulo="Motivo do reconhecimento"
              erro={erros.mensagem}
              dica="Conte ao aluno por que ele está sendo reconhecido."
              obrigatorio
            >
              <textarea
                id="mensagem"
                rows={4}
                className={classeControle(Boolean(erros.mensagem))}
                value={valores.mensagem}
                onChange={(e) => form.alterarCampo('mensagem', e.target.value)}
                aria-invalid={Boolean(erros.mensagem)}
              />
            </CampoFormulario>
          </div>
          <div className={CLASSE_ACOES_FORMULARIO}>
            <button type="submit" className={classeBotao('primario')} disabled={form.salvando}>
              {form.salvando ? 'Enviando...' : 'Enviar moedas'}
            </button>
          </div>
        </form>
      </Cartao>
    </div>
  );
};
