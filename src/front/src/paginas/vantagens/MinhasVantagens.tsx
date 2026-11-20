// Página da empresa parceira: lista, cadastro e exclusão das suas vantagens.
import React from 'react';
import { urlDaApi } from '../../api/cliente';
import { excluirVantagem, listarMinhasVantagens } from '../../api/vantagens';
import { Icone } from '../../componentes/icones/Icone';
import { ValorMoedas } from '../../componentes/marca/Moedas';
import { PaginaListagem } from '../../componentes/tabela/PaginaListagem';
import type { ColunaTabela } from '../../componentes/tabela/Tabela';
import { useListagem } from '../../hooks/geral/useListagem';
import type { Vantagem } from '../../tipos/vantagem';

const COLUNAS_BASE: ColunaTabela<Vantagem>[] = [
  {
    cabecalho: 'Vantagem',
    render: (v) => (
      <div className="flex items-center gap-4">
        <img
          src={urlDaApi(v.foto)}
          alt=""
          className="size-14 shrink-0 rounded-xl bg-superficie-2 object-cover"
        />
        <span className="text-[15px] font-medium text-tinta">{v.descricao}</span>
      </div>
    ),
  },
  {
    cabecalho: 'Custo',
    largura: 'w-40',
    render: (v) => <ValorMoedas valor={v.custo} tamanho="sm" />,
  },
];

// Mostra a tabela de vantagens da empresa com a ação de excluir.
export const MinhasVantagens: React.FC = () => {
  const listagem = useListagem<Vantagem>({
    carregarFn: listarMinhasVantagens,
    excluirFn: excluirVantagem,
    obterId: (vantagem) => vantagem.id_vantagem,
    obterNome: (vantagem) => vantagem.descricao,
    mensagemExcluido: (nome) => `"${nome}" saiu do catálogo.`,
  });

  const colunas: ColunaTabela<Vantagem>[] = [
    ...COLUNAS_BASE,
    {
      cabecalho: 'Ações',
      alinhamento: 'right',
      largura: 'w-24',
      render: (vantagem) => (
        <button
          type="button"
          aria-label={`Excluir ${vantagem.descricao}`}
          title="Excluir"
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-tinta-3 transition hover:bg-negativo-fundo hover:text-negativo"
          onClick={() => listagem.abrirConfirmacaoExclusao(vantagem)}
        >
          <Icone nome="trash" tamanho={18} />
        </button>
      ),
    },
  ];

  return (
    <PaginaListagem
      titulo="Minhas vantagens"
      descricao="O que a sua empresa oferece aos alunos em troca de moedas."
      rotaNovo="/minhas-vantagens/nova"
      textoNovo="Nova vantagem"
      textoCarregando="Carregando vantagens..."
      tituloVazio="Nenhuma vantagem cadastrada"
      mensagemVazia="Cadastre a primeira para ela aparecer no catálogo dos alunos."
      textoPrimeiroCadastro="Cadastrar vantagem"
      tituloExclusao="Excluir vantagem?"
      mensagemExclusao={(vantagem) =>
        `"${vantagem.descricao}" deixa de aparecer no catálogo. Os resgates já feitos são mantidos.`
      }
      colunas={colunas}
      chaveExtrator={(vantagem) => vantagem.id_vantagem}
      listagem={listagem}
      iconeVazio="gift"
    />
  );
};
