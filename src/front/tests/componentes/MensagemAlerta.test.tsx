// @vitest-environment jsdom
// Testes da caixa de alerta.
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MensagemAlerta } from '../../src/componentes/MensagemAlerta';

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

  it('chama o fechamento ao clicar no botão', () => {
    const aoFechar = vi.fn();
    render(<MensagemAlerta tipo="erro" mensagem="Falhou." onFechar={aoFechar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Fechar mensagem' }));

    expect(aoFechar).toHaveBeenCalled();
  });
});
