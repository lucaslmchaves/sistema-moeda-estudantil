// Classes do Tailwind reutilizadas pelos componentes, para não repetir utilitários.

type VarianteBotao = 'primario' | 'secundario' | 'perigo' | 'fantasma';
type TamanhoBotao = 'normal' | 'pequeno' | 'grande';

const BASE_BOTAO =
  'inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-controle border font-medium no-underline transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:-translate-y-px active:translate-y-px active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45';

const VARIANTES_BOTAO: Record<VarianteBotao, string> = {
  primario: 'border-transparent bg-anil text-white hover:bg-anil-escuro hover:shadow-botao',
  secundario:
    'border-linha-forte bg-superficie text-tinta hover:border-tinta-3 hover:bg-superficie-2',
  perigo: 'border-transparent bg-negativo text-white hover:bg-negativo-hover',
  fantasma: 'border-transparent bg-transparent text-tinta-2 hover:bg-tinta/5 hover:text-tinta',
};

const TAMANHOS_BOTAO: Record<TamanhoBotao, string> = {
  pequeno: 'h-8 px-3 text-xs',
  normal: 'h-10 px-4 text-sm',
  grande: 'h-12 px-5 text-[15px]',
};

// Monta as classes de um botão ou link com aparência de botão.
export function classeBotao(
  variante: VarianteBotao,
  pequeno: boolean | TamanhoBotao = false,
): string {
  const tamanho: TamanhoBotao =
    pequeno === true ? 'pequeno' : pequeno === false ? 'normal' : pequeno;
  return `${BASE_BOTAO} ${TAMANHOS_BOTAO[tamanho]} ${VARIANTES_BOTAO[variante]}`;
}

// Monta as classes de um item da navegação lateral, destacando o item da rota atual.
export function classeLinkNavegacao(ativo: boolean): string {
  const base =
    'group flex h-10 items-center gap-3 rounded-controle px-3 text-sm font-medium no-underline transition-colors duration-150';
  const estado = ativo
    ? 'bg-anil-100 text-anil-escuro'
    : 'text-tinta-2 hover:bg-tinta/5 hover:text-tinta';
  return `${base} ${estado}`;
}

// Monta as classes de um campo de formulário, com borda vermelha quando há erro.
export function classeControle(comErro: boolean): string {
  const base =
    'w-full rounded-controle border bg-superficie px-3.5 py-2.5 text-[15px] text-tinta outline-none transition-[border-color,box-shadow] duration-150 hover:border-tinta-3 focus:border-anil focus:shadow-[0_0_0_4px_var(--color-anil-100)] disabled:cursor-not-allowed disabled:border-linha disabled:bg-superficie-2 disabled:text-tinta-3';
  return `${base} ${comErro ? 'border-negativo focus:border-negativo focus:shadow-[0_0_0_4px_var(--color-negativo-fundo)]' : 'border-linha-forte'}`;
}

export const CLASSE_CARTAO = 'rounded-cartao border border-linha bg-superficie';

export const CLASSE_GRADE_FORMULARIO = 'grid gap-x-5 gap-y-5 sm:grid-cols-2';

export const CLASSE_ACOES_FORMULARIO =
  'flex flex-col-reverse gap-3 border-t border-linha pt-6 sm:flex-row sm:items-center sm:justify-end';
