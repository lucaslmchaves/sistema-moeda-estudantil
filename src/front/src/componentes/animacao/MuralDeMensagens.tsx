// Mural ilustrativo do login: reconhecimentos e trocas que chegam um depois do outro.
import { ValorMoedas } from '../marca/Moedas';
import React, { useEffect, useState } from 'react';
import { podeAnimar } from '../../utils/movimento';
import { Icone, type NomeIcone } from '../icones/Icone';
import { Avatar } from '../marca/Avatar';

interface Mensagem {
  nome: string;
  titulo: string;
  texto: string;
  valor?: number;
  icone?: NomeIcone;
}

const MENSAGENS: Mensagem[] = [
  {
    nome: 'Ana Paula Souza',
    titulo: 'Prof. Ana Paula',
    texto: 'Ajudou os colegas na monitoria de Cálculo.',
    valor: 80,
  },
  {
    nome: 'Marcos Vinicius Pereira',
    titulo: 'Prof. Marcos Vinicius',
    texto: 'Melhor nota da turma na prova de Algoritmos.',
    valor: 150,
  },
  {
    nome: 'Beatriz Andrade',
    titulo: 'Beatriz trocou moedas',
    texto: 'Café com pão de queijo na Cantina do Campus.',
    valor: -20,
    icone: 'ticket',
  },
  {
    nome: 'Carlos Eduardo Silva',
    titulo: 'Prof. Carlos Eduardo',
    texto: 'Pontualidade em todas as entregas do semestre.',
    valor: 30,
  },
  {
    nome: 'Rafael Monteiro',
    titulo: 'E-mail para o Rafael',
    texto: 'Você recebeu moedas! Confira o seu extrato.',
    icone: 'paper-plane-tilt',
  },
  {
    nome: 'Marcos Vinicius Pereira',
    titulo: 'Prof. Marcos Vinicius',
    texto: 'Apresentou o seminário com muita clareza.',
    valor: 100,
  },
  {
    nome: 'Júlia Ferraz',
    titulo: 'Júlia trocou moedas',
    texto: '20% de desconto na Livraria Universitária.',
    valor: -80,
    icone: 'gift',
  },
];

const VISIVEIS = 4;
const INTERVALO_MS = 2600;
const SAIDA_MS = 450;

interface ItemDoMural {
  chave: number;
  saindo: boolean;
}

export const MuralDeMensagens: React.FC = () => {
  const [itens, setItens] = useState<ItemDoMural[]>(() =>
    Array.from({ length: VISIVEIS }, (_, chave) => ({ chave, saindo: false })),
  );

  useEffect(() => {
    if (!podeAnimar()) return;
    let saida = 0;
    // A mais antiga some no topo e, em seguida, uma nova chega embaixo.
    const ciclo = window.setInterval(() => {
      setItens((atuais) => atuais.map((item, i) => (i === 0 ? { ...item, saindo: true } : item)));
      saida = window.setTimeout(() => {
        setItens((atuais) => [
          ...atuais.slice(1),
          { chave: atuais[atuais.length - 1].chave + 1, saindo: false },
        ]);
      }, SAIDA_MS);
    }, INTERVALO_MS);
    return () => {
      window.clearInterval(ciclo);
      window.clearTimeout(saida);
    };
  }, []);

  return (
    <ul className="flex flex-col">
      {itens.map(({ chave, saindo }) => {
        const mensagem = MENSAGENS[chave % MENSAGENS.length];
        // O recuo alterna para o mural não parecer uma tabela.
        const recuo = chave % 3;
        return (
          <li
            key={chave}
            className={`mural-item ${saindo ? 'saindo' : ''}`}
            style={{ animationDelay: chave < VISIVEIS ? `${chave * 120}ms` : '0ms' }}
          >
            <div className="min-h-0">
              <div
                className="mb-3 flex items-start gap-3 rounded-2xl bg-superficie p-4 text-tinta shadow-elevado"
                style={{ marginLeft: `${recuo * 24}px`, marginRight: `${(2 - recuo) * 24}px` }}
              >
                {mensagem.icone ? (
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-ouro-100 text-ouro-700">
                    <Icone nome={mensagem.icone} tamanho={16} />
                  </span>
                ) : (
                  <Avatar nome={mensagem.nome} tamanho="sm" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm font-medium">{mensagem.titulo}</p>
                    {mensagem.valor !== undefined && (
                      <ValorMoedas valor={mensagem.valor} tamanho="sm" sinal semUnidade />
                    )}
                  </div>
                  <p className="mt-0.5 text-[13px] leading-snug text-tinta-2">{mensagem.texto}</p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
