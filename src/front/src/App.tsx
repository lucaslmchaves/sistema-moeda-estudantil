// Componente raiz: sessão, roteador, cabeçalho e área de conteúdo das páginas.
import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { EstruturaApp, EstruturaPublica } from './componentes/layout/Cabecalho';
import { useAutenticacao } from './hooks/autenticacao/useAutenticacao';
import { RotaProtegida } from './componentes/acesso/RotaProtegida';
import { ProvedorAutenticacao } from './contextos/ProvedorAutenticacao';
import { AlunoFormulario } from './paginas/cadastros/AlunoFormulario';
import { CatalogoVantagens } from './paginas/moedas/CatalogoVantagens';
import { EmpresaFormulario } from './paginas/cadastros/EmpresaFormulario';
import { EnviarMoedas } from './paginas/moedas/EnviarMoedas';
import { Entrar } from './paginas/publicas/Entrar';
import { Extrato } from './paginas/moedas/Extrato';
import { Inicio } from './paginas/publicas/Inicio';
import { MinhasVantagens } from './paginas/vantagens/MinhasVantagens';
import { VantagemFormulario } from './paginas/vantagens/VantagemFormulario';

// Escolhe a casca da página: menu lateral para quem entrou, barra pública para visitantes
// e tela cheia para o login.
const Estrutura: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario } = useAutenticacao();
  const { pathname } = useLocation();
  if (usuario) return <EstruturaApp usuario={usuario}>{children}</EstruturaApp>;
  if (pathname.startsWith('/entrar')) return <>{children}</>;
  return <EstruturaPublica>{children}</EstruturaPublica>;
};

// Liga cada rota à sua página, protegendo as telas de cada perfil.
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ProvedorAutenticacao>
        <Estrutura>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/entrar/professor" element={<Entrar perfil="professor" />} />
            <Route path="/cadastro/aluno" element={<AlunoFormulario />} />
            <Route path="/cadastro/empresa" element={<EmpresaFormulario />} />
            <Route
              path="/alunos/:id/editar"
              element={
                <RotaProtegida perfis={['ALUNO']}>
                  <AlunoFormulario />
                </RotaProtegida>
              }
            />
            <Route
              path="/empresas/:id/editar"
              element={
                <RotaProtegida perfis={['EMPRESA_PARCEIRA']}>
                  <EmpresaFormulario />
                </RotaProtegida>
              }
            />
            <Route
              path="/extrato"
              element={
                <RotaProtegida perfis={['ALUNO', 'PROFESSOR']}>
                  <Extrato />
                </RotaProtegida>
              }
            />
            <Route
              path="/enviar-moedas"
              element={
                <RotaProtegida perfis={['PROFESSOR']}>
                  <EnviarMoedas />
                </RotaProtegida>
              }
            />
            <Route
              path="/vantagens"
              element={
                <RotaProtegida perfis={['ALUNO']}>
                  <CatalogoVantagens />
                </RotaProtegida>
              }
            />
            <Route
              path="/minhas-vantagens"
              element={
                <RotaProtegida perfis={['EMPRESA_PARCEIRA']}>
                  <MinhasVantagens />
                </RotaProtegida>
              }
            />
            <Route
              path="/minhas-vantagens/nova"
              element={
                <RotaProtegida perfis={['EMPRESA_PARCEIRA']}>
                  <VantagemFormulario />
                </RotaProtegida>
              }
            />
            <Route path="*" element={<Inicio />} />
          </Routes>
        </Estrutura>
      </ProvedorAutenticacao>
    </BrowserRouter>
  );
};

export default App;
