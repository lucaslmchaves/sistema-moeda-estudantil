// @vitest-environment jsdom
// Testes do provedor de autenticação, do guarda de rotas e do cabeçalho.
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { entrar } from '../../src/api/autenticacao';
import { Cabecalho } from '../../src/componentes/Cabecalho';
import { RotaProtegida } from '../../src/componentes/RotaProtegida';
import { ProvedorAutenticacao } from '../../src/contextos/ProvedorAutenticacao';
import { useAutenticacao } from '../../src/hooks/useAutenticacao';
import type { UsuarioLogado } from '../../src/tipos/autenticacao';
import { EVENTO_SESSAO_EXPIRADA, obterSessao, salvarSessao } from '../../src/utils/sessao';

vi.mock('../../src/api/autenticacao');

const ANA: UsuarioLogado = { id_usuario: 3, tipo_usuario: 'ALUNO', nome: 'Ana', login: 'ana' };

// Mostra o usuário atual e oferece botões para entrar e sair.
function Sonda() {
  const { usuario, aviso, entrar: fazerLogin, sair, limparAviso } = useAutenticacao();
  return (
    <div>
      <span>{usuario ? `logado:${usuario.login}` : 'visitante'}</span>
      <span>{aviso ? `aviso:${aviso}` : 'sem aviso'}</span>
      <button onClick={() => fazerLogin('ana', 'senha')}>entrar</button>
      <button onClick={() => sair()}>sair</button>
      <button onClick={() => sair('Até logo!')}>sair com aviso</button>
      <button onClick={limparAviso}>limpar aviso</button>
    </div>
  );
}

// Mostra o estado da navegação recebido na tela de login.
function TelaDeLogin() {
  const local = useLocation();
  return <span>{`origem:${local.state?.origem ?? 'nenhuma'}`}</span>;
}

function tela(caminho: string, perfis: UsuarioLogado['tipo_usuario'][]) {
  return (
    <MemoryRouter initialEntries={[caminho]}>
      <ProvedorAutenticacao>
        <Routes>
          <Route path="/" element={<span>início</span>} />
          <Route path="/entrar" element={<TelaDeLogin />} />
          <Route
            path="/restrita"
            element={
              <RotaProtegida perfis={perfis}>
                <span>conteúdo restrito</span>
              </RotaProtegida>
            }
          />
        </Routes>
      </ProvedorAutenticacao>
    </MemoryRouter>
  );
}

afterEach(cleanup);
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('ProvedorAutenticacao', () => {
  it('começa como visitante, entra, guarda a sessão e sai', async () => {
    vi.mocked(entrar).mockResolvedValue({ access_token: 't1', token_type: 'bearer', usuario: ANA });
    render(
      <ProvedorAutenticacao>
        <Sonda />
      </ProvedorAutenticacao>,
    );
    expect(screen.getByText('visitante')).not.toBeNull();

    fireEvent.click(screen.getByText('entrar'));
    await waitFor(() => expect(screen.getByText('logado:ana')).not.toBeNull());
    expect(obterSessao()?.token).toBe('t1');

    fireEvent.click(screen.getByText('sair'));
    expect(screen.getByText('visitante')).not.toBeNull();
    expect(obterSessao()).toBeNull();
  });

  it('guarda o aviso de quem sai e o apaga ao limpar', () => {
    salvarSessao({ token: 't1', usuario: ANA });
    render(
      <ProvedorAutenticacao>
        <Sonda />
      </ProvedorAutenticacao>,
    );
    expect(screen.getByText('sem aviso')).not.toBeNull();

    fireEvent.click(screen.getByText('sair com aviso'));
    expect(screen.getByText('aviso:Até logo!')).not.toBeNull();

    fireEvent.click(screen.getByText('limpar aviso'));
    expect(screen.getByText('sem aviso')).not.toBeNull();
  });

  it('restaura a sessão salva ao abrir a aplicação', () => {
    salvarSessao({ token: 't1', usuario: ANA });

    render(
      <ProvedorAutenticacao>
        <Sonda />
      </ProvedorAutenticacao>,
    );

    expect(screen.getByText('logado:ana')).not.toBeNull();
  });

  it('volta a visitante quando a API avisa que a sessão expirou', () => {
    salvarSessao({ token: 't1', usuario: ANA });
    render(
      <ProvedorAutenticacao>
        <Sonda />
      </ProvedorAutenticacao>,
    );

    act(() => {
      window.dispatchEvent(new Event(EVENTO_SESSAO_EXPIRADA));
    });

    expect(screen.getByText('visitante')).not.toBeNull();
  });

  it('exige o provedor para usar o hook', () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Sonda />)).toThrow('useAutenticacao deve ser usado dentro de');

    erro.mockRestore();
  });
});

describe('RotaProtegida', () => {
  it('manda o visitante para o login', () => {
    render(tela('/restrita', ['ALUNO']));

    expect(screen.getByText('origem:/restrita')).not.toBeNull();
  });

  it('não guarda a origem de quem acabou de sair da tela protegida', () => {
    salvarSessao({ token: 't1', usuario: ANA });
    render(
      <MemoryRouter initialEntries={['/restrita']}>
        <ProvedorAutenticacao>
          <Sonda />
          <Routes>
            <Route path="/entrar" element={<TelaDeLogin />} />
            <Route
              path="/restrita"
              element={
                <RotaProtegida perfis={['ALUNO']}>
                  <span>conteúdo restrito</span>
                </RotaProtegida>
              }
            />
          </Routes>
        </ProvedorAutenticacao>
      </MemoryRouter>,
    );
    expect(screen.getByText('conteúdo restrito')).not.toBeNull();

    fireEvent.click(screen.getByText('sair'));

    expect(screen.getByText('origem:nenhuma')).not.toBeNull();
  });

  it('manda para o início quem tem outro perfil', () => {
    salvarSessao({ token: 't1', usuario: ANA });

    render(tela('/restrita', ['PROFESSOR']));

    expect(screen.getByText('início')).not.toBeNull();
  });

  it('mostra o conteúdo para quem tem o perfil da tela', () => {
    salvarSessao({ token: 't1', usuario: ANA });

    render(tela('/restrita', ['ALUNO', 'PROFESSOR']));

    expect(screen.getByText('conteúdo restrito')).not.toBeNull();
  });
});

describe('Cabecalho', () => {
  function cabecalho() {
    return render(
      <MemoryRouter>
        <ProvedorAutenticacao>
          <Cabecalho />
        </ProvedorAutenticacao>
      </MemoryRouter>,
    );
  }

  it('mostra login e cadastros ao visitante, sem botão de sair', () => {
    cabecalho();

    expect(screen.getByRole('link', { name: 'Entrar' })).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Sou aluno' })).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull();
  });

  it('mostra o nome e os links do aluno logado e encerra a sessão ao sair', () => {
    salvarSessao({ token: 't1', usuario: ANA });
    cabecalho();

    expect(screen.getByText('Olá, Ana')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Vantagens' })).not.toBeNull();
    expect(screen.queryByRole('link', { name: 'Entrar' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

    expect(screen.getByRole('link', { name: 'Entrar' })).not.toBeNull();
    expect(obterSessao()).toBeNull();
  });
});
