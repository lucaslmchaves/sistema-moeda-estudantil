// Página padrão de listagem: cabeçalho, alertas, tabela e confirmação de exclusão.
import { Link } from 'react-router-dom';
import type { EstadoListagem } from '../../hooks/geral/useListagem';
import { classeBotao } from '../../utils/estilos';
import { CabecalhoPagina } from '../layout/CabecalhoPagina';
import { Carregando } from '../feedback/Carregando';
import { EstadoVazio } from '../feedback/EstadoVazio';
import { MensagemAlerta } from '../feedback/MensagemAlerta';
import { ModalConfirmacao } from '../feedback/ModalConfirmacao';
import { ColunaTabela, Tabela } from './Tabela';

interface PaginaListagemProps<T> {
  titulo: string;
  descricao: string;
  rotaNovo: string;
  textoNovo: string;
  textoCarregando: string;
  tituloVazio: string;
  mensagemVazia: string;
  textoPrimeiroCadastro: string;
  tituloExclusao: string;
  mensagemExclusao: (item: T) => string;
  colunas: ColunaTabela<T>[];
  chaveExtrator: (item: T) => number;
  listagem: EstadoListagem<T>;
}

// Monta a tela de listagem a partir do estado do hook e das colunas informadas.
export function PaginaListagem<T>({
  titulo,
  descricao,
  rotaNovo,
  textoNovo,
  textoCarregando,
  tituloVazio,
  mensagemVazia,
  textoPrimeiroCadastro,
  tituloExclusao,
  mensagemExclusao,
  colunas,
  chaveExtrator,
  listagem,
}: PaginaListagemProps<T>) {
  const { itens, carregando, erro, sucesso, itemParaExcluir, excluindo } = listagem;

  return (
    <div>
      <CabecalhoPagina titulo={titulo} descricao={descricao}>
        <Link to={rotaNovo} className={classeBotao('primario')}>
          {textoNovo}
        </Link>
      </CabecalhoPagina>

      <MensagemAlerta tipo="erro" mensagem={erro} onFechar={() => listagem.setErro(null)} />
      <MensagemAlerta
        tipo="sucesso"
        mensagem={sucesso}
        onFechar={() => listagem.setSucesso(null)}
      />

      {carregando ? (
        <Carregando mensagem={textoCarregando} />
      ) : itens.length === 0 ? (
        <EstadoVazio titulo={tituloVazio} mensagem={mensagemVazia}>
          <Link to={rotaNovo} className={classeBotao('primario')}>
            {textoPrimeiroCadastro}
          </Link>
        </EstadoVazio>
      ) : (
        <Tabela colunas={colunas} dados={itens} chaveExtrator={chaveExtrator} />
      )}

      <ModalConfirmacao
        aberto={itemParaExcluir !== null}
        titulo={tituloExclusao}
        mensagem={itemParaExcluir ? mensagemExclusao(itemParaExcluir) : ''}
        carregando={excluindo}
        onConfirmar={listagem.confirmarExclusao}
        onCancelar={listagem.fecharConfirmacaoExclusao}
      />
    </div>
  );
}
