// Links de navegação de cada perfil de usuário.
import type { NomeIcone } from '../componentes/icones/Icone';
import type { TipoUsuario, UsuarioLogado } from '../tipos/autenticacao';

export interface LinkNavegacao {
  para: string;
  rotulo: string;
  icone: NomeIcone;
}

const INICIO: LinkNavegacao = { para: '/', rotulo: 'Início', icone: 'house' };

export const NOME_DO_PERFIL: Record<TipoUsuario, string> = {
  ALUNO: 'Aluno',
  PROFESSOR: 'Professor',
  EMPRESA_PARCEIRA: 'Empresa parceira',
};

// Devolve os links do menu conforme quem está logado, ou os de visitante.
export function linksDoUsuario(usuario: UsuarioLogado | null): LinkNavegacao[] {
  if (!usuario) {
    return [
      INICIO,
      { para: '/entrar', rotulo: 'Entrar', icone: 'sign-out' },
      { para: '/cadastro/aluno', rotulo: 'Sou aluno', icone: 'graduation-cap' },
      { para: '/cadastro/empresa', rotulo: 'Sou empresa', icone: 'storefront' },
      { para: '/entrar/professor', rotulo: 'Sou professor', icone: 'chalkboard-teacher' },
    ];
  }
  switch (usuario.tipo_usuario) {
    case 'ALUNO':
      return [
        INICIO,
        { para: '/vantagens', rotulo: 'Vantagens', icone: 'gift' },
        { para: '/extrato', rotulo: 'Extrato', icone: 'receipt' },
        {
          para: `/alunos/${usuario.id_usuario}/editar`,
          rotulo: 'Meu cadastro',
          icone: 'user-circle',
        },
      ];
    case 'PROFESSOR':
      return [
        INICIO,
        { para: '/enviar-moedas', rotulo: 'Enviar moedas', icone: 'paper-plane-tilt' },
        { para: '/extrato', rotulo: 'Extrato', icone: 'receipt' },
      ];
    case 'EMPRESA_PARCEIRA':
      return [
        INICIO,
        { para: '/minhas-vantagens', rotulo: 'Minhas vantagens', icone: 'gift' },
        {
          para: `/empresas/${usuario.id_usuario}/editar`,
          rotulo: 'Meu cadastro',
          icone: 'user-circle',
        },
      ];
  }
}
