// @vitest-environment jsdom
// Testes da demonstração, das perguntas e da confirmação de envio.
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { listarAlunos } from '../../src/api/alunos';
import { consultarExtrato, enviarMoedas } from '../../src/api/moedas';
import { DemonstracaoDaMoeda } from '../../src/componentes/inicio/DemonstracaoDaMoeda';
import { PerguntasFrequentes } from '../../src/componentes/inicio/PerguntasFrequentes';
import { EnviarMoedas } from '../../src/paginas/moedas/EnviarMoedas';

vi.mock('../../src/api/alunos');
vi.mock('../../src/api/moedas');

afterEach(cleanup);

describe('DemonstracaoDaMoeda', () => {
  it('mostra a tela do passo escolhido', () => {
    render(<DemonstracaoDaMoeda />);

    fireEvent.click(screen.getByRole('button', { name: /Troca por vantagens/ }));

    expect(screen.getByText('Cupom da troca')).toBeTruthy();
  });
});

describe('PerguntasFrequentes', () => {
  it('abre uma pergunta e fecha ao clicar de novo', () => {
    render(<PerguntasFrequentes />);
    const botao = screen.getByRole('button', { name: 'As moedas valem dinheiro?' });

    act(() => botao.click());
    expect(botao.getAttribute('aria-expanded')).toBe('true');
    act(() => botao.click());
    expect(botao.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('EnviarMoedas', () => {
  it('só envia depois da confirmação e já traz o aluno do atalho escolhido', async () => {
    vi.mocked(listarAlunos).mockResolvedValue([{ id_usuario: 3, nome: 'Ana Souza', curso: 'ES' }]);
    vi.mocked(consultarExtrato).mockResolvedValue({ saldo: 1000, transacoes: [] });
    vi.mocked(enviarMoedas).mockResolvedValue({
      id_transacao: 1,
      id_aluno: 3,
      valor: 50,
      mensagem: 'Parabéns',
    });
    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/enviar-moedas', state: { aluno: 'Ana Souza' } }]}
      >
        <EnviarMoedas />
      </MemoryRouter>,
    );
    await waitFor(() => expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(true));
    fireEvent.click(screen.getByRole('button', { name: '50' }));
    fireEvent.change(screen.getByRole('textbox', { name: /Motivo/ }), {
      target: { value: 'Parabéns' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Enviar moedas' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(enviarMoedas).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar envio' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(enviarMoedas).toHaveBeenCalledWith({ id_aluno: 3, valor: 50, mensagem: 'Parabéns' });
  });
});
