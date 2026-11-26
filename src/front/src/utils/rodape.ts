// Frase do rodapé de cada página pública.

const FRASES: Record<string, string> = {
  '/cadastro/aluno': 'Valorizando o mérito em sala de aula',
  '/cadastro/empresa': 'O reconhecimento que move a sala de aula',
};

export function textoDoRodape(caminho: string, ano = new Date().getFullYear()): string {
  const frase = FRASES[caminho];
  return frase ? `${frase} · © ${ano}` : `© ${ano} Moeda Estudantil`;
}
