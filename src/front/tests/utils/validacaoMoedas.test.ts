// Testes da validação dos formulários de login, envio de moedas e vantagem.
import { describe, expect, it } from 'vitest';
import {
  CUSTO_MAXIMO,
  FOTO_TAMANHO_MAXIMO,
  MENSAGEM_TAMANHO_MAXIMO,
  validarEnvioMoedas,
  validarLogin,
  validarVantagem,
} from '../../src/utils/validacao';

const foto = (type = 'image/png', size = 1000) => ({ type, size });

describe('validarLogin', () => {
  it('exige login e senha', () => {
    expect(validarLogin({ login: '  ', senha: '' })).toEqual({
      login: 'O campo login é obrigatório.',
      senha: 'O campo senha é obrigatório.',
    });
  });

  it('aceita login e senha preenchidos', () => {
    expect(validarLogin({ login: 'ana', senha: 'x' })).toEqual({});
  });
});

describe('validarEnvioMoedas', () => {
  const validos = { id_aluno: 3, valor: '50', mensagem: 'Ótima aula' };

  it('aceita aluno, valor inteiro positivo e mensagem', () => {
    expect(validarEnvioMoedas(validos)).toEqual({});
  });

  it('exige o aluno, o valor e a mensagem', () => {
    const erros = validarEnvioMoedas({ id_aluno: '', valor: '', mensagem: '  ' });

    expect(erros.id_aluno).toBe('Selecione o aluno que vai receber as moedas.');
    expect(erros.valor).toBe('O campo valor é obrigatório.');
    expect(erros.mensagem).toBe('O campo mensagem é obrigatório.');
  });

  it.each(['0', '-5', '1.5', 'abc'])('recusa o valor %s', (valor) => {
    expect(validarEnvioMoedas({ ...validos, valor }).valor).toBe(
      'O valor deve ser um número inteiro maior que zero.',
    );
  });

  it('recusa mensagem acima do limite', () => {
    const mensagem = 'x'.repeat(MENSAGEM_TAMANHO_MAXIMO + 1);

    expect(validarEnvioMoedas({ ...validos, mensagem }).mensagem).toBe(
      `A mensagem deve ter no máximo ${MENSAGEM_TAMANHO_MAXIMO} caracteres.`,
    );
  });
});

describe('validarVantagem', () => {
  const validos = { descricao: 'Almoço grátis', custo: '60', foto: foto() };

  it('aceita descrição, custo e foto válidos', () => {
    expect(validarVantagem(validos)).toEqual({});
  });

  it('exige descrição, custo e foto', () => {
    const erros = validarVantagem({ descricao: ' ', custo: '', foto: null });

    expect(erros.descricao).toBe('O campo descrição é obrigatório.');
    expect(erros.custo).toBe('O campo custo é obrigatório.');
    expect(erros.foto).toBe('Escolha a foto do produto.');
  });

  it('recusa custo zero, decimal e acima do limite', () => {
    expect(validarVantagem({ ...validos, custo: '0' }).custo).toBe(
      'O custo deve ser um número inteiro maior que zero.',
    );
    expect(validarVantagem({ ...validos, custo: '2.5' }).custo).toBe(
      'O custo deve ser um número inteiro maior que zero.',
    );
    expect(validarVantagem({ ...validos, custo: String(CUSTO_MAXIMO + 1) }).custo).toBe(
      `O custo deve ser no máximo ${CUSTO_MAXIMO}.`,
    );
  });

  it('recusa descrição acima do limite', () => {
    expect(validarVantagem({ ...validos, descricao: 'x'.repeat(256) }).descricao).toBe(
      'A descrição deve ter no máximo 255 caracteres.',
    );
  });

  it('recusa foto de outro formato ou acima de 2 MB', () => {
    expect(validarVantagem({ ...validos, foto: foto('image/gif') }).foto).toBe(
      'A foto deve estar no formato JPEG, PNG ou WebP.',
    );
    expect(
      validarVantagem({ ...validos, foto: foto('image/png', FOTO_TAMANHO_MAXIMO + 1) }).foto,
    ).toBe('A foto deve ter no máximo 2 MB.');
  });
});
