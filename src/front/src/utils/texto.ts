// Texto sem acentos e em minúsculas, para a busca achar "joao" em "João".
export function semAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
