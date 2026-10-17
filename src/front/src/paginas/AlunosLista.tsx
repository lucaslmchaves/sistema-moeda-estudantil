// Página de listagem e exclusão de alunos.
import React from 'react';
import { excluirAluno, listarAlunos } from '../api/alunos';
import { AcoesLinha } from '../componentes/AcoesLinha';
import { PaginaListagem } from '../componentes/PaginaListagem';
import { SeloStatus } from '../componentes/SeloStatus';
import type { ColunaTabela } from '../componentes/Tabela';
import { useListagem } from '../hooks/useListagem';
import type { Aluno } from '../tipos/aluno';
import { formatarCpf } from '../utils/formatacao';

// Mostra a tabela de alunos com as ações de editar e de excluir.
export const AlunosLista: React.FC = () => {
  const listagem = useListagem<Aluno>({
    carregarFn: listarAlunos,
    excluirFn: excluirAluno,
    obterId: (aluno) => aluno.id_usuario,
    obterNome: (aluno) => aluno.nome,
  });

  const colunas: ColunaTabela<Aluno>[] = [
    { cabecalho: 'ID', render: (aluno) => aluno.id_usuario },
    { cabecalho: 'Nome', render: (aluno) => <strong>{aluno.nome}</strong> },
    { cabecalho: 'E-mail', render: (aluno) => aluno.email },
    {
      cabecalho: 'CPF',
      render: (aluno) => <span className="whitespace-nowrap">{formatarCpf(aluno.cpf)}</span>,
    },
    { cabecalho: 'Curso', render: (aluno) => aluno.curso },
    { cabecalho: 'Login', render: (aluno) => <code>{aluno.login}</code> },
    { cabecalho: 'Status', render: (aluno) => <SeloStatus ativo={aluno.ativo} /> },
    {
      cabecalho: 'Ações',
      alinhamento: 'right',
      render: (aluno) => (
        <AcoesLinha
          rotaEdicao={`/alunos/${aluno.id_usuario}/editar`}
          onExcluir={() => listagem.abrirConfirmacaoExclusao(aluno)}
        />
      ),
    },
  ];

  return (
    <PaginaListagem
      titulo="Alunos"
      descricao="Listagem e gerenciamento de estudantes ativos no sistema"
      rotaNovo="/alunos/novo"
      textoNovo="+ Novo Aluno"
      textoCarregando="Carregando alunos..."
      tituloVazio="Nenhum aluno cadastrado"
      mensagemVazia="Não há estudantes ativos cadastrados no momento."
      textoPrimeiroCadastro="Cadastrar Primeiro Aluno"
      tituloExclusao="Confirmar Exclusão de Aluno"
      mensagemExclusao={(aluno) =>
        `Tem certeza que deseja excluir o aluno "${aluno.nome}"? O registro será inativado e não poderá mais receber ou trocar moedas.`
      }
      colunas={colunas}
      chaveExtrator={(aluno) => aluno.id_usuario}
      listagem={listagem}
    />
  );
};
