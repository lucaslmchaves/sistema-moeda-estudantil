// Página de apresentação do sistema, vista por quem ainda não entrou.
import React from 'react';
import { Link } from 'react-router-dom';
import { MoedaDourada, PalavraQueViraMoeda } from '../animacao/MoedaDourada';
import { Revelar } from '../animacao/Revelar';
import { Icone, type NomeIcone } from '../icones/Icone';
import { Avatar } from '../marca/Avatar';
import { SimboloMarca } from '../marca/Marca';
import { ValorMoedas } from '../marca/Moedas';
import { CLASSE_BOTAO_CLARO, CLASSE_BOTAO_CONTORNO_CLARO } from '../moedas/CartaoCarteira';
import { classeBotao } from '../../utils/estilos';

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
    className="relative mx-auto w-full max-w-[520px] rounded-[28px] bg-linear-to-br from-anil-100 to-anil-50 p-6 pt-10 pb-24 sm:p-10 sm:pb-28"
  >
    <MoedaDourada className="animate-flutuar absolute -top-8 left-6 size-14 drop-shadow-lg" />
    <MoedaDourada className="animate-flutuar absolute top-1/2 -right-4 size-10 drop-shadow-lg [animation-delay:-2s]" />
    <MoedaDourada className="animate-flutuar absolute right-10 -bottom-12 size-14 drop-shadow-lg [animation-delay:-4s]" />
    <div className="relative rounded-[20px] bg-linear-to-br from-anil-escuro to-anil-fundo p-6 text-white shadow-flutuante sm:p-7">
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

const PASSOS: { icone: NomeIcone; titulo: string; texto: string }[] = [
  {
    icone: 'chalkboard-teacher',
    titulo: 'O professor reconhece',
    texto: 'Escolhe o aluno, informa quantas moedas e escreve o motivo.',
  },
  {
    icone: 'paper-plane-tilt',
    titulo: 'O aluno recebe',
    texto: 'As moedas entram no saldo e um aviso chega por e-mail.',
  },
  {
    icone: 'gift',
    titulo: 'Troca por vantagens',
    texto: 'No catálogo das empresas parceiras, com cupom e código para conferir.',
  },
];

// Apresenta o caminho da moeda em três passos, antes de pedir o login ou o cadastro.
const CaminhoDaMoeda: React.FC = () => (
  <Revelar>
    <section aria-labelledby="caminho">
      <h2 id="caminho" className="titulo-display mb-10 text-4xl sm:text-5xl">
        O caminho de uma <em className="font-serif font-normal text-anil">moeda</em>.
      </h2>
      <ol className="grid gap-5 md:grid-cols-3">
        {PASSOS.map((passo, i) => (
          <li
            key={passo.titulo}
            className="elevar rounded-cartao border border-linha bg-superficie p-7"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-anil text-white">
                <Icone nome={passo.icone} tamanho={22} />
              </span>
              <span aria-hidden="true" className="font-serif text-5xl text-ouro-500 italic">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em]">{passo.titulo}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-tinta-2">{passo.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  </Revelar>
);

// Convite no fim da apresentação para ir ao login.
const ChamadaFinal: React.FC = () => (
  <Revelar>
    <section className="relative isolate overflow-hidden rounded-[28px] bg-linear-to-br from-anil-escuro to-anil-fundo px-7 py-14 text-center text-white sm:px-12">
      <MoedaDourada className="animate-flutuar absolute top-8 left-8 -z-10 size-12 opacity-80 sm:size-20" />
      <MoedaDourada className="animate-flutuar absolute right-10 bottom-6 -z-10 size-10 opacity-80 [animation-delay:-3s] sm:size-16" />
      <h2 className="titulo-display mx-auto max-w-[18ch] text-4xl sm:text-5xl">
        Comece a reconhecer o <em className="font-serif font-normal text-ouro-300">mérito</em>.
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/entrar" className={CLASSE_BOTAO_CLARO}>
          Ir para o login
          <Icone nome="arrow-right" tamanho={16} />
        </Link>
        <Link to="/cadastro/empresa" className={CLASSE_BOTAO_CONTORNO_CLARO}>
          Quero ser parceiro
        </Link>
      </div>
    </section>
  </Revelar>
);

export const ApresentacaoVisitante: React.FC = () => (
  <div className="flex flex-col gap-24 sm:gap-32">
    <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
      <div className="cascata">
        <h1 className="titulo-display max-w-[11ch] text-[52px] sm:text-[72px]">
          Mérito em sala vira{' '}
          <PalavraQueViraMoeda
            palavra="moeda"
            className="font-serif font-normal tracking-[-0.01em] text-anil italic"
          />
          .
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

    <CaminhoDaMoeda />

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
            className={`group/papel flex flex-col p-7 transition-colors duration-300 hover:bg-anil-50 sm:p-8 ${i > 0 ? 'border-t border-linha md:border-t-0 md:border-l' : ''}`}
          >
            <span className="mb-8 inline-flex size-11 items-center justify-center rounded-full bg-anil-100 text-anil transition-transform duration-300 group-hover/papel:scale-110 group-hover/papel:-rotate-6">
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

    <ChamadaFinal />
  </div>
);
