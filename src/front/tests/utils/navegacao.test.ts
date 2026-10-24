// Testes dos links de navegação de cada perfil.
import { describe, expect, it } from 'vitest';
import type { UsuarioLogado } from '../../src/tipos/autenticacao';
import { linksDoUsuario } from '../../src/utils/navegacao';

const usuario = (tipo_usuario: UsuarioLogado['tipo_usuario']): UsuarioLogado => ({
  id_usuario: 9,
  tipo_usuario,
  nome: 'Teste',
  login: 'teste',
});

const rotas = (u: UsuarioLogado | null) => linksDoUsuario(u).map((link) => link.para);

describe('linksDoUsuario', () => {
  it('mostra login e cadastros ao visitante', () => {
    expect(rotas(null)).toEqual(['/', '/entrar', '/cadastro/aluno', '/cadastro/empresa']);
  });

  it('mostra vantagens, extrato e o próprio cadastro ao aluno', () => {
    expect(rotas(usuario('ALUNO'))).toEqual(['/', '/vantagens', '/extrato', '/alunos/9/editar']);
  });

  it('mostra envio de moedas e extrato ao professor', () => {
    expect(rotas(usuario('PROFESSOR'))).toEqual(['/', '/enviar-moedas', '/extrato']);
  });

  it('mostra vantagens e o próprio cadastro à empresa', () => {
    expect(rotas(usuario('EMPRESA_PARCEIRA'))).toEqual([
      '/',
      '/minhas-vantagens',
      '/empresas/9/editar',
    ]);
  });
});
