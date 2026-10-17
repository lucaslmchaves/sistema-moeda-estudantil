// Página de listagem e exclusão de empresas parceiras.
import React from 'react';
import { excluirEmpresa, listarEmpresas } from '../api/empresas';
import { AcoesLinha } from '../componentes/AcoesLinha';
import { PaginaListagem } from '../componentes/PaginaListagem';
import { SeloStatus } from '../componentes/SeloStatus';
import type { ColunaTabela } from '../componentes/Tabela';
import { useListagem } from '../hooks/useListagem';
import type { Empresa } from '../tipos/empresa';
import { formatarCnpj } from '../utils/formatacao';

// Mostra a tabela de empresas parceiras com as ações de editar e de excluir.
export const EmpresasLista: React.FC = () => {
  const listagem = useListagem<Empresa>({
    carregarFn: listarEmpresas,
    excluirFn: excluirEmpresa,
    obterId: (empresa) => empresa.id_usuario,
    obterNome: (empresa) => empresa.nome,
  });

  const colunas: ColunaTabela<Empresa>[] = [
    { cabecalho: 'ID', render: (empresa) => empresa.id_usuario },
    { cabecalho: 'Nome', render: (empresa) => <strong>{empresa.nome}</strong> },
    { cabecalho: 'E-mail', render: (empresa) => empresa.email },
    {
      cabecalho: 'CNPJ',
      render: (empresa) => <span className="whitespace-nowrap">{formatarCnpj(empresa.cnpj)}</span>,
    },
    { cabecalho: 'Login', render: (empresa) => <code>{empresa.login}</code> },
    { cabecalho: 'Status', render: (empresa) => <SeloStatus ativo={empresa.ativo} /> },
    {
      cabecalho: 'Ações',
      alinhamento: 'right',
      render: (empresa) => (
        <AcoesLinha
          rotaEdicao={`/empresas/${empresa.id_usuario}/editar`}
          onExcluir={() => listagem.abrirConfirmacaoExclusao(empresa)}
        />
      ),
    },
  ];

  return (
    <PaginaListagem
      titulo="Empresas Parceiras"
      descricao="Empresas conveniadas que oferecem produtos e vantagens para resgate"
      rotaNovo="/empresas/novo"
      textoNovo="+ Nova Empresa"
      textoCarregando="Carregando empresas parceiras..."
      tituloVazio="Nenhuma empresa cadastrada"
      mensagemVazia="Não há empresas parceiras ativas cadastradas no momento."
      textoPrimeiroCadastro="Cadastrar Primeira Empresa"
      tituloExclusao="Confirmar Exclusão de Empresa"
      mensagemExclusao={(empresa) =>
        `Tem certeza que deseja excluir a empresa parceira "${empresa.nome}"? O cadastro será inativado no sistema.`
      }
      colunas={colunas}
      chaveExtrator={(empresa) => empresa.id_usuario}
      listagem={listagem}
    />
  );
};
