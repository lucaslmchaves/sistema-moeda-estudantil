// @vitest-environment jsdom
// Testes da caixa de alerta.
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TEMPO_DO_AVISO_MS } from '../../../src/componentes/feedback/AvisoFlutuante';
import { MensagemAlerta } from '../../../src/componentes/feedback/MensagemAlerta';

afterEach(cleanup);

describe('MensagemAlerta', () => {
  it('não mostra nada quando não há mensagem', () => {
    const { container } = render(<MensagemAlerta tipo="erro" mensagem={null} />);

    expect(container.innerHTML).toBe('');
  });

  it('usa a função de alerta para erros e de status para sucessos', () => {
    const { rerender } = render(<MensagemAlerta tipo="erro" mensagem="Falhou." />);
    expect(screen.getByRole('alert').textContent).toContain('Falhou.');

    rerender(<MensagemAlerta tipo="sucesso" mensagem="Deu certo." />);
    expect(screen.getByRole('status').textContent).toContain('Deu certo.');
  });

  it('fecha o aviso de sucesso sozinho, mas espera enquanto o ponteiro está nele', () => {
    vi.useFakeTimers();
    const aoFechar = vi.fn();
    render(<MensagemAlerta tipo="sucesso" mensagem="Deu certo." onFechar={aoFechar} />);

    fireEvent.mouseEnter(screen.getByRole('status'));
    act(() => vi.advanceTimersByTime(TEMPO_DO_AVISO_MS * 2));
    expect(aoFechar).not.toHaveBeenCalled();

    fireEvent.mouseLeave(screen.getByRole('status'));
    act(() => vi.advanceTimersByTime(TEMPO_DO_AVISO_MS));
    expect(aoFechar).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('chama o fechamento ao clicar no botão', () => {
    const aoFechar = vi.fn();
    render(<MensagemAlerta tipo="erro" mensagem="Falhou." onFechar={aoFechar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Fechar mensagem' }));

    expect(aoFechar).toHaveBeenCalled();
  });
});
