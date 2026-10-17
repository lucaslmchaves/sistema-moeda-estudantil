// Botões de editar e de excluir exibidos no fim de cada linha das tabelas.
import React from 'react';
import { Link } from 'react-router-dom';
import { classeBotao } from '../utils/estilos';

interface AcoesLinhaProps {
  rotaEdicao: string;
  onExcluir: () => void;
}

// Oferece o link para a tela de edição e o botão que abre a confirmação de exclusão.
export const AcoesLinha: React.FC<AcoesLinhaProps> = ({ rotaEdicao, onExcluir }) => {
  return (
    <div className="flex justify-end gap-2">
      <Link to={rotaEdicao} className={classeBotao('secundario', true)}>
        Editar
      </Link>
      <button type="button" className={classeBotao('perigo', true)} onClick={onExcluir}>
        Excluir
      </button>
    </div>
  );
};
