// @vitest-environment jsdom
// Testes do QR code do cupom e da vantagem aberta a partir do painel.
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { consultarExtrato } from '../../src/api/moedas';
import { listarVantagens } from '../../src/api/vantagens';
import { QrDoCupom } from '../../src/componentes/moedas/QrDoCupom';
import { CatalogoVantagens } from '../../src/paginas/moedas/CatalogoVantagens';

vi.mock('../../src/api/moedas');
vi.mock('../../src/api/vantagens');

afterEach(cleanup);

describe('QrDoCupom', () => {
  it('abre o QR code com o código escrito embaixo e fecha com Esc', () => {
    render(<QrDoCupom codigo="9XVFEFPE" />);

    fireEvent.click(screen.getByRole('button', { name: 'Mostrar QR code do cupom 9XVFEFPE' }));
    const janela = screen.getByRole('dialog');
    expect(janela.querySelector('svg title')?.textContent).toBe('QR code do cupom 9XVFEFPE');
    expect(janela.textContent).toContain('9XVFEFPE');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('CatalogoVantagens vindo do painel', () => {
  it('já abre a confirmação da vantagem clicada', async () => {
    vi.mocked(consultarExtrato).mockResolvedValue({ saldo: 100, transacoes: [] });
    vi.mocked(listarVantagens).mockResolvedValue([
      {
        id_vantagem: 7,
        descricao: 'Café com pão de queijo',
        custo: 20,
        foto: '/fotos/1',
        nome_empresa: 'Cantina do Campus',
      } as Awaited<ReturnType<typeof listarVantagens>>[number],
    ]);

    render(
      <MemoryRouter initialEntries={[{ pathname: '/vantagens', state: { vantagem: 7 } }]}>
        <CatalogoVantagens />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByRole('dialog').textContent).toContain('Café'));
  });
});
