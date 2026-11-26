// Página de login: entrada de aluno, professor e empresa parceira.
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CampoFormulario } from '../../componentes/formulario/CampoFormulario';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { Icone } from '../../componentes/icones/Icone';
import { Avatar } from '../../componentes/marca/Avatar';
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

// Lado ilustrado da tela: reconhecimentos reais do jeito que aparecem no extrato.
const PainelLateral: React.FC<{ professor: boolean }> = ({ professor }) => {
  const exemplos = [
    { de: 'Ana Paula Souza', valor: 80, motivo: 'Ajudou os colegas na monitoria de Cálculo.' },
    {
      de: 'Marcos Vinicius Pereira',
      valor: 150,
      motivo: 'Melhor nota da turma na prova de Algoritmos.',
    },
    {
      de: 'Carlos Eduardo Silva',
      valor: 30,
      motivo: 'Pontualidade em todas as entregas do semestre.',
    },
  ];
  return (
    <div
      aria-hidden="true"
      className="relative hidden overflow-hidden rounded-[28px] bg-lavanda-100 lg:flex lg:flex-col lg:justify-between lg:p-12"
    >
      <p className="titulo-display max-w-[14ch] text-[44px] text-tinta">
        {professor ? (
          <>
            Reconheça quem <em className="font-serif font-normal text-violeta">se destaca</em>.
          </>
        ) : (
          <>
            Cada conquista em sala <em className="font-serif font-normal text-violeta">conta</em>.
          </>
        )}
      </p>
      <ul className="flex flex-col gap-3">
        {exemplos.map((e, i) => (
          <li
            key={e.de}
            className="flex items-start gap-3 rounded-2xl bg-superficie p-4 shadow-elevado"
            style={{ marginLeft: `${i * 28}px`, marginRight: `${(2 - i) * 28}px` }}
          >
            <Avatar nome={e.de} tamanho="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-medium">
                  Prof. {e.de.split(' ').slice(0, 2).join(' ')}
                </p>
                <span className="numeros text-sm font-semibold text-positivo">+{e.valor}</span>
              </div>
              <p className="mt-0.5 text-[13px] leading-snug text-tinta-2">{e.motivo}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

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
              <CampoFormulario
                id="senha"
                rotulo="Senha"
                tipo="password"
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
