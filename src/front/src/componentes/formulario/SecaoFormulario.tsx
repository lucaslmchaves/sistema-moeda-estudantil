// Bloco de um formulário longo: título e explicação à esquerda, campos à direita.
import React from 'react';

interface SecaoFormularioProps {
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}

export const SecaoFormulario: React.FC<SecaoFormularioProps> = ({
  titulo,
  descricao,
  children,
}) => (
  <section className="grid gap-x-10 gap-y-5 border-b border-linha py-8 first:pt-0 last:border-b-0 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
    <div>
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-tinta">{titulo}</h2>
      {descricao && <p className="mt-1 text-sm leading-relaxed text-tinta-3">{descricao}</p>}
    </div>
    <div className="min-w-0">{children}</div>
  </section>
);
