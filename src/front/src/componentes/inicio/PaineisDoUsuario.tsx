// Painéis da página inicial de cada perfil logado.
import React from 'react';
import { Link } from 'react-router-dom';
import { urlDaApi } from '../../api/cliente';
import { listarMinhasVantagens, listarVantagens } from '../../api/vantagens';
import { Esqueleto } from '../feedback/Carregando';
import { EstadoVazio } from '../feedback/EstadoVazio';
import { MensagemAlerta } from '../feedback/MensagemAlerta';
import { Icone } from '../icones/Icone';
import { Avatar } from '../marca/Avatar';
import { ValorMoedas } from '../marca/Moedas';
import {
  CLASSE_BOTAO_CLARO,
  CLASSE_BOTAO_CONTORNO_CLARO,
  CartaoCarteira,
} from '../moedas/CartaoCarteira';
import { ListaMovimentacoes } from '../moedas/ListaMovimentacoes';
import { useExtrato } from '../../hooks/moedas/useExtrato';
import { useVantagens } from '../../hooks/moedas/useVantagens';
import type { UsuarioLogado } from '../../tipos/autenticacao';
import type { Vantagem } from '../../tipos/vantagem';
import { classeBotao } from '../../utils/estilos';
import { alunosRecentes, totaisDoExtrato } from '../../utils/extrato';
import { NOME_DO_PERFIL } from '../../utils/navegacao';

const NUMERO = new Intl.NumberFormat('pt-BR');
const HOJE = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

// Cabeçalho do painel: saudação pelo primeiro nome e a data de hoje.
export const Saudacao: React.FC<{ usuario: UsuarioLogado }> = ({ usuario }) => {
  const primeiroNome =
    usuario.tipo_usuario === 'EMPRESA_PARCEIRA' ? usuario.nome : usuario.nome.split(' ')[0];
  const hoje = HOJE.format(new Date());
  return (
    <div className="mb-8">
      <p className="text-sm text-tinta-3 first-letter:uppercase">{hoje}</p>
      <h1 className="titulo-display mt-1 text-[32px] sm:text-[40px]">Olá, {primeiroNome}</h1>
    </div>
  );
};

// Painel com título, link para a página completa e conteúdo.
const Painel: React.FC<{
  titulo: string;
  link?: { para: string; rotulo: string };
  children: React.ReactNode;
  className?: string;
}> = ({ titulo, link, children, className = '' }) => (
  <section
    className={`flex flex-col rounded-cartao border border-linha bg-superficie ${className}`}
  >
    <div className="flex items-center justify-between gap-4 border-b border-linha px-5 py-4 sm:px-6">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{titulo}</h2>
      {link && (
        <Link
          to={link.para}
          className="inline-flex items-center gap-1 text-sm font-medium text-tinta-3 no-underline transition hover:text-tinta"
        >
          {link.rotulo}
          <Icone nome="arrow-right" tamanho={14} />
        </Link>
      )}
    </div>
    <div className="flex-1">{children}</div>
  </section>
);

