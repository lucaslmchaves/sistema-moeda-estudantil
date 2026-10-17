// Testes unitários para o utilitário de extração tolerante de erros da API.
import { describe, expect, it } from 'vitest';
import { extrairMensagemErro } from '../../src/utils/erros';

describe('extrairMensagemErro', () => {
  it('deve extrair mensagem no formato detalhe (padrão do projeto)', () => {
    const erro = { detalhe: 'CPF informado já está cadastrado.' };
    expect(extrairMensagemErro(erro)).toBe('CPF informado já está cadastrado.');
  });

  it('deve extrair mensagem no formato detalhe vindo do tratador 422', () => {
    const erro422 = {
      detalhe: 'nome: campo obrigatório; senha: a senha não pode conter apenas espaços.',
    };
    expect(extrairMensagemErro(erro422)).toBe(
      'nome: campo obrigatório; senha: a senha não pode conter apenas espaços.',
    );
  });

  it('deve extrair mensagem de erro de rede em falha de conexão', () => {
    const err = new Error('Não foi possível conectar ao servidor. Verifique se a API está no ar.');
    expect(extrairMensagemErro(err)).toBe(
      'Não foi possível conectar ao servidor. Verifique se a API está no ar.',
    );
  });

  it('deve extrair mensagem no formato detail string do FastAPI', () => {
    const erro = { detail: 'Recurso não encontrado' };
    expect(extrairMensagemErro(erro)).toBe('Recurso não encontrado');
  });

  it('deve extrair mensagem no formato detail array de validação do FastAPI', () => {
    const erro = {
      detail: [
        { loc: ['body', 'email'], msg: 'endereço de e-mail inválido' },
        { loc: ['body', 'senha'], msg: 'deve conter no mínimo 8 caracteres' },
      ],
    };
    expect(extrairMensagemErro(erro)).toBe(
      'email: endereço de e-mail inválido; senha: deve conter no mínimo 8 caracteres',
    );
  });

  it('deve extrair mensagem de string JSON serializada', () => {
    const jsonStr = JSON.stringify({ detalhe: 'Login em uso.' });
    expect(extrairMensagemErro(jsonStr)).toBe('Login em uso.');
  });

  it('deve extrair mensagem de Error', () => {
    const err = new Error('Falha de conexão com a API.');
    expect(extrairMensagemErro(err)).toBe('Falha de conexão com a API.');
  });

  it('deve retornar mensagem padrão quando objeto for nulo ou vazio', () => {
    expect(extrairMensagemErro(null)).toBe('Ocorreu um erro inesperado.');
    expect(extrairMensagemErro({})).toBe('Ocorreu um erro inesperado.');
  });
});
