// Perguntas frequentes da página inicial, que abrem e fecham.
import React, { useState } from 'react';
import { Icone } from '../icones/Icone';

const PERGUNTAS = [
  {
    pergunta: 'Quem pode criar uma conta?',
    resposta:
      'Alunos e empresas parceiras criam a conta aqui no site. Os professores já vêm cadastrados pela instituição e só precisam entrar.',
  },
  {
    pergunta: 'Quantas moedas um professor recebe?',
    resposta:
      'São 1.000 moedas por semestre. O que não for enviado continua no saldo e se soma ao semestre seguinte.',
  },
  {
    pergunta: 'As moedas valem dinheiro?',
    resposta:
      'Não. São moedas virtuais de reconhecimento, usadas somente para trocar pelas vantagens das empresas parceiras.',
  },
  {
    pergunta: 'Como uso uma vantagem que troquei?',
    resposta:
      'A troca gera um cupom com um código, enviado por e-mail para você e para a empresa. É só apresentar o código no local.',
  },
  {
    pergunta: 'Minha empresa quer participar. O que preciso fazer?',
    resposta:
      'Cadastre a empresa e depois publique as vantagens, cada uma com foto, descrição e custo em moedas.',
  },
];

export const PerguntasFrequentes: React.FC = () => {
  const [aberta, setAberta] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="perguntas"
      className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]"
    >
      <h2 id="perguntas" className="titulo-display text-4xl sm:text-5xl">
        Perguntas <em className="font-serif font-normal text-anil">frequentes</em>.
      </h2>
      <ul className="divide-y divide-linha overflow-hidden rounded-cartao border border-linha bg-superficie">
        {PERGUNTAS.map((item, i) => {
          const abriu = aberta === i;
          return (
            <li key={item.pergunta}>
              <h3>
                <button
                  type="button"
                  aria-expanded={abriu}
                  aria-controls={`resposta-${i}`}
                  onClick={() => setAberta(abriu ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium transition hover:bg-anil-50 sm:px-6"
                >
                  {item.pergunta}
                  <span
                    className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full transition duration-300 ${
                      abriu ? 'rotate-45 bg-anil text-white' : 'bg-anil-100 text-anil'
                    }`}
                  >
                    <Icone nome="plus" tamanho={14} />
                  </span>
                </button>
              </h3>
              <div
                id={`resposta-${i}`}
                className={`grid transition-[grid-template-rows,visibility] duration-300 ease-saida ${
                  abriu ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-[15px] leading-relaxed text-tinta-2 sm:px-6">
                    {item.resposta}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
