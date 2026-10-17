// @vitest-environment jsdom
// Testes da tabela genérica.
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Tabela } from '../../src/componentes/Tabela';

afterEach(cleanup);

describe('Tabela', () => {
  const colunas = [
    { cabecalho: 'Nome', render: (item: { nome: string }) => item.nome },
    { cabecalho: 'Ações', alinhamento: 'right' as const, render: () => 'editar' },
  ];

  it('mostra um cabeçalho por coluna e uma linha por item', () => {
    render(
      <Tabela
        colunas={colunas}
        dados={[{ nome: 'Ana' }, { nome: 'Bia' }]}
        chaveExtrator={(i) => i.nome}
      />,
    );

    expect(screen.getAllByRole('columnheader').map((c) => c.textContent)).toEqual([
      'Nome',
      'Ações',
    ]);
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('Bia')).not.toBeNull();
  });

  it('alinha à direita as colunas que pedem isso', () => {
    render(<Tabela colunas={colunas} dados={[{ nome: 'Ana' }]} chaveExtrator={(i) => i.nome} />);

    expect(screen.getByRole('columnheader', { name: 'Ações' }).className).toContain('text-right');
  });
});
