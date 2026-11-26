// Estruturas de página: menu lateral para quem entrou e barra superior para visitantes.
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../../hooks/autenticacao/useAutenticacao';
import type { UsuarioLogado } from '../../tipos/autenticacao';
import { classeBotao, classeLinkNavegacao } from '../../utils/estilos';
import { NOME_DO_PERFIL, linksDoUsuario } from '../../utils/navegacao';
import { textoDoRodape } from '../../utils/rodape';
import { Avatar } from '../marca/Avatar';
import { Marca } from '../marca/Marca';
import { Icone } from '../icones/Icone';

// Links do perfil, com o ícone de cada área e destaque na rota atual.
const ListaDeLinks: React.FC<{ usuario: UsuarioLogado }> = ({ usuario }) => (
  <nav aria-label="Navegação principal" className="flex flex-col gap-0.5">
    {linksDoUsuario(usuario).map(({ para, rotulo, icone }) => (
      <NavLink
        key={para}
        to={para}
        end={para === '/'}
        className={({ isActive }) => classeLinkNavegacao(isActive)}
      >
        {({ isActive }) => (
          <>
            <Icone
              nome={icone}
              tamanho={20}
              className={isActive ? 'text-anil' : 'text-tinta-3 group-hover:text-tinta-2'}
            />
            {rotulo}
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

// Nome, perfil e o botão de sair, no rodapé do menu.
const CartaoDoUsuario: React.FC<{ usuario: UsuarioLogado; aoSair: () => void }> = ({
  usuario,
  aoSair,
}) => (
  <div className="flex items-center gap-3 rounded-controle border border-linha bg-superficie-2 p-2.5">
    <Avatar nome={usuario.nome} tamanho="sm" />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-tinta">{usuario.nome}</p>
      <p className="truncate text-xs text-tinta-3">{NOME_DO_PERFIL[usuario.tipo_usuario]}</p>
    </div>
    <button
      type="button"
      onClick={aoSair}
      title="Sair"
      aria-label="Sair"
      className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-tinta-3 transition hover:bg-tinta/5 hover:text-tinta"
    >
      <Icone nome="sign-out" tamanho={18} />
    </button>
  </div>
);

// Casca do sistema para quem entrou: menu lateral fixo no desktop e gaveta no celular.
export const EstruturaApp: React.FC<{ usuario: UsuarioLogado; children: React.ReactNode }> = ({
  usuario,
  children,
}) => {
  const { sair } = useAutenticacao();
  const navigate = useNavigate();
  const local = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => setMenuAberto(false), [local.pathname]);

  // Encerra a sessão e leva o usuário à tela de login.
  const aoSair = () => {
    navigate('/entrar');
    sair();
  };

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="hidden border-r border-linha bg-superficie lg:block">
        <aside className="sticky top-0 flex h-dvh flex-col px-4 pt-5 pb-4">
          <Link to="/" className="mb-8 px-2 no-underline">
            <Marca />
          </Link>
          <ListaDeLinks usuario={usuario} />
          <div className="mt-auto">
            <CartaoDoUsuario usuario={usuario} aoSair={aoSair} />
          </div>
        </aside>
      </div>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-linha bg-superficie/90 px-4 backdrop-blur-md lg:hidden">
        <Link to="/" className="no-underline">
          <Marca />
        </Link>
        <button
          type="button"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((v) => !v)}
          className="inline-flex size-10 cursor-pointer items-center justify-center rounded-controle text-tinta transition hover:bg-tinta/5"
        >
          <Icone nome={menuAberto ? 'x' : 'list'} tamanho={22} />
        </button>
      </header>
      {menuAberto && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-20 lg:hidden">
          <div
            className="absolute inset-0 animate-surgir bg-tinta/30"
            onClick={() => setMenuAberto(false)}
          />
          <div className="relative flex animate-subir flex-col gap-4 border-b border-linha bg-superficie p-4 shadow-elevado">
            <ListaDeLinks usuario={usuario} />
            <CartaoDoUsuario usuario={usuario} aoSair={aoSair} />
          </div>
        </div>
      )}

      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto w-full max-w-[1080px]">{children}</div>
      </main>
    </div>
  );
};

// Casca das páginas públicas: barra superior com a marca e as entradas de cada perfil.
export const EstruturaPublica: React.FC<{ children: React.ReactNode; largura?: string }> = ({
  children,
  largura = 'max-w-[1200px]',
}) => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-linha/70 bg-papel/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8">
          <Link to="/" className="no-underline">
            <Marca />
          </Link>
          <nav aria-label="Navegação principal" className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/cadastro/empresa"
              className="hidden h-10 items-center rounded-controle px-3 text-sm font-medium text-tinta-2 no-underline transition hover:text-tinta md:inline-flex"
            >
              Para empresas
            </NavLink>
            <NavLink
              to="/entrar/professor"
              className="hidden h-10 items-center rounded-controle px-3 text-sm font-medium text-tinta-2 no-underline transition hover:text-tinta md:inline-flex"
            >
              Sou professor
            </NavLink>
            <Link to="/entrar" className={`${classeBotao('fantasma')} max-sm:px-2.5`}>
              Entrar
            </Link>
            <Link to="/cadastro/aluno" className={`${classeBotao('primario')} max-sm:px-2.5`}>
              Criar conta
            </Link>
          </nav>
        </div>
      </header>
      <main className={`mx-auto w-full flex-1 px-4 py-10 sm:px-8 sm:py-14 ${largura}`}>
        {children}
      </main>
      <footer className="border-t border-linha">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-[13px] text-tinta-3 sm:px-8">
          <Marca />
          <span>{textoDoRodape(pathname)}</span>
        </div>
      </footer>
    </div>
  );
};
