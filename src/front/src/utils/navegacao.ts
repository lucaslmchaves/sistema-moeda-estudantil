// Links de navegação de cada perfil de usuário.
import type { UsuarioLogado } from '../tipos/autenticacao';

export interface LinkNavegacao {
  para: string;
  rotulo: string;
}

const INICIO: LinkNavegacao = { para: '/', rotulo: 'Início' };

// Devolve os links do cabeçalho conforme quem está logado, ou os de visitante.
export function linksDoUsuario(usuario: UsuarioLogado | null): LinkNavegacao[] {
  if (!usuario) {
    return [
      INICIO,
      { para: '/entrar', rotulo: 'Entrar' },
      { para: '/cadastro/aluno', rotulo: 'Sou aluno' },
      { para: '/cadastro/empresa', rotulo: 'Sou empresa' },
    ];
  }
  switch (usuario.tipo_usuario) {
    case 'ALUNO':
      return [
        INICIO,
        { para: '/vantagens', rotulo: 'Vantagens' },
        { para: '/extrato', rotulo: 'Extrato' },
        { para: `/alunos/${usuario.id_usuario}/editar`, rotulo: 'Meu cadastro' },
      ];
    case 'PROFESSOR':
      return [
        INICIO,
        { para: '/enviar-moedas', rotulo: 'Enviar moedas' },
        { para: '/extrato', rotulo: 'Extrato' },
      ];
    case 'EMPRESA_PARCEIRA':
      return [
        INICIO,
        { para: '/minhas-vantagens', rotulo: 'Minhas vantagens' },
        { para: `/empresas/${usuario.id_usuario}/editar`, rotulo: 'Meu cadastro' },
      ];
  }
}
