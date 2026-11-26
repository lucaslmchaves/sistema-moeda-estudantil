// Aviso de sucesso que flutua no canto da tela e some sozinho. Enquanto o ponteiro ou o
// foco está nele, a contagem para.
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icone } from '../icones/Icone';

export const TEMPO_DO_AVISO_MS = 6000;

interface AvisoFlutuanteProps {
  mensagem: string;
  onFechar?: () => void;
}

export const AvisoFlutuante: React.FC<AvisoFlutuanteProps> = ({ mensagem, onFechar }) => {
  const [parado, setParado] = useState(false);
  const fechar = useRef(onFechar);
  fechar.current = onFechar;
  const temFechamento = Boolean(onFechar);

  useEffect(() => {
    if (parado || !temFechamento) return;
    const fim = window.setTimeout(() => fechar.current?.(), TEMPO_DO_AVISO_MS);
    return () => window.clearTimeout(fim);
  }, [mensagem, parado, temFechamento]);

  return createPortal(
    <div
      role="status"
      onMouseEnter={() => setParado(true)}
      onMouseLeave={() => setParado(false)}
      onFocus={() => setParado(true)}
      onBlur={() => setParado(false)}
      className="fixed inset-x-4 bottom-4 z-[60] animate-subir overflow-hidden rounded-cartao border border-positivo/25 bg-superficie shadow-flutuante sm:top-5 sm:right-5 sm:bottom-auto sm:left-auto sm:w-[380px]"
    >
      <div className="flex items-start gap-3 p-4 text-sm">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-positivo-fundo text-positivo">
          <Icone nome="check-circle" tamanho={18} />
        </span>
        <span className="flex-1 self-center leading-relaxed font-medium text-tinta">
          {mensagem}
        </span>
        {onFechar && (
          <button
            type="button"
            aria-label="Fechar mensagem"
            onClick={onFechar}
            className="-m-1 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-tinta-3 transition hover:bg-black/5 hover:text-tinta"
          >
            <Icone nome="x" tamanho={16} />
          </button>
        )}
      </div>
      {temFechamento && !parado && (
        <span
          aria-hidden="true"
          key={mensagem}
          className="barra-de-tempo block h-1 w-full bg-positivo"
          style={{ animationDuration: `${TEMPO_DO_AVISO_MS}ms` }}
        />
      )}
    </div>,
    document.body,
  );
};
