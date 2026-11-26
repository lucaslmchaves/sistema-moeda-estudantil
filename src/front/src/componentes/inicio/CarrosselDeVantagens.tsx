// Carrossel da página inicial com exemplos de vantagens: passa sozinho, para quando a pessoa
// interage e aceita setas, rolagem e arrasto no celular.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import almoco from '../../assets/vitrine/almoco.jpg';
import caderno from '../../assets/vitrine/caderno.jpg';
import cafe from '../../assets/vitrine/cafe.jpg';
import cinema from '../../assets/vitrine/cinema.jpg';
import curso from '../../assets/vitrine/curso.jpg';
import fone from '../../assets/vitrine/fone.jpg';
import livros from '../../assets/vitrine/livros.jpg';
import { podeAnimar } from '../../utils/movimento';
import { Icone } from '../icones/Icone';
import { ValorMoedas } from '../marca/Moedas';

const INTERVALO_MS = 3500;

// Exemplos fixos: o catálogo de verdade só aparece para quem entra no sistema.
const EXEMPLOS = [
  { foto: cafe, titulo: 'Café com pão de queijo', empresa: 'Cantina do Campus', custo: 20 },
  { foto: caderno, titulo: 'Caderno universitário', empresa: 'Livraria Universitária', custo: 40 },
  {
    foto: almoco,
    titulo: 'Almoço no restaurante universitário',
    empresa: 'Cantina do Campus',
    custo: 60,
  },
  {
    foto: livros,
    titulo: '20% de desconto em livros',
    empresa: 'Livraria Universitária',
    custo: 80,
  },
  { foto: cinema, titulo: 'Ingresso de cinema', empresa: 'Livraria Universitária', custo: 100 },
  { foto: fone, titulo: 'Fone de ouvido sem fio', empresa: 'Livraria Universitária', custo: 250 },
  {
    foto: curso,
    titulo: 'Curso de programação online',
    empresa: 'Livraria Universitária',
    custo: 300,
  },
];

const CLASSE_SETA =
  'inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-linha-forte bg-superficie text-tinta transition hover:border-anil hover:bg-anil hover:text-white active:scale-95';

export const CarrosselDeVantagens: React.FC = () => {
  const trilho = useRef<HTMLUListElement>(null);
  const [parado, setParado] = useState(false);

  // Anda um cartão para o lado pedido; nas pontas, volta para o outro extremo.
  const andar = useCallback((sentido: 1 | -1) => {
    const caixa = trilho.current;
    const cartao = caixa?.firstElementChild as HTMLElement | null;
    if (!caixa || !cartao) return;
    const fim = caixa.scrollWidth - caixa.clientWidth;
    const passo = cartao.offsetWidth + 20;
    let destino = caixa.scrollLeft + sentido * passo;
    if (sentido > 0 && caixa.scrollLeft >= fim - 4) destino = 0;
    if (sentido < 0 && caixa.scrollLeft <= 4) destino = fim;
    caixa.scrollTo?.({ left: destino, behavior: podeAnimar() ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    if (parado || !podeAnimar()) return;
    const ciclo = window.setInterval(() => andar(1), INTERVALO_MS);
    return () => window.clearInterval(ciclo);
  }, [parado, andar]);

  return (
    <section
      aria-labelledby="vitrine"
      aria-roledescription="carrossel"
      onMouseEnter={() => setParado(true)}
      onMouseLeave={() => setParado(false)}
      onFocus={() => setParado(true)}
      onBlur={() => setParado(false)}
      onTouchStart={() => setParado(true)}
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="vitrine" className="titulo-display text-4xl sm:text-5xl">
            O que dá para <em className="font-serif font-normal text-anil">trocar</em>.
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-tinta-3">
            Exemplos de vantagens oferecidas pelas empresas parceiras.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Vantagem anterior"
            className={CLASSE_SETA}
            onClick={() => andar(-1)}
          >
            <Icone nome="arrow-left" tamanho={18} />
          </button>
          <button
            type="button"
            aria-label="Próxima vantagem"
            className={CLASSE_SETA}
            onClick={() => andar(1)}
          >
            <Icone nome="arrow-right" tamanho={18} />
          </button>
        </div>
      </div>

      <ul
        ref={trilho}
        className="sem-barra -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pt-1 pb-6"
      >
        {EXEMPLOS.map((exemplo) => (
          <li
            key={exemplo.titulo}
            className="elevar group w-[78%] shrink-0 snap-start overflow-hidden rounded-cartao border border-linha bg-superficie sm:w-[300px]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={exemplo.foto}
                alt=""
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 ease-saida group-hover:scale-110"
              />
              <span className="absolute top-3 left-3 rounded-full bg-superficie/95 px-2.5 py-1 shadow-elevado backdrop-blur-sm">
                <ValorMoedas valor={exemplo.custo} tamanho="sm" />
              </span>
            </div>
            <div className="p-5">
              <p className="text-[13px] text-tinta-3">{exemplo.empresa}</p>
              <h3 className="mt-1 text-[17px] leading-snug font-semibold tracking-[-0.01em]">
                {exemplo.titulo}
              </h3>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
