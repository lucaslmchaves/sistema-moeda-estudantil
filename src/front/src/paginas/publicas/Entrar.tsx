// Página de login: entrada de aluno, professor e empresa parceira.
import React from 'react';
import { Link } from 'react-router-dom';
import { CabecalhoPagina } from '../../componentes/layout/CabecalhoPagina';
import { CampoFormulario } from '../../componentes/formulario/CampoFormulario';
import { Cartao } from '../../componentes/layout/Cartao';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { useAutenticacao } from '../../hooks/autenticacao/useAutenticacao';
import { useEntrar } from '../../hooks/autenticacao/useEntrar';
import { useMensagemNavegacao } from '../../hooks/geral/useMensagemNavegacao';
import { classeBotao } from '../../utils/estilos';

// Monta o formulário de login com os links para os cadastros.
export const Entrar: React.FC = () => {
  const form = useEntrar();
  const { mensagem, setMensagem } = useMensagemNavegacao();
  const { aviso, limparAviso } = useAutenticacao();
  const { valores, erros } = form;

  return (
    <div className="mx-auto max-w-xl">
      <CabecalhoPagina titulo="Entrar" descricao="Use o login e a senha do seu cadastro" />

      <MensagemAlerta
        tipo="sucesso"
        mensagem={mensagem ?? aviso}
        onFechar={() => {
          setMensagem(null);
          limparAviso();
        }}
      />
      <MensagemAlerta
        tipo="erro"
        mensagem={form.erroGeral}
        onFechar={() => form.setErroGeral(null)}
      />

      <Cartao>
        <form noValidate onSubmit={form.enviar}>
          <div className="mb-6 flex flex-col gap-5">
            <CampoFormulario
              id="login"
              rotulo="Login"
              valor={valores.login}
              onChange={(e) => form.alterarCampo('login', e.target.value)}
              erro={erros.login}
              placeholder="Ex: lucas.silva"
              obrigatorio
            />
            <CampoFormulario
              id="senha"
              rotulo="Senha"
              tipo="password"
              valor={valores.senha}
              onChange={(e) => form.alterarCampo('senha', e.target.value)}
              erro={erros.senha}
              obrigatorio
            />
          </div>
          <button
            type="submit"
            className={`${classeBotao('primario')} w-full`}
            disabled={form.salvando}
          >
            {form.salvando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </Cartao>

      <p className="text-center text-sm text-slate-500">
        Ainda não tem cadastro?{' '}
        <Link to="/cadastro/aluno" className="font-semibold text-indigo-600">
          Sou aluno
        </Link>{' '}
        ou{' '}
        <Link to="/cadastro/empresa" className="font-semibold text-indigo-600">
          Sou empresa parceira
        </Link>
        .
      </p>
    </div>
  );
};
