// Mensagens do sistema: o erro fica numa caixa na página e o sucesso num aviso flutuante.
import React, { useEffect, useRef } from 'react';
import { Icone } from '../icones/Icone';
import { AvisoFlutuante } from './AvisoFlutuante';

interface MensagemAlertaProps {
  tipo: 'erro' | 'sucesso';
  mensagem: string | null;
  onFechar?: () => void;
}

// Mostra a mensagem, com botão opcional para dispensá-la.
export const MensagemAlerta: React.FC<MensagemAlertaProps> = ({ tipo, mensagem, onFechar }) => {
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tipo === 'erro' && mensagem) {
      caixa.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
    }
  }, [tipo, mensagem]);

  if (!mensagem) return null;
  if (tipo === 'sucesso') return <AvisoFlutuante mensagem={mensagem} onFechar={onFechar} />;

  return (
    <div
      ref={caixa}
      role="alert"
      className="mb-6 flex animate-surgir items-start gap-3 rounded-controle border border-negativo/20 bg-negativo-fundo px-4 py-3 text-sm text-negativo"
    >
      <Icone nome="warning-circle" tamanho={20} className="mt-px" />
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
