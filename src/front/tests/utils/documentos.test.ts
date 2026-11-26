// Testes das máscaras e da conferência de CPF, CNPJ e confirmação de senha.
import { describe, expect, it } from 'vitest';
import { cnpjValido, cpfValido, mascararCnpj, mascararCpf } from '../../src/utils/documentos';
import { validarAluno, validarEmpresa } from '../../src/utils/validacao';

describe('máscaras', () => {
  it('coloca os separadores do CPF enquanto os dígitos chegam', () => {
    expect(mascararCpf('529')).toBe('529');
    expect(mascararCpf('5299')).toBe('529.9');
    expect(mascararCpf('52998224725')).toBe('529.982.247-25');
    expect(mascararCpf('529.982.247-2599')).toBe('529.982.247-25');
    expect(mascararCpf('abc')).toBe('');
  });

  it('coloca os separadores do CNPJ', () => {
    expect(mascararCnpj('112')).toBe('11.2');
    expect(mascararCnpj('11222333000181')).toBe('11.222.333/0001-81');
  });
});

describe('dígitos verificadores', () => {
  it('aceita documentos válidos, com ou sem pontuação', () => {
    expect(cpfValido('529.982.247-25')).toBe(true);
    expect(cpfValido('12345678909')).toBe(true);
    expect(cnpjValido('11.222.333/0001-81')).toBe(true);
    expect(cnpjValido('00000000000191')).toBe(true);
  });

  it('recusa dígito errado, tamanho errado e sequência repetida', () => {
    expect(cpfValido('529.982.247-24')).toBe(false);
    expect(cpfValido('111.111.111-11')).toBe(false);
    expect(cpfValido('5299822472')).toBe(false);
    expect(cnpjValido('11.222.333/0001-80')).toBe(false);
    expect(cnpjValido('11111111111111')).toBe(false);
  });
});

describe('validação dos cadastros', () => {
  it('avisa o CPF e o CNPJ inválidos antes de enviar', () => {
    expect(validarAluno({ cpf: '123.456.789-00' }).cpf).toBe('O CPF informado não é válido.');
    expect(validarEmpresa({ cnpj: '11.222.333/0001-80' }).cnpj).toBe(
      'O CNPJ informado não é válido.',
    );
  });

  it('exige a confirmação igual à senha quando a tela a pede', () => {
    const erro = (senha: string, confirmarSenha?: string) =>
      validarEmpresa({ senha, confirmarSenha }).confirmarSenha;

    expect(erro('senha-segura-1', '')).toBe('Confirme a senha.');
    expect(erro('senha-segura-1', 'senha-segura-2')).toBe('As senhas não são iguais.');
    expect(erro('senha-segura-1', 'senha-segura-1')).toBeUndefined();
    expect(erro('senha-segura-1')).toBeUndefined();
  });

  it('na edição sem senha nova não pede confirmação', () => {
    expect(validarAluno({ senha: '', confirmarSenha: '' }, true).confirmarSenha).toBeUndefined();
  });
});
