// Iniciais do nome num círculo, no lugar de uma foto de perfil.
import React from 'react';

const TONS = [
  'bg-anil-100 text-anil-escuro',
  'bg-[#e3efe8] text-[#1f5b40]',
  'bg-[#f6e8d8] text-[#7a4a12]',
  'bg-[#e2ebf5] text-[#24496e]',
  'bg-[#f3e2e6] text-[#7c2a3c]',
];

// Pega a primeira e a última inicial do nome.
function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

// Escolhe sempre o mesmo tom para o mesmo nome.
function tomDoNome(nome: string): string {
  let soma = 0;
  for (const letra of nome) soma = (soma + letra.charCodeAt(0)) % 997;
  return TONS[soma % TONS.length];
}

export const Avatar: React.FC<{ nome: string; tamanho?: 'sm' | 'md' | 'lg' }> = ({
  nome,
  tamanho = 'md',
}) => {
  const dimensao = { sm: 'size-8 text-[11px]', md: 'size-10 text-xs', lg: 'size-12 text-sm' }[
    tamanho
  ];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide ${dimensao} ${tomDoNome(nome)}`}
    >
      {iniciais(nome)}
    </span>
  );
};
