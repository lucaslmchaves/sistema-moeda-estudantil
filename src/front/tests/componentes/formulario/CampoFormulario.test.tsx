// @vitest-environment jsdom
// Testes do campo de formulário.
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CampoFormulario } from '../../../src/componentes/formulario/CampoFormulario';

afterEach(cleanup);

describe('CampoFormulario', () => {
  it('mostra o rótulo com asterisco quando o campo é obrigatório', () => {
    render(<CampoFormulario id="nome" rotulo="Nome" obrigatorio />);

    expect(screen.getByLabelText(/Nome/)).not.toBeNull();
    expect(screen.getByText(/Nome \*/)).not.toBeNull();
  });

  it('mostra o erro de forma acessível e marca o campo como inválido', () => {
    render(<CampoFormulario id="cpf" rotulo="CPF" erro="O campo CPF é obrigatório." />);

    const campo = screen.getByLabelText('CPF');
    expect(screen.getByRole('alert').textContent).toBe('O campo CPF é obrigatório.');
    expect(campo.getAttribute('aria-invalid')).toBe('true');
    expect(campo.getAttribute('aria-describedby')).toBe('cpf-erro');
  });

  it('mostra a dica apenas enquanto não há erro', () => {
    const { rerender } = render(
      <CampoFormulario id="cpf" rotulo="CPF" dica="Com ou sem pontos." />,
    );
    expect(screen.getByText('Com ou sem pontos.')).not.toBeNull();

    rerender(<CampoFormulario id="cpf" rotulo="CPF" dica="Com ou sem pontos." erro="Inválido." />);
    expect(screen.queryByText('Com ou sem pontos.')).toBeNull();
  });

  it('avisa a alteração do texto digitado', () => {
    const aoAlterar = vi.fn();
    render(<CampoFormulario id="nome" rotulo="Nome" valor="" onChange={aoAlterar} />);

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } });

    expect(aoAlterar).toHaveBeenCalledTimes(1);
  });
});
