// Página inicial: apresenta o sistema ao visitante e o painel do perfil ao usuário logado.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { urlDaApi } from '../../api/cliente';
import { listarMinhasVantagens, listarVantagens } from '../../api/vantagens';
import { Esqueleto } from '../../componentes/feedback/Carregando';
import { EstadoVazio } from '../../componentes/feedback/EstadoVazio';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { Icone, type NomeIcone } from '../../componentes/icones/Icone';
import { Avatar } from '../../componentes/marca/Avatar';
import { SimboloMarca } from '../../componentes/marca/Marca';
import { ValorMoedas } from '../../componentes/marca/Moedas';
import {
  CLASSE_BOTAO_CLARO,
  CLASSE_BOTAO_CONTORNO_CLARO,
  CartaoCarteira,
} from '../../componentes/moedas/CartaoCarteira';
import { ListaMovimentacoes } from '../../componentes/moedas/ListaMovimentacoes';
import { useAutenticacao } from '../../hooks/autenticacao/useAutenticacao';
import { useExtrato } from '../../hooks/moedas/useExtrato';
import { useMensagemNavegacao } from '../../hooks/geral/useMensagemNavegacao';
import type { UsuarioLogado } from '../../tipos/autenticacao';
import type { Vantagem } from '../../tipos/vantagem';
import { classeBotao } from '../../utils/estilos';
import { totaisDoExtrato } from '../../utils/extrato';
import { NOME_DO_PERFIL } from '../../utils/navegacao';

const NUMERO = new Intl.NumberFormat('pt-BR');
const HOJE = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

// ---------- Visitante ----------

interface Papel {
  icone: NomeIcone;
  nome: string;
  texto: string;
  para: string;
  acao: string;
}

const PAPEIS: Papel[] = [
  {
    icone: 'chalkboard-teacher',
    nome: 'Professor',
    texto:
      'Recebe 1.000 moedas por semestre e envia aos alunos, sempre com o motivo do reconhecimento. O saldo que sobra se acumula.',
    para: '/entrar/professor',
    acao: 'Entrar como professor',
  },
  {
    icone: 'graduation-cap',
    nome: 'Aluno',
    texto:
      'Recebe moedas por mérito, acompanha o extrato e troca o saldo por vantagens. O cupom chega por e-mail.',
    para: '/cadastro/aluno',
    acao: 'Criar conta de aluno',
  },
  {
    icone: 'storefront',
    nome: 'Empresa parceira',
    texto:
      'Oferece produtos e descontos com foto e custo em moedas, e recebe o código de cada troca para conferir.',
    para: '/cadastro/empresa',
    acao: 'Cadastrar empresa',
  },
];

// Composição ilustrativa do produto: a carteira, um reconhecimento e um cupom.
const VitrineDoProduto: React.FC = () => (
  <div
    aria-hidden="true"
    className="relative mx-auto w-full max-w-[520px] rounded-[28px] bg-lavanda-100 p-6 pt-10 pb-24 sm:p-10 sm:pb-28"
  >
    <div className="relative rounded-[20px] bg-tinta p-6 text-white shadow-flutuante sm:p-7">
      <div className="flex items-center justify-between text-sm text-white/70">
        Saldo
        <SimboloMarca tamanho={24} />
      </div>
      <div className="mt-5 mb-8">
        <ValorMoedas valor={1240} tamanho="xl" />
      </div>
      <div className="flex items-end justify-between text-sm">
        <div>
          <p className="font-medium">Beatriz Andrade</p>
          <p className="text-xs text-white/60">Engenharia de Software</p>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80">Aluno</span>
      </div>
    </div>

    <div className="absolute right-4 -bottom-6 left-10 rounded-2xl bg-superficie p-4 shadow-elevado sm:right-auto sm:-left-8 sm:w-[340px]">
      <div className="flex items-start gap-3">
        <Avatar nome="Carlos Eduardo Silva" tamanho="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium">Prof. Carlos Eduardo</p>
            <span className="numeros text-sm font-semibold text-positivo">+120</span>
          </div>
          <p className="mt-0.5 text-[13px] leading-snug text-tinta-2">
            Apresentação impecável do projeto de Engenharia de Requisitos.
          </p>
        </div>
      </div>
    </div>

    <div className="absolute -top-5 right-4 hidden items-center gap-3 rounded-2xl bg-superficie py-3 pr-4 pl-3 shadow-elevado sm:flex sm:-right-6">
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-aviso-fundo text-aviso">
        <Icone nome="ticket" tamanho={18} />
      </span>
      <div>
        <p className="text-sm font-medium">Café + pão de queijo</p>
        <p className="font-mono text-xs tracking-wider text-tinta-3">LTWVGBZ2</p>
      </div>
    </div>
  </div>
);

