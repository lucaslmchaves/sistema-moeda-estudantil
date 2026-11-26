// @vitest-environment jsdom
// Testes da troca de perfil na tela de login.
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { ProvedorAutenticacao } from '../../../src/contextos/ProvedorAutenticacao';
import { Entrar } from '../../../src/paginas/publicas/Entrar';

afterEach(cleanup);

const Endereco = () => <span data-testid="endereco">{useLocation().pathname}</span>;

describe('Entrar', () => {
  it('troca de perfil sem mudar o endereço e sem apagar o que foi digitado', () => {
    render(
      <MemoryRouter initialEntries={['/entrar']}>
        <ProvedorAutenticacao>
          <Entrar />
          <Endereco />
        </ProvedorAutenticacao>
      </MemoryRouter>,
    );
    const login = screen.getByLabelText(/Login/) as HTMLInputElement;
    fireEvent.change(login, { target: { value: 'prof.carlos' } });

    fireEvent.click(screen.getByRole('button', { name: 'Professor' }));

    expect(screen.getByTestId('endereco').textContent).toBe('/entrar');
    expect(screen.getByRole('button', { name: 'Professor' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(login.value).toBe('prof.carlos');
    expect(login.placeholder).toBe('prof.nome');
    expect(document.title).toBe('Entrar como professor · Moeda Estudantil');
  });
});
