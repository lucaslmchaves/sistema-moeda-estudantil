// Testes unitários para regras e mensagens de validação síncrona de formulários.
import { describe, expect, it } from 'vitest';
import {
  validarAluno,
  validarEmpresa,
  DadosValidacaoAluno,
  DadosValidacaoEmpresa,
} from '../../src/utils/validacao';

describe('validarAluno', () => {
  const dadosValidos: DadosValidacaoAluno = {
    nome: 'Maria Silva',
    email: 'maria@exemplo.com',
    cpf: '12345678909',
    rg: 'MG-123456',
    endereco: 'Rua A, 100',
    curso: 'Engenharia',
    id_instituicao: 1,
    login: 'maria.silva',
    senha: 'senhaForte123',
  };

  it('deve retornar sem erros para dados válidos de cadastro', () => {
    const erros = validarAluno(dadosValidos);
    expect(Object.keys(erros).length).toBe(0);
  });

  it('deve exigir nome preenchido', () => {
    expect(validarAluno({ ...dadosValidos, nome: '' }).nome).toBe('O campo nome é obrigatório.');
    expect(validarAluno({ ...dadosValidos, nome: '   ' }).nome).toBe('O campo nome é obrigatório.');
  });

  it('deve validar obrigatoriedade e formato de e-mail', () => {
    expect(validarAluno({ ...dadosValidos, email: '' }).email).toBe(
      'O campo e-mail é obrigatório.',
    );
    expect(validarAluno({ ...dadosValidos, email: 'invalido' }).email).toBe(
      'Por favor, informe um endereço de e-mail válido.',
    );
  });

  it('deve exigir CPF, RG, endereço e curso preenchidos', () => {
    expect(validarAluno({ ...dadosValidos, cpf: '' }).cpf).toBe('O campo CPF é obrigatório.');
    expect(validarAluno({ ...dadosValidos, rg: '' }).rg).toBe('O campo RG é obrigatório.');
    expect(validarAluno({ ...dadosValidos, endereco: '' }).endereco).toBe(
      'O campo endereço é obrigatório.',
    );
    expect(validarAluno({ ...dadosValidos, curso: '' }).curso).toBe('O campo curso é obrigatório.');
  });

  it('deve exigir instituição de ensino selecionada', () => {
    expect(validarAluno({ ...dadosValidos, id_instituicao: '' }).id_instituicao).toBe(
      'Selecione uma instituição de ensino.',
    );
    expect(validarAluno({ ...dadosValidos, id_instituicao: undefined }).id_instituicao).toBe(
      'Selecione uma instituição de ensino.',
    );
  });

  it('deve validar login e senha no cadastro', () => {
    expect(validarAluno({ ...dadosValidos, login: '' }).login).toBe('O campo login é obrigatório.');
    expect(validarAluno({ ...dadosValidos, senha: '' }).senha).toBe('O campo senha é obrigatório.');
    expect(validarAluno({ ...dadosValidos, senha: '   ' }).senha).toBe(
      'A senha não pode conter apenas espaços.',
    );
    expect(validarAluno({ ...dadosValidos, senha: '123' }).senha).toBe(
      'A senha deve conter no mínimo 8 caracteres.',
    );
    expect(validarAluno({ ...dadosValidos, senha: 'a'.repeat(73) }).senha).toBe(
      'A senha deve conter no máximo 72 caracteres.',
    );
  });

  it('na edição deve permitir manter senha em branco e ignorar login', () => {
    const dadosEdicao: DadosValidacaoAluno = {
      ...dadosValidos,
      login: '',
      senha: '',
    };
    const erros = validarAluno(dadosEdicao, true);
    expect(erros.login).toBeUndefined();
    expect(erros.senha).toBeUndefined();
  });

  it('na edição deve validar nova senha caso fornecida', () => {
    expect(validarAluno({ ...dadosValidos, senha: '   ' }, true).senha).toBe(
      'A nova senha não pode conter apenas espaços.',
    );
    expect(validarAluno({ ...dadosValidos, senha: 'curta' }, true).senha).toBe(
      'A nova senha deve conter no mínimo 8 caracteres.',
    );
    expect(validarAluno({ ...dadosValidos, senha: 'a'.repeat(73) }, true).senha).toBe(
      'A nova senha deve conter no máximo 72 caracteres.',
    );
  });
});

describe('validarEmpresa', () => {
  const dadosValidos: DadosValidacaoEmpresa = {
    nome: 'Empresa Teste Ltda',
    email: 'contato@empresa.com',
    cnpj: '00000000000191',
    login: 'empresa.teste',
    senha: 'senhaForte123',
  };

  it('deve retornar sem erros para dados válidos de cadastro', () => {
    const erros = validarEmpresa(dadosValidos);
    expect(Object.keys(erros).length).toBe(0);
  });

  it('deve exigir nome preenchido', () => {
    expect(validarEmpresa({ ...dadosValidos, nome: '' }).nome).toBe('O campo nome é obrigatório.');
    expect(validarEmpresa({ ...dadosValidos, nome: '   ' }).nome).toBe(
      'O campo nome é obrigatório.',
    );
  });

  it('deve validar obrigatoriedade e formato de e-mail corporativo', () => {
    expect(validarEmpresa({ ...dadosValidos, email: '' }).email).toBe(
      'O campo e-mail é obrigatório.',
    );
    expect(validarEmpresa({ ...dadosValidos, email: 'invalido' }).email).toBe(
      'Por favor, informe um endereço de e-mail válido.',
    );
  });

  it('deve exigir CNPJ preenchido', () => {
    expect(validarEmpresa({ ...dadosValidos, cnpj: '' }).cnpj).toBe('O campo CNPJ é obrigatório.');
  });

  it('deve validar login e senha no cadastro', () => {
    expect(validarEmpresa({ ...dadosValidos, login: '' }).login).toBe(
      'O campo login é obrigatório.',
    );
    expect(validarEmpresa({ ...dadosValidos, senha: '' }).senha).toBe(
      'O campo senha é obrigatório.',
    );
    expect(validarEmpresa({ ...dadosValidos, senha: '   ' }).senha).toBe(
      'A senha não pode conter apenas espaços.',
    );
    expect(validarEmpresa({ ...dadosValidos, senha: '123' }).senha).toBe(
      'A senha deve conter no mínimo 8 caracteres.',
    );
    expect(validarEmpresa({ ...dadosValidos, senha: 'a'.repeat(73) }).senha).toBe(
      'A senha deve conter no máximo 72 caracteres.',
    );
  });

  it('na edição deve permitir manter senha em branco e ignorar login', () => {
    const dadosEdicao: DadosValidacaoEmpresa = {
      ...dadosValidos,
      login: '',
      senha: '',
    };
    const erros = validarEmpresa(dadosEdicao, true);
    expect(erros.login).toBeUndefined();
    expect(erros.senha).toBeUndefined();
  });

  it('na edição deve validar nova senha caso fornecida', () => {
    expect(validarEmpresa({ ...dadosValidos, senha: '   ' }, true).senha).toBe(
      'A nova senha não pode conter apenas espaços.',
    );
    expect(validarEmpresa({ ...dadosValidos, senha: 'curta' }, true).senha).toBe(
      'A nova senha deve conter no mínimo 8 caracteres.',
    );
    expect(validarEmpresa({ ...dadosValidos, senha: 'a'.repeat(73) }, true).senha).toBe(
      'A nova senha deve conter no máximo 72 caracteres.',
    );
  });
});
