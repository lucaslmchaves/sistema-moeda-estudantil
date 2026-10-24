// @vitest-environment jsdom
// Testes do modal de confirmação.
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ModalConfirmacao } from '../../../src/componentes/feedback/ModalConfirmacao';

afterEach(cleanup);

describe('ModalConfirmacao', () => {
  const propriedades = {
    aberto: true,
    titulo: 'Confirmar Exclusão',
    mensagem: 'Tem certeza?',
    onConfirmar: vi.fn(),
    onCancelar: vi.fn(),
  };

  it('não aparece quando está fechado', () => {
    render(<ModalConfirmacao {...propriedades} aberto={false} />);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('mostra título e mensagem e chama as ações dos botões', () => {
    render(<ModalConfirmacao {...propriedades} />);

    expect(screen.getByRole('dialog', { name: 'Confirmar Exclusão' })).not.toBeNull();
    expect(screen.getByText('Tem certeza?')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(propriedades.onConfirmar).toHaveBeenCalled();
    expect(propriedades.onCancelar).toHaveBeenCalled();
  });

  it('desabilita os botões e mostra o andamento enquanto exclui', () => {
    render(<ModalConfirmacao {...propriedades} carregando />);

    expect(screen.getByRole('button', { name: 'Excluindo...' }).hasAttribute('disabled')).toBe(
      true,
    );
    expect(screen.getByRole('button', { name: 'Cancelar' }).hasAttribute('disabled')).toBe(true);
  });
});
