// Página inicial com os módulos do sistema e atalhos para as telas.
import React from 'react';
import { Link } from 'react-router-dom';
import { CabecalhoPagina } from '../componentes/CabecalhoPagina';
import { Cartao } from '../componentes/Cartao';
import { classeBotao } from '../utils/estilos';

const MODULOS = [
  {
    titulo: '🎓 Gestão de Alunos',
    texto:
      'Cadastre novos estudantes, consulte os alunos ativos no sistema de mérito, atualize seus dados ou gerencie a exclusão de cadastros.',
    ver: { para: '/alunos', rotulo: 'Ver Alunos' },
    novo: { para: '/alunos/novo', rotulo: '+ Novo Aluno' },
  },
  {
    titulo: '🏢 Empresas Parceiras',
    texto:
      'Gerencie as empresas conveniadas que disponibilizam produtos, descontos e vantagens para resgate por moedas estudantis.',
    ver: { para: '/empresas', rotulo: 'Ver Empresas' },
    novo: { para: '/empresas/novo', rotulo: '+ Nova Empresa' },
  },
];

// Mostra um cartão por módulo, com os atalhos para listar e para cadastrar.
export const Inicio: React.FC = () => {
  return (
    <div>
      <CabecalhoPagina
        titulo="Painel de Controle"
        descricao="Sistema de Reconhecimento e Moeda Virtual Estudantil"
      />

      <div className="mt-6 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        {MODULOS.map(({ titulo, texto, ver, novo }) => (
          <Cartao key={titulo}>
            <h2 className="mb-3 text-xl font-semibold">{titulo}</h2>
            <p className="mb-6 text-sm text-slate-500">{texto}</p>
            <div className="flex gap-3">
              <Link to={ver.para} className={classeBotao('primario')}>
                {ver.rotulo}
              </Link>
              <Link to={novo.para} className={classeBotao('secundario')}>
                {novo.rotulo}
              </Link>
            </div>
          </Cartao>
        ))}
      </div>
    </div>
  );
};
