// Tipos da sessão e do usuário autenticado.

export type TipoUsuario = 'ALUNO' | 'PROFESSOR' | 'EMPRESA_PARCEIRA';

export interface UsuarioLogado {
  id_usuario: number;
  tipo_usuario: TipoUsuario;
  nome: string;
  login: string;
}

export interface Sessao {
  token: string;
  usuario: UsuarioLogado;
}

export interface RespostaLogin {
  access_token: string;
  token_type: string;
  usuario: UsuarioLogado;
}
