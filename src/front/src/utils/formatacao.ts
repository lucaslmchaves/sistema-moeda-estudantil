// Utilitários de formatação e máscaras visuais para documentos brasileiros.

// Formata texto de CPF no padrão 000.000.000-00 preservando o original se incompleto.
export function formatarCpf(cpf: string): string {
  if (!cpf) return '';
  const digitos = cpf.replace(/\D/g, '');
  if (digitos.length !== 11) {
    return cpf;
  }
  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formata texto de CNPJ no padrão 00.000.000/0000-00 preservando o original se incompleto.
export function formatarCnpj(cnpj: string): string {
  if (!cnpj) return '';
  const digitos = cnpj.replace(/\D/g, '');
  if (digitos.length !== 14) {
    return cnpj;
  }
  return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

// Escreve a quantidade de moedas com separador de milhar e a palavra no singular ou plural.
export function formatarMoedas(valor: number): string {
  const numero = new Intl.NumberFormat('pt-BR').format(valor);
  return `${numero} ${Math.abs(valor) === 1 ? 'moeda' : 'moedas'}`;
}

// Escreve data e hora no padrão brasileiro, sem segundos.
export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(data);
}
