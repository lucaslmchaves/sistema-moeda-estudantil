// Componente raiz: roteador, cabeçalho e área de conteúdo das páginas.
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Cabecalho } from './componentes/Cabecalho';
import { AlunoFormulario } from './paginas/AlunoFormulario';
import { AlunosLista } from './paginas/AlunosLista';
import { EmpresaFormulario } from './paginas/EmpresaFormulario';
import { EmpresasLista } from './paginas/EmpresasLista';
import { Inicio } from './paginas/Inicio';

// Liga cada rota de alunos e de empresas parceiras à sua página.
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Cabecalho />
        <main className="mx-auto my-8 w-full max-w-6xl flex-1 px-6">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/alunos" element={<AlunosLista />} />
            <Route path="/alunos/novo" element={<AlunoFormulario />} />
            <Route path="/alunos/:id/editar" element={<AlunoFormulario />} />
            <Route path="/empresas" element={<EmpresasLista />} />
            <Route path="/empresas/novo" element={<EmpresaFormulario />} />
            <Route path="/empresas/:id/editar" element={<EmpresaFormulario />} />
            <Route path="*" element={<Inicio />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
