// Classes do Tailwind reutilizadas pelos componentes, para não repetir utilitários.

type VarianteBotao = 'primario' | 'secundario' | 'perigo';

const BASE_BOTAO =
  'inline-flex cursor-pointer items-center justify-center rounded-lg border border-transparent font-semibold no-underline transition disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTES_BOTAO: Record<VarianteBotao, string> = {
  primario: 'bg-indigo-600 text-white enabled:hover:bg-indigo-700',
  secundario: 'border-slate-200 bg-white text-slate-800 enabled:hover:bg-slate-100',
  perigo: 'bg-red-500 text-white enabled:hover:bg-red-600',
};

// Monta as classes de um botão ou link com aparência de botão.
export function classeBotao(variante: VarianteBotao, pequeno = false): string {
  const tamanho = pequeno ? 'px-2.5 py-1 text-xs' : 'px-4 py-2 text-sm';
  return `${BASE_BOTAO} ${tamanho} ${VARIANTES_BOTAO[variante]}`;
}

// Monta as classes de um item da navegação, destacando o item da rota atual.
export function classeLinkNavegacao(ativo: boolean): string {
  const base = 'rounded-lg px-3 py-2 font-medium no-underline transition';
  const estado = ativo
    ? 'bg-indigo-50 text-indigo-600'
    : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600';
  return `${base} ${estado}`;
}

// Monta as classes de um campo de formulário, com borda vermelha quando há erro.
export function classeControle(comErro: boolean): string {
  const base =
    'rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400';
  return `${base} ${comErro ? 'border-red-500' : 'border-slate-200'}`;
}

export const CLASSE_CARTAO = 'mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm';

export const CLASSE_GRADE_FORMULARIO =
  'mb-6 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]';

export const CLASSE_ACOES_FORMULARIO = 'flex justify-end gap-4';
