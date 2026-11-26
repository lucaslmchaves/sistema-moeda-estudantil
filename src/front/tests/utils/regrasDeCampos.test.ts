// Testes das regras de formato dos cadastros.
import { describe, expect, it } from 'vitest';
import {
  emailValido,
  enderecoValido,
  loginValido,
  nomeCompletoValido,
  rgValido,
} from '../../src/utils/regrasDeCampos';
import { validarAluno } from '../../src/utils/validacao';

describe('regras de campos', () => {
  it.each([
    [emailValido, 'aluno.joao@exemplo.edu.br', true],
    [emailValido, 'a@b.c', false],
    [emailValido, 'a..b@exemplo.com', false],
    [emailValido, 'joao exemplo.com', false],
    [nomeCompletoValido, "João D'Ávila", true],
    [nomeCompletoValido, 'João', false],
    [nomeCompletoValido, 'João 123', false],
    [rgValido, 'MG-12.345.678', true],
    [rgValido, '12.345.678-X', true],
    [rgValido, 'abc', false],
    [enderecoValido, 'Rua da Bahia, 1200, Belo Horizonte', true],
    [enderecoValido, 'Praça da Liberdade, s/n', true],
    [enderecoValido, 'Rua da Bahia, 1eeee', false],
    [enderecoValido, 'qualquer coisa', false],
    [loginValido, 'aluno.joao', true],
    [loginValido, 'joão silva', false],
  ])('%o com "%s"', (regra, texto, esperado) => {
    expect(regra(texto)).toBe(esperado);
  });

  it('recusa curso fora da lista e senha sem número', () => {
    const erros = validarAluno({ curso: 'Engenharia de Softwaree', senha: 'somenteletras' });

    expect(erros.curso).toBe('Escolha um curso da lista.');
    expect(erros.senha).toBe('A senha deve ter pelo menos uma letra e um número.');
  });
});
