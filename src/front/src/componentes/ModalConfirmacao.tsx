// Janela de confirmação para ações que não podem ser desfeitas.
import React from 'react';
import { classeBotao } from '../utils/estilos';

interface ModalConfirmacaoProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  carregando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

// Pede a confirmação do usuário antes de executar a exclusão.
export const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = 'Excluir',
  textoCancelar = 'Cancelar',
  carregando = false,
  onConfirmar,
  onCancelar,
}) => {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-xl"
      >
        <h3 id="modal-titulo" className="mb-3 text-lg font-bold">
          {titulo}
        </h3>
        <p className="text-sm text-slate-500">{mensagem}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className={classeBotao('secundario')}
            onClick={onCancelar}
            disabled={carregando}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className={classeBotao('perigo')}
            onClick={onConfirmar}
            disabled={carregando}
          >
            {carregando ? 'Excluindo...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};
