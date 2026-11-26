// @vitest-environment jsdom
// Testes das cores dos valores: verde para o que entra, vermelho para o que sai.
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ValorMoedas } from '../../src/componentes/marca/Moedas';

afterEach(cleanup);

const montar = (elemento: React.ReactElement) =>
  render(elemento).container.firstElementChild as HTMLElement;

describe('ValorMoedas', () => {
  it('pinta de verde o que entra e de vermelho o que sai, com a moeda ao lado', () => {
    const entrada = montar(<ValorMoedas valor={150} sinal semUnidade />);
    expect(entrada.className).toContain('text-positivo');
    expect(entrada.textContent).toBe('+150');
    expect(entrada.querySelector('svg')).not.toBeNull();

    const saida = montar(<ValorMoedas valor={-120} sinal semUnidade />);
    expect(saida.className).toContain('text-negativo');
    expect(saida.textContent).toBe('−120');
  });

  it('usa tons claros no fundo escuro', () => {
    expect(montar(<ValorMoedas valor={5} sinal fundoEscuro />).className).toContain(
      'text-emerald-300',
    );
    expect(montar(<ValorMoedas valor={-5} sinal fundoEscuro />).className).toContain(
      'text-red-300',
    );
  });

  it('deixa neutro o zero e os valores sem sinal, como o saldo e o custo', () => {
    for (const elemento of [<ValorMoedas valor={0} sinal />, <ValorMoedas valor={730} />]) {
      expect(montar(elemento).className).not.toMatch(/text-(positivo|negativo)/);
    }
  });
});
