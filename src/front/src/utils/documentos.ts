// CPF e CNPJ: máscara enquanto a pessoa digita e conferência dos dígitos verificadores,
// com as mesmas regras do back-end.

// Coloca os separadores à medida que os dígitos vão sendo digitados.
function aplicarMascara(texto: string, grupos: number[], separadores: string[]): string {
  const digitos = texto.replace(/\D/g, '').slice(
    0,
    grupos.reduce((a, b) => a + b, 0),
  );
  let saida = '';
  let inicio = 0;
  grupos.forEach((tamanho, i) => {
    const parte = digitos.slice(inicio, inicio + tamanho);
    if (parte) saida += (i > 0 ? separadores[i - 1] : '') + parte;
    inicio += tamanho;
  });
  return saida;
}

export const mascararCpf = (texto: string) => aplicarMascara(texto, [3, 3, 3, 2], ['.', '.', '-']);

export const mascararCnpj = (texto: string) =>
  aplicarMascara(texto, [2, 3, 3, 4, 2], ['.', '.', '/', '-']);

function digitoVerificador(numeros: number[], pesos: number[]): number {
  const resto = pesos.reduce((soma, peso, i) => soma + numeros[i] * peso, 0) % 11;
  return resto < 2 ? 0 : 11 - resto;
}

// Confere o tamanho, recusa sequências repetidas e compara os dois dígitos finais.
function documentoValido(texto: string, tamanho: number, pesos: [number[], number[]]): boolean {
  const digitos = texto.replace(/\D/g, '');
  if (digitos.length !== tamanho || new Set(digitos).size === 1) return false;
  const numeros = [...digitos].map(Number);
  return (
    numeros[tamanho - 2] === digitoVerificador(numeros, pesos[0]) &&
    numeros[tamanho - 1] === digitoVerificador(numeros, pesos[1])
  );
}

export const cpfValido = (texto: string) =>
  documentoValido(texto, 11, [
    [10, 9, 8, 7, 6, 5, 4, 3, 2],
    [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
  ]);

export const cnpjValido = (texto: string) =>
  documentoValido(texto, 14, [
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  ]);
