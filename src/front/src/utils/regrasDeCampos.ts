// Regras de formato dos campos de cadastro, usadas pela validação e pelos formulários.

export const CURSOS = [
  'Administração',
  'Análise e Desenvolvimento de Sistemas',
  'Arquitetura e Urbanismo',
  'Biomedicina',
  'Ciência da Computação',
  'Ciências Biológicas',
  'Ciências Contábeis',
  'Ciências Econômicas',
  'Cinema e Audiovisual',
  'Comunicação Social',
  'Design',
  'Direito',
  'Educação Física',
  'Enfermagem',
  'Engenharia Aeronáutica',
  'Engenharia Ambiental',
  'Engenharia Civil',
  'Engenharia de Computação',
  'Engenharia de Controle e Automação',
  'Engenharia de Produção',
  'Engenharia de Software',
  'Engenharia Elétrica',
  'Engenharia Mecânica',
  'Engenharia Mecatrônica',
  'Engenharia Química',
  'Farmácia',
  'Filosofia',
  'Física',
  'Fisioterapia',
  'Geografia',
  'História',
  'Jogos Digitais',
  'Jornalismo',
  'Letras',
  'Matemática',
  'Medicina',
  'Medicina Veterinária',
  'Nutrição',
  'Odontologia',
  'Pedagogia',
  'Psicologia',
  'Publicidade e Propaganda',
  'Redes de Computadores',
  'Relações Internacionais',
  'Serviço Social',
  'Sistemas de Informação',
  'Teologia',
  'Outro',
];

export const emailValido = (texto: string) =>
  /^[A-Za-z0-9_%+-]+(\.[A-Za-z0-9_%+-]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/.test(texto);

// Nome e sobrenome, só com letras e os sinais comuns em nomes.
export const nomeCompletoValido = (texto: string) =>
  /^[\p{L}'.-]+( +[\p{L}'.-]+)+$/u.test(texto) && (texto.match(/\p{L}/gu)?.length ?? 0) >= 4;

export const nomeDeEmpresaValido = (texto: string) => texto.length >= 2 && /\p{L}/u.test(texto);

// Até duas letras do estado e de 5 a 9 dígitos, com ou sem pontos e traço.
export const rgValido = (texto: string) =>
  /^[A-Za-z]{0,2}\d{5,9}[Xx]?$/.test(texto.replace(/[.\s-]/g, ''));

// Precisa do nome da rua e de um número (ou "s/n").
export function enderecoValido(texto: string): boolean {
  const temRua = /\p{L}{3,}/u.test(texto);
  const temNumero = /(^|[\s,])(\d{1,6}[A-Za-z]?(?=$|[\s,.;/-])|s\/?n(?=$|[\s,.;-]))/i.test(texto);
  return texto.length >= 8 && temRua && temNumero;
}

export const loginValido = (texto: string) => /^[A-Za-z0-9._-]{3,60}$/.test(texto);

export const REQUISITOS_DA_SENHA = [
  { rotulo: '8 caracteres ou mais', atende: (senha: string) => senha.length >= 8 },
  { rotulo: 'uma letra', atende: (senha: string) => /\p{L}/u.test(senha) },
  { rotulo: 'um número', atende: (senha: string) => /\d/.test(senha) },
];
