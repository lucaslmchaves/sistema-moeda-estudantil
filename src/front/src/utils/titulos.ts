// Título da aba do navegador para cada endereço do sistema.

const SISTEMA = 'Moeda Estudantil';

const TITULOS: [RegExp, string][] = [
  [/^\/entrar\/professor$/, 'Entrar como professor'],
  [/^\/entrar$/, 'Entrar'],
  [/^\/cadastro\/aluno$/, 'Criar conta de aluno'],
  [/^\/cadastro\/empresa$/, 'Cadastrar empresa'],
  [/^\/(alunos|empresas)\/\d+\/editar$/, 'Meu cadastro'],
  [/^\/extrato$/, 'Extrato'],
  [/^\/enviar-moedas$/, 'Enviar moedas'],
  [/^\/vantagens$/, 'Vantagens'],
  [/^\/minhas-vantagens\/nova$/, 'Nova vantagem'],
  [/^\/minhas-vantagens$/, 'Minhas vantagens'],
];

export function tituloDaRota(caminho: string): string {
  if (caminho === '/') return SISTEMA;
  const titulo = TITULOS.find(([padrao]) => padrao.test(caminho))?.[1] ?? 'Página não encontrada';
  return `${titulo} · ${SISTEMA}`;
}
