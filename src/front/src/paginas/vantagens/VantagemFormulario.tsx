// Página em que a empresa parceira cadastra uma vantagem com descrição, custo e foto.
import React from 'react';
import { Link } from 'react-router-dom';
import { CabecalhoPagina } from '../componentes/CabecalhoPagina';
import { CampoFormulario } from '../componentes/CampoFormulario';
import { Cartao } from '../componentes/Cartao';
import { MensagemAlerta } from '../componentes/MensagemAlerta';
import { useVantagemFormulario } from '../hooks/useVantagemFormulario';
import { CLASSE_ACOES_FORMULARIO, CLASSE_GRADE_FORMULARIO, classeBotao } from '../utils/estilos';

// Monta o formulário de vantagem, com a escolha da foto do produto.
export const VantagemFormulario: React.FC = () => {
  const form = useVantagemFormulario();
  const { valores, erros } = form;

  return (
    <div>
      <CabecalhoPagina
        titulo="Nova Vantagem"
        descricao="Informe a descrição, a foto do produto e o custo em moedas"
      >
        <Link to="/minhas-vantagens" className={classeBotao('secundario')}>
          Voltar para Lista
        </Link>
      </CabecalhoPagina>

      <MensagemAlerta
        tipo="erro"
        mensagem={form.erroGeral}
        onFechar={() => form.setErroGeral(null)}
      />

      <Cartao>
        <form noValidate onSubmit={form.enviar}>
          <div className={CLASSE_GRADE_FORMULARIO}>
            <CampoFormulario
              id="descricao"
              rotulo="Descrição"
              valor={valores.descricao}
              onChange={(e) => form.alterarCampo('descricao', e.target.value)}
              erro={erros.descricao}
              placeholder="Ex: Desconto de 20% no almoço"
              colunaCheia
              obrigatorio
            />
            <CampoFormulario
              id="custo"
              rotulo="Custo em moedas"
              tipo="number"
              valor={valores.custo}
              onChange={(e) => form.alterarCampo('custo', e.target.value)}
              erro={erros.custo}
              placeholder="Ex: 60"
              obrigatorio
            />
            <CampoFormulario
              id="foto"
              rotulo="Foto do produto"
              erro={erros.foto}
              dica="Formatos JPEG, PNG ou WebP, com até 2 MB."
              obrigatorio
            >
              <input
                id="foto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="text-sm"
                onChange={(e) => form.alterarCampo('foto', e.target.files?.[0] ?? null)}
                aria-invalid={Boolean(erros.foto)}
              />
            </CampoFormulario>
          </div>

          <div className={CLASSE_ACOES_FORMULARIO}>
            <Link to="/minhas-vantagens" className={classeBotao('secundario')}>
              Cancelar
            </Link>
            <button type="submit" className={classeBotao('primario')} disabled={form.salvando}>
              {form.salvando ? 'Salvando...' : 'Cadastrar Vantagem'}
            </button>
          </div>
        </form>
      </Cartao>
    </div>
  );
};
