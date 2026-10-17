// Caixa de alerta para mensagens de sucesso ou de erro.
import React from 'react';

interface MensagemAlertaProps {
  tipo: 'erro' | 'sucesso';
  mensagem: string | null;
  onFechar?: () => void;
}

const ESTILO_POR_TIPO = {
  erro: 'border-red-200 bg-red-50 text-red-700',
  sucesso: 'border-emerald-200 bg-emerald-50 text-emerald-800',
};

// Mostra a mensagem em destaque, com botão opcional para dispensá-la.
export const MensagemAlerta: React.FC<MensagemAlertaProps> = ({ tipo, mensagem, onFechar }) => {
  if (!mensagem) return null;

  return (
    <div
      role={tipo === 'erro' ? 'alert' : 'status'}
      className={`mb-5 flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${ESTILO_POR_TIPO[tipo]}`}
    >
      <span>{mensagem}</span>
      {onFechar && (
        <button
          type="button"
          aria-label="Fechar mensagem"
          onClick={onFechar}
          className="ml-4 cursor-pointer border-0 bg-transparent font-bold text-inherit"
        >
          ✕
        </button>
      )}
    </div>
  );
};