const LinhasCarregando: React.FC<{ quantidade?: number }> = ({ quantidade = 3 }) => (
  <div className="flex flex-col gap-4 p-6">
    {Array.from({ length: quantidade }, (_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Esqueleto className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Esqueleto className="h-3.5 w-1/2" />
          <Esqueleto className="h-3 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

// Linha compacta de vantagem, inteira clicável: foto, descrição, empresa e custo.
const LinhaVantagem: React.FC<{
  vantagem: Vantagem;
  para: string;
  estado?: unknown;
  mostrarEmpresa?: boolean;
}> = ({ vantagem, para, estado, mostrarEmpresa = true }) => (
  <li>
    <Link
      to={para}
      state={estado}
      className="group/linha flex items-center gap-4 px-5 py-3.5 text-tinta no-underline transition-colors hover:bg-anil-50 sm:px-6"
    >
      <img
        src={urlDaApi(vantagem.foto)}
        alt=""
        className="size-14 shrink-0 rounded-xl bg-superficie-2 object-cover transition-transform duration-500 ease-saida group-hover/linha:scale-110"
        loading="lazy"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium">{vantagem.descricao}</span>
        {mostrarEmpresa && (
          <span className="block truncate text-sm text-tinta-3">{vantagem.nome_empresa}</span>
        )}
      </span>
      <ValorMoedas valor={vantagem.custo} tamanho="sm" semUnidade />
      <Icone
        nome="arrow-right"
        tamanho={16}
        className="text-tinta-3 transition group-hover/linha:translate-x-1 group-hover/linha:text-anil"
      />
    </Link>
  </li>
);

export const PainelAluno: React.FC<{ usuario: UsuarioLogado }> = ({ usuario }) => {
  const { extrato, erro, setErro } = useExtrato();
  const vantagens = useVantagens(listarVantagens);
  const totais = extrato ? totaisDoExtrato(extrato.transacoes) : null;
  const saldo = extrato?.saldo ?? null;
  const alcance = vantagens
    ? [...vantagens]
        .sort((a, b) => a.custo - b.custo)
        .filter((v) => saldo === null || v.custo <= saldo)
    : null;

  return (
    <>
      <MensagemAlerta tipo="erro" mensagem={erro} onFechar={() => setErro(null)} />
      <div className="cascata grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <CartaoCarteira
          rotulo="Seu saldo"
          saldo={saldo}
          titular={usuario.nome}
          perfil={NOME_DO_PERFIL[usuario.tipo_usuario]}
          detalhes={
            totais
              ? [
                  {
                    rotulo: 'Recebidas',
                    valor: (
                      <ValorMoedas
                        valor={totais.entradas}
                        tamanho="lg"
                        sinal
                        semUnidade
                        fundoEscuro
                      />
                    ),
                  },
                  {
                    rotulo: 'Trocadas',
                    valor: (
                      <ValorMoedas
                        valor={-totais.saidas}
                        tamanho="lg"
                        sinal
                        semUnidade
                        fundoEscuro
                      />
                    ),
                  },
                ]
              : []
          }
        >
          <Link to="/vantagens" className={CLASSE_BOTAO_CLARO}>
            <Icone nome="gift" tamanho={16} />
            Trocar moedas
          </Link>
        </CartaoCarteira>

        <Painel titulo="Dá para trocar agora" link={{ para: '/vantagens', rotulo: 'Ver todas' }}>
          {alcance === null ? (
            <LinhasCarregando />
          ) : alcance.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-tinta-3">
              Nenhuma vantagem cabe no seu saldo ainda. Continue participando das aulas.
            </p>
          ) : (
            <ul className="divide-y divide-linha">
              {alcance.slice(0, 4).map((v) => (
                <LinhaVantagem
                  key={v.id_vantagem}
                  vantagem={v}
                  para="/vantagens"
                  estado={{ vantagem: v.id_vantagem }}
                />
              ))}
            </ul>
          )}
        </Painel>
      </div>

      <Painel
        className="mt-6"
        titulo="Últimas movimentações"
        link={{ para: '/extrato', rotulo: 'Extrato completo' }}
      >
        {!extrato ? (
          <LinhasCarregando />
        ) : extrato.transacoes.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-tinta-3">
            Quando um professor enviar moedas para você, elas aparecem aqui.
          </p>
        ) : (
          <ListaMovimentacoes transacoes={extrato.transacoes.slice(0, 5)} />
        )}
      </Painel>
    </>
  );
};

export const PainelProfessor: React.FC<{ usuario: UsuarioLogado }> = ({ usuario }) => {
  const { extrato, erro, setErro } = useExtrato();
  const totais = extrato ? totaisDoExtrato(extrato.transacoes) : null;
  const alunosReconhecidos = extrato
    ? new Set(extrato.transacoes.filter((t) => t.valor < 0).map((t) => t.descricao.split(':')[0]))
        .size
    : 0;
  const recentes = extrato ? alunosRecentes(extrato.transacoes) : [];

  return (
    <>
      <MensagemAlerta tipo="erro" mensagem={erro} onFechar={() => setErro(null)} />
      <div className="cascata grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <CartaoCarteira
          rotulo="Saldo para distribuir"
          saldo={extrato?.saldo ?? null}
          titular={usuario.nome}
          perfil={NOME_DO_PERFIL[usuario.tipo_usuario]}
          detalhes={
            totais
              ? [
                  {
                    rotulo: 'Já enviadas',
                    valor: (
                      <ValorMoedas
                        valor={-totais.saidas}
                        tamanho="lg"
                        sinal
                        semUnidade
                        fundoEscuro
                      />
                    ),
                  },
                  { rotulo: 'Alunos reconhecidos', valor: NUMERO.format(alunosReconhecidos) },
                ]
              : []
          }
        >
          <Link to="/enviar-moedas" className={CLASSE_BOTAO_CLARO}>
            <Icone nome="paper-plane-tilt" tamanho={16} />
            Enviar moedas
          </Link>
        </CartaoCarteira>

        <Painel titulo="Últimos reconhecimentos" link={{ para: '/extrato', rotulo: 'Extrato' }}>
          {!extrato ? (
            <LinhasCarregando />
          ) : extrato.transacoes.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <p className="text-sm text-tinta-3">Você ainda não enviou moedas neste semestre.</p>
              <Link to="/enviar-moedas" className={`${classeBotao('secundario')} mt-4`}>
                Reconhecer um aluno
              </Link>
            </div>
          ) : (
            <ListaMovimentacoes transacoes={extrato.transacoes.slice(0, 5)} />
          )}
        </Painel>
      </div>

      {recentes.length > 0 && (
        <Painel className="mt-6" titulo="Reconhecer de novo">
          <ul className="cascata grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentes.map((aluno) => (
              <li key={aluno.nome} className="flex">
                <Link
                  to="/enviar-moedas"
                  state={{ aluno: aluno.nome }}
                  className="elevar group flex w-full items-center gap-3 rounded-controle border border-linha p-3 text-tinta no-underline"
                >
                  <Avatar nome={aluno.nome} tamanho="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{aluno.nome}</span>
                    <span className="block truncate text-xs text-tinta-3">{aluno.motivo}</span>
                  </span>
                  <Icone
                    nome="paper-plane-tilt"
                    tamanho={16}
                    className="text-tinta-3 transition group-hover:translate-x-0.5 group-hover:text-anil"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Painel>
      )}
    </>
  );
};

export const PainelEmpresa: React.FC<{ usuario: UsuarioLogado }> = ({ usuario }) => {
  const vantagens = useVantagens(listarMinhasVantagens);

  return (
    <div className="cascata grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="relative isolate flex flex-col overflow-hidden rounded-[20px] bg-linear-to-br from-anil-escuro to-anil-fundo p-6 text-white shadow-flutuante sm:p-8">
        <span className="text-base text-white/80">Vantagens no catálogo</span>
        <p className="numeros mt-6 mb-8 text-6xl font-normal tracking-[-0.04em]">
          {vantagens === null ? '–' : vantagens.length}
        </p>
        <p className="mb-8 max-w-xs text-base leading-relaxed text-white/70">
          Os alunos veem as suas vantagens no catálogo e podem trocá-las por moedas.
        </p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-medium">{usuario.nome}</p>
            <p className="text-sm text-white/70">{NOME_DO_PERFIL[usuario.tipo_usuario]}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/minhas-vantagens" className={CLASSE_BOTAO_CONTORNO_CLARO}>
              Gerenciar
            </Link>
            <Link to="/minhas-vantagens/nova" className={CLASSE_BOTAO_CLARO}>
              <Icone nome="plus" tamanho={16} />
              Nova vantagem
            </Link>
          </div>
        </div>
      </section>

      <Painel titulo="Suas vantagens" link={{ para: '/minhas-vantagens', rotulo: 'Ver todas' }}>
        {vantagens === null ? (
          <LinhasCarregando />
        ) : vantagens.length === 0 ? (
          <div className="p-4">
            <EstadoVazio
              icone="gift"
              titulo="Nenhuma vantagem ainda"
              mensagem="Cadastre a primeira para ela aparecer no catálogo dos alunos."
            >
              <Link to="/minhas-vantagens/nova" className={classeBotao('primario')}>
                Cadastrar vantagem
              </Link>
            </EstadoVazio>
          </div>
        ) : (
          <ul className="divide-y divide-linha">
            {vantagens.slice(0, 5).map((v) => (
              <LinhaVantagem
                key={v.id_vantagem}
                vantagem={v}
                para="/minhas-vantagens"
                mostrarEmpresa={false}
              />
            ))}
          </ul>
        )}
      </Painel>
    </div>
  );
};