const InicioVisitante: React.FC = () => (
  <div className="flex flex-col gap-24 sm:gap-32">
    <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
      <div className="animate-subir">
        <h1 className="titulo-display max-w-[11ch] text-[52px] sm:text-[72px]">
          Mérito em sala vira{' '}
          <em className="font-serif font-normal tracking-[-0.01em] text-violeta">moeda</em>.
        </h1>
        <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-tinta-2">
          Professores reconhecem os alunos com moedas virtuais. Os alunos trocam o saldo por
          produtos e descontos de empresas parceiras.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/cadastro/aluno" className={classeBotao('primario', 'grande')}>
            Criar conta de aluno
            <Icone nome="arrow-right" tamanho={18} />
          </Link>
          <Link to="/entrar" className={classeBotao('secundario', 'grande')}>
            Já tenho conta
          </Link>
        </div>
        <p className="mt-6 text-sm text-tinta-3">
          É professor?{' '}
          <Link to="/entrar/professor" className="font-medium text-tinta underline">
            Entre com o login da instituição
          </Link>
        </p>
      </div>
      <VitrineDoProduto />
    </section>

    <section aria-labelledby="como-funciona">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 id="como-funciona" className="titulo-display max-w-[16ch] text-4xl sm:text-5xl">
          Três papéis, <em className="font-serif font-normal">uma</em> moeda.
        </h2>
        <p className="max-w-sm text-[15px] leading-relaxed text-tinta-3">
          Cada perfil tem a sua área. Alunos e empresas criam a conta; professores já vêm
          cadastrados pela instituição.
        </p>
      </div>
      <ol className="grid overflow-hidden rounded-cartao border border-linha bg-superficie md:grid-cols-3">
        {PAPEIS.map((papel, i) => (
          <li
            key={papel.nome}
            className={`flex flex-col p-7 sm:p-8 ${i > 0 ? 'border-t border-linha md:border-t-0 md:border-l' : ''}`}
          >
            <span className="mb-8 inline-flex size-11 items-center justify-center rounded-full bg-lavanda-100 text-violeta">
              <Icone nome={papel.icone} tamanho={22} />
            </span>
            <h3 className="text-xl font-semibold tracking-[-0.02em]">{papel.nome}</h3>
            <p className="mt-2 mb-8 text-[15px] leading-relaxed text-tinta-2">{papel.texto}</p>
            <Link
              to={papel.para}
              className="group mt-auto inline-flex items-center gap-2 text-sm font-medium text-tinta no-underline"
            >
              {papel.acao}
              <Icone
                nome="arrow-right"
                tamanho={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  </div>
);

// ---------- Painéis ----------

// Cabeçalho do painel: saudação pelo primeiro nome e a data de hoje.
const Saudacao: React.FC<{ usuario: UsuarioLogado }> = ({ usuario }) => {
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

// Linha compacta de vantagem: foto, descrição, empresa e custo.
const LinhaVantagem: React.FC<{ vantagem: Vantagem; mostrarEmpresa?: boolean }> = ({
  vantagem,
  mostrarEmpresa = true,
}) => (
  <li className="flex items-center gap-4 px-5 py-3.5 sm:px-6">
    <img
      src={urlDaApi(vantagem.foto)}
      alt=""
      className="size-14 shrink-0 rounded-xl bg-superficie-2 object-cover"
      loading="lazy"
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-[15px] font-medium">{vantagem.descricao}</p>
      {mostrarEmpresa && <p className="truncate text-sm text-tinta-3">{vantagem.nome_empresa}</p>}
    </div>
    <ValorMoedas valor={vantagem.custo} tamanho="sm" semUnidade />
  </li>
);

function useVantagens(carregarFn: () => Promise<Vantagem[]>) {
  const [vantagens, setVantagens] = useState<Vantagem[] | null>(null);
  useEffect(() => {
    let ativo = true;
    carregarFn()
      .then((v) => ativo && setVantagens(v))
      .catch(() => ativo && setVantagens([]));
    return () => {
      ativo = false;
    };
  }, [carregarFn]);
  return vantagens;
}

const PainelAluno: React.FC<{ usuario: UsuarioLogado }> = ({ usuario }) => {
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
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <CartaoCarteira
          rotulo="Seu saldo"
          saldo={saldo}
          titular={usuario.nome}
          perfil={NOME_DO_PERFIL[usuario.tipo_usuario]}
          detalhes={
            totais
              ? [
                  { rotulo: 'Recebidas', valor: `+${NUMERO.format(totais.entradas)}` },
                  { rotulo: 'Trocadas', valor: `−${NUMERO.format(totais.saidas)}` },
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
                <LinhaVantagem key={v.id_vantagem} vantagem={v} />
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

const PainelProfessor: React.FC<{ usuario: UsuarioLogado }> = ({ usuario }) => {
  const { extrato, erro, setErro } = useExtrato();
  const totais = extrato ? totaisDoExtrato(extrato.transacoes) : null;
  const alunosReconhecidos = extrato
    ? new Set(extrato.transacoes.filter((t) => t.valor < 0).map((t) => t.descricao.split(':')[0]))
        .size
    : 0;

  return (
    <>
      <MensagemAlerta tipo="erro" mensagem={erro} onFechar={() => setErro(null)} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <CartaoCarteira
          rotulo="Saldo para distribuir"
          saldo={extrato?.saldo ?? null}
          titular={usuario.nome}
          perfil={NOME_DO_PERFIL[usuario.tipo_usuario]}
          detalhes={
            totais
              ? [
                  { rotulo: 'Já enviadas', valor: NUMERO.format(totais.saidas) },
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
    </>
  );
};

const PainelEmpresa: React.FC<{ usuario: UsuarioLogado }> = ({ usuario }) => {
  const vantagens = useVantagens(listarMinhasVantagens);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="relative isolate flex flex-col overflow-hidden rounded-[20px] bg-tinta p-6 text-white sm:p-8">
        <span className="text-sm text-white/70">Vantagens no catálogo</span>
        <p className="numeros mt-6 mb-8 text-6xl font-normal tracking-[-0.04em]">
          {vantagens === null ? '–' : vantagens.length}
        </p>
        <p className="mb-8 max-w-xs text-sm leading-relaxed text-white/70">
          Os alunos veem as suas vantagens no catálogo e podem trocá-las por moedas.
        </p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-medium">{usuario.nome}</p>
            <p className="text-xs text-white/60">{NOME_DO_PERFIL[usuario.tipo_usuario]}</p>
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
              <LinhaVantagem key={v.id_vantagem} vantagem={v} mostrarEmpresa={false} />
            ))}
          </ul>
        )}
      </Painel>
    </div>
  );
};

// Monta a tela inicial conforme o perfil de quem está logado.
export const Inicio: React.FC = () => {
  const { usuario } = useAutenticacao();
  const { mensagem, setMensagem } = useMensagemNavegacao();

  if (!usuario) {
    return (
      <>
        <MensagemAlerta tipo="sucesso" mensagem={mensagem} onFechar={() => setMensagem(null)} />
        <InicioVisitante />
      </>
    );
  }

  return (
    <div>
      <Saudacao usuario={usuario} />
      <MensagemAlerta tipo="sucesso" mensagem={mensagem} onFechar={() => setMensagem(null)} />
      {usuario.tipo_usuario === 'ALUNO' && <PainelAluno usuario={usuario} />}
      {usuario.tipo_usuario === 'PROFESSOR' && <PainelProfessor usuario={usuario} />}
      {usuario.tipo_usuario === 'EMPRESA_PARCEIRA' && <PainelEmpresa usuario={usuario} />}
    </div>
  );
};
