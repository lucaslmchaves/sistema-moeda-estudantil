// Página para um endereço que não existe no sistema.
import React from 'react';
import { Link } from 'react-router-dom';
import { ApanheAsMoedas } from '../../componentes/animacao/ApanheAsMoedas';
import { MoedaDourada } from '../../componentes/animacao/MoedaDourada';
import { classeBotao } from '../../utils/estilos';
import { podeAnimar } from '../../utils/movimento';

export const NaoEncontrada: React.FC = () => (
  <div className="cascata flex flex-col items-center py-16 text-center">
    <MoedaDourada className="animate-flutuar size-28 drop-shadow-2xl" />
    <h1 className="titulo-display mt-8 text-4xl sm:text-5xl">
      Essa página não vale uma <em className="font-serif font-normal text-anil">moeda</em>.
    </h1>
    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-tinta-3">
      O endereço não existe no sistema. Confira o link ou volte para o começo.
    </p>
    <Link to="/" className={`${classeBotao('primario', 'grande')} mt-8`}>
      Voltar ao início
    </Link>
    {podeAnimar() && (
      <div className="mt-10 w-full max-w-md">
        <ApanheAsMoedas convite="Já que está aqui, toque nas moedas:" />
      </div>
    )}
  </div>
);
