// Caixa de alerta para mensagens de sucesso ou de erro.
import React, { useEffect, useRef } from 'react';
import { Icone } from '../icones/Icone';

interface MensagemAlertaProps {
  tipo: 'erro' | 'sucesso';
  mensagem: string | null;
  onFechar?: () => void;
}

const ESTILO_POR_TIPO = {
  erro: { caixa: 'border-negativo/20 bg-negativo-fundo text-negativo', icone: 'warning-circle' },
  sucesso: { caixa: 'border-positivo/20 bg-positivo-fundo text-positivo', icone: 'check-circle' },
} as const;

// Mostra a mensagem em destaque, com botão opcional para dispensá-la.
export const MensagemAlerta: React.FC<MensagemAlertaProps> = ({ tipo, mensagem, onFechar }) => {
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tipo === 'erro' && mensagem) {
      caixa.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
    }
  }, [tipo, mensagem]);

  if (!mensagem) return null;
  const estilo = ESTILO_POR_TIPO[tipo];

  return (
    <div
      ref={caixa}
      role={tipo === 'erro' ? 'alert' : 'status'}
      className={`mb-6 flex animate-surgir items-start gap-3 rounded-controle border px-4 py-3 text-sm ${estilo.caixa}`}
    >
      <Icone nome={estilo.icone} tamanho={20} className="mt-px" />
      <span className="flex-1 leading-relaxed font-medium">{mensagem}</span>
      {onFechar && (
        <button
          type="button"
          aria-label="Fechar mensagem"
          onClick={onFechar}
          className="-m-1 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-inherit opacity-70 transition hover:bg-black/5 hover:opacity-100"
        >
          <Icone nome="x" tamanho={16} />
        </button>
      )}
    </div>
  );
};
