// Página de login: entrada de aluno, professor e empresa parceira.
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MoedaDourada } from '../../componentes/animacao/MoedaDourada';
import { MuralDeMensagens } from '../../componentes/animacao/MuralDeMensagens';
import { CampoFormulario } from '../../componentes/formulario/CampoFormulario';
import { CampoSenha } from '../../componentes/formulario/CampoSenha';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { Icone } from '../../componentes/icones/Icone';
import { Marca } from '../../componentes/marca/Marca';
import { useAutenticacao } from '../../hooks/autenticacao/useAutenticacao';
import { useEntrar } from '../../hooks/autenticacao/useEntrar';
import { useMensagemNavegacao } from '../../hooks/geral/useMensagemNavegacao';
import { classeBotao } from '../../utils/estilos';

interface EntrarProps {
  perfil?: 'professor';
}

const CLASSE_ABA =
  'flex h-9 flex-1 items-center justify-center rounded-lg text-sm font-medium no-underline transition';

// Lado ilustrado da tela: a chamada e o mural de reconhecimentos chegando.
const PainelLateral: React.FC<{ professor: boolean }> = ({ professor }) => (
  <div
    aria-hidden="true"
    className="relative isolate hidden overflow-hidden rounded-[28px] bg-linear-to-br from-anil-escuro to-anil-fundo lg:flex lg:flex-col lg:justify-between lg:gap-8 lg:p-12"
  >
    <MoedaDourada className="animate-flutuar absolute top-12 right-12 -z-10 size-24 drop-shadow-2xl" />
    <MoedaDourada className="animate-flutuar absolute top-48 right-44 -z-10 size-12 opacity-90 [animation-delay:-2.5s]" />
    <p className="titulo-display max-w-[14ch] text-[44px] text-white">
      {professor ? (
        <>
          Reconheça quem <em className="font-serif font-normal text-ouro-300">se destaca</em>.
        </>
      ) : (
        <>
          Cada conquista em sala <em className="font-serif font-normal text-ouro-300">conta</em>.
        </>
      )}
    </p>
    <MuralDeMensagens />
  </div>
);

// Monta o formulário de login; no acesso do professor, explica que o cadastro já existe.
export const Entrar: React.FC<EntrarProps> = ({ perfil }) => {
  const professor = perfil === 'professor';
  const form = useEntrar(perfil);
  const { mensagem, setMensagem } = useMensagemNavegacao();
  const { aviso, limparAviso, usuario } = useAutenticacao();
  const { valores, erros } = form;

  return (
    <div
      className={`grid gap-6 ${usuario ? '' : 'min-h-dvh p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'}`}
    >
      <div className="flex flex-col px-3 py-4 sm:px-8 lg:px-12">
        {!usuario && (
          <Link to="/" className="self-start no-underline">
            <Marca />
          </Link>
        )}

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">
          <h1 className="titulo-display text-[40px]">
            {professor ? 'Entrar como professor' : 'Entrar'}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-tinta-3">
            {professor
              ? 'Use o login e a senha que você recebeu da instituição.'
              : 'Use o login e a senha do seu cadastro.'}
          </p>

          <div
            role="navigation"
            aria-label="Tipo de acesso"
            className="mt-8 flex gap-1 rounded-controle border border-linha bg-superficie-2 p-1"
          >
            <NavLink
              to="/entrar"
              end
              className={({ isActive }) =>
                `${CLASSE_ABA} ${isActive ? 'bg-superficie text-tinta shadow-elevado' : 'text-tinta-3 hover:text-tinta'}`
              }
            >
              Aluno ou empresa
            </NavLink>
            <NavLink
              to="/entrar/professor"
              className={({ isActive }) =>
                `${CLASSE_ABA} ${isActive ? 'bg-superficie text-tinta shadow-elevado' : 'text-tinta-3 hover:text-tinta'}`
              }
            >
              Professor
            </NavLink>
          </div>

          <div className="mt-8">
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

            <form noValidate onSubmit={form.enviar} className="flex flex-col gap-5">
              <CampoFormulario
                id="login"
                rotulo="Login"
                valor={valores.login}
                onChange={(e) => form.alterarCampo('login', e.target.value)}
                erro={erros.login}
                placeholder={professor ? 'prof.nome' : 'seu.login'}
                autoComplete="username"
              />
              <CampoSenha
                id="senha"
                rotulo="Senha"
                valor={valores.senha}
                onChange={(e) => form.alterarCampo('senha', e.target.value)}
                erro={erros.senha}
                autoComplete="current-password"
              />
              <button
                type="submit"
                className={`${classeBotao('primario', 'grande')} mt-2 w-full`}
                disabled={form.salvando}
              >
                {form.salvando ? 'Entrando...' : 'Entrar'}
                {!form.salvando && <Icone nome="arrow-right" tamanho={18} />}
              </button>
            </form>
          </div>

          {!professor && (
            <div className="mt-10 border-t border-linha pt-6 text-sm text-tinta-3">
              <p className="mb-3">Ainda não tem cadastro?</p>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/cadastro/aluno" className={classeBotao('secundario')}>
                  <Icone nome="graduation-cap" tamanho={16} />
                  Sou aluno
                </Link>
                <Link to="/cadastro/empresa" className={classeBotao('secundario')}>
                  <Icone nome="storefront" tamanho={16} />
                  Sou empresa
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {!usuario && <PainelLateral professor={professor} />}
    </div>
  );
};
