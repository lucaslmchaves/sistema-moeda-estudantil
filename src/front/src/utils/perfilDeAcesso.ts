// Cada aba do login aceita só os seus perfis: professor de um lado, aluno e empresa do outro.
import type { TipoUsuario } from '../tipos/autenticacao';

// Levanta um erro, com a orientação para o usuário, quando o perfil não é o da aba.
export function conferirPerfilDaAba(tipo: TipoUsuario, aba?: 'professor'): void {
  const professor = tipo === 'PROFESSOR';
  if (aba === 'professor' && !professor) {
    throw new Error('Esta aba é só para professores. Entre pela aba "Aluno ou empresa".');
  }
  if (aba !== 'professor' && professor) {
    throw new Error('Este login é de professor. Entre pela aba "Professor".');
  }
}
