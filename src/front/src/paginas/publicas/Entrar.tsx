// Página de login: entrada de aluno, professor e empresa parceira.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { tituloDaRota } from '../../utils/titulos';

interface EntrarProps {
  perfil?: 'professor';
}

const ABAS = [
  { professor: false, rotulo: 'Aluno ou empresa' },
  { professor: true, rotulo: 'Professor' },
];

// Os dois conteúdos ocupam o mesmo lugar, para nada pular na troca de perfil.
const classeAlternada = (visivel: boolean) =>
  `col-start-1 row-start-1 transition-[opacity,visibility] duration-300 ${
    visivel ? 'visible opacity-100' : 'invisible opacity-0'
  }`;

// Seletor do tipo de acesso, com o destaque deslizando de um lado para o outro.
const SeletorDePerfil: React.FC<{
  professor: boolean;
  aoEscolher: (professor: boolean) => void;
}> = ({ professor, aoEscolher }) => (
  <div
    role="group"
    aria-label="Tipo de acesso"
    className="relative mt-8 grid grid-cols-2 rounded-controle border border-linha bg-superficie-2 p-1"
  >
    <span
      aria-hidden="true"
      className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-superficie shadow-elevado transition-transform duration-300 ease-saida ${
        professor ? 'translate-x-full' : ''
      }`}
    />
    {ABAS.map((aba) => (
      <button
        key={aba.rotulo}
        type="button"
        aria-pressed={professor === aba.professor}
        onClick={() => aoEscolher(aba.professor)}
        className={`relative h-9 cursor-pointer rounded-lg text-sm font-medium transition-colors duration-300 ${
          professor === aba.professor ? 'text-tinta' : 'text-tinta-3 hover:text-tinta'
        }`}
      >
        {aba.rotulo}
      </button>
    ))}
  </div>
);

// Lado ilustrado da tela: a chamada e o mural de reconhecimentos chegando.
const PainelLateral: React.FC<{ professor: boolean }> = ({ professor }) => (
  <div
    aria-hidden="true"
    className="relative isolate hidden overflow-hidden rounded-[28px] bg-linear-to-br from-anil-escuro to-anil-fundo lg:flex lg:flex-col lg:justify-between lg:gap-8 lg:p-12"
  >
    <MoedaDourada className="animate-flutuar absolute top-12 right-12 -z-10 size-24 drop-shadow-2xl" />
    <MoedaDourada className="animate-flutuar absolute top-48 right-44 -z-10 size-12 opacity-90 [animation-delay:-2.5s]" />
    <p
      key={String(professor)}
      className="titulo-display min-h-[2.1em] max-w-[14ch] animate-surgir text-[44px] text-white"
    >
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

// Monta o formulário de login. O endereço define só o perfil que chega marcado; trocar de
// perfil acontece na própria página, sem navegar e sem apagar o que foi digitado.
export const Entrar: React.FC<EntrarProps> = ({ perfil }) => {
  const [professor, setProfessor] = useState(perfil === 'professor');
  const form = useEntrar(professor ? 'professor' : undefined);
  const { mensagem, setMensagem } = useMensagemNavegacao();
  const { aviso, limparAviso, usuario } = useAutenticacao();
  const { valores, erros } = form;

  useEffect(() => {
    document.title = tituloDaRota(professor ? '/entrar/professor' : '/entrar');
  }, [professor]);

  const escolher = (novo: boolean) => {
    setProfessor(novo);
    form.setErroGeral(null);
  };

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
          <h1 className="titulo-display text-[40px]">Entrar</h1>
          <p className="mt-2 grid text-[15px] leading-relaxed text-tinta-3">
            <span className={classeAlternada(!professor)}>
              Use o login e a senha do seu cadastro.
            </span>
            <span className={classeAlternada(professor)}>
              Use o login e a senha que você recebeu da instituição.
            </span>
          </p>

          <SeletorDePerfil professor={professor} aoEscolher={escolher} />

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

          <div className="mt-10 grid border-t border-linha pt-6 text-sm text-tinta-3">
            <div className={classeAlternada(!professor)}>
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
            <div className={`${classeAlternada(professor)} flex items-start gap-3`}>
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-anil-100 text-anil">
                <Icone nome="chalkboard-teacher" tamanho={18} />
              </span>
              <p className="leading-relaxed">
                Professores já vêm cadastrados pela instituição, por isso não é preciso criar conta.
              </p>
            </div>
          </div>
        </div>
      </div>

      {!usuario && <PainelLateral professor={professor} />}
    </div>
  );
};
