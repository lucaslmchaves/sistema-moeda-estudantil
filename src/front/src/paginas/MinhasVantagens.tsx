// Página da empresa parceira: lista, cadastro e exclusão das suas vantagens.
import React from 'react';
import { urlDaApi } from '../api/cliente';
import { excluirVantagem, listarMinhasVantagens } from '../api/vantagens';
import { PaginaListagem } from '../componentes/PaginaListagem';
import type { ColunaTabela } from '../componentes/Tabela';
import { useListagem } from '../hooks/useListagem';
import type { Vantagem } from '../tipos/vantagem';
import { classeBotao } from '../utils/estilos';
import { formatarMoedas } from '../utils/formatacao';

const COLUNAS_BASE: ColunaTabela<Vantagem>[] = [
  {
    cabecalho: 'Foto',
    render: (v) => (
      <img src={urlDaApi(v.foto)} alt={v.descricao} className="h-12 w-12 rounded object-cover" />
    ),
  },
  { cabecalho: 'Descrição', render: (v) => <strong>{v.descricao}</strong> },
  { cabecalho: 'Custo', render: (v) => formatarMoedas(v.custo) },
];

// Mostra a tabela de vantagens da empresa com a ação de excluir.
export const MinhasVantagens: React.FC = () => {
  const listagem = useListagem<Vantagem>({
    carregarFn: listarMinhasVantagens,
    excluirFn: excluirVantagem,
    obterId: (vantagem) => vantagem.id_vantagem,
    obterNome: (vantagem) => vantagem.descricao,
  });

  const colunas: ColunaTabela<Vantagem>[] = [
    ...COLUNAS_BASE,
    {
      cabecalho: 'Ações',
      alinhamento: 'right',
      render: (vantagem) => (
        <button
          type="button"
          className={classeBotao('perigo', true)}
          onClick={() => listagem.abrirConfirmacaoExclusao(vantagem)}
        >
          Excluir
        </button>
      ),
    },
  ];

  return (
    <PaginaListagem
      titulo="Minhas Vantagens"
      descricao="Vantagens que a sua empresa oferece em troca de moedas"
      rotaNovo="/minhas-vantagens/nova"
      textoNovo="+ Nova Vantagem"
      textoCarregando="Carregando vantagens..."
      tituloVazio="Nenhuma vantagem cadastrada"
      mensagemVazia="Cadastre a primeira vantagem para os alunos poderem trocá-la por moedas."
      textoPrimeiroCadastro="Cadastrar Primeira Vantagem"
      tituloExclusao="Confirmar Exclusão de Vantagem"
      mensagemExclusao={(vantagem) =>
        `Tem certeza que deseja excluir a vantagem "${vantagem.descricao}"? Ela deixará de aparecer no catálogo.`
      }
      colunas={colunas}
      chaveExtrator={(vantagem) => vantagem.id_vantagem}
      listagem={listagem}
    />
  );
};
