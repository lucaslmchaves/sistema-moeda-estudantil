// Componente raiz: sessão, roteador, cabeçalho e área de conteúdo das páginas.
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Cabecalho } from './componentes/layout/Cabecalho';
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

// Liga cada rota à sua página, protegendo as telas de cada perfil.
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ProvedorAutenticacao>
        <div className="flex min-h-screen flex-col">
          <Cabecalho />
          <main className="mx-auto my-8 w-full max-w-6xl flex-1 px-6">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/entrar" element={<Entrar />} />
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
          </main>
        </div>
      </ProvedorAutenticacao>
    </BrowserRouter>
  );
};

export default App;
