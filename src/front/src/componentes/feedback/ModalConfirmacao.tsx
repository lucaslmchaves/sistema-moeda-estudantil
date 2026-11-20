// Janela de confirmação para ações que não podem ser desfeitas.
import React, { useEffect, useRef } from 'react';
import { classeBotao } from '../../utils/estilos';

interface ModalConfirmacaoProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  textoCarregando?: string;
  variante?: 'perigo' | 'primario';
  carregando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
  children?: React.ReactNode;
}

// Pede a confirmação do usuário; fecha com Esc ou clicando fora, exceto durante a operação.
export const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = 'Excluir',
  textoCancelar = 'Cancelar',
  textoCarregando = 'Excluindo...',
  variante = 'perigo',
  carregando = false,
  onConfirmar,
  onCancelar,
  children,
}) => {
  const cancelarRef = useRef<HTMLButtonElement>(null);
  const aoCancelar = useRef(onCancelar);
  const ocupado = useRef(carregando);
  aoCancelar.current = onCancelar;
  ocupado.current = carregando;

  useEffect(() => {
    if (!aberto) return;
    const focoAnterior = document.activeElement as HTMLElement | null;
    cancelarRef.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !ocupado.current) aoCancelar.current();
    };
    document.addEventListener('keydown', aoTeclar);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = overflow;
      focoAnterior?.focus?.();
    };
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 animate-surgir bg-tinta/40 backdrop-blur-[2px]"
        onClick={() => !carregando && onCancelar()}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        aria-describedby="modal-mensagem"
        className="relative w-full max-w-md animate-subir rounded-cartao bg-superficie p-6 shadow-flutuante"
      >
        <h3 id="modal-titulo" className="text-lg font-semibold tracking-[-0.01em]">
          {titulo}
        </h3>
        <p id="modal-mensagem" className="mt-1.5 text-sm leading-relaxed text-tinta-2">
          {mensagem}
        </p>
        {children && <div className="mt-5">{children}</div>}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelarRef}
            type="button"
            className={classeBotao('secundario')}
            onClick={onCancelar}
            disabled={carregando}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className={classeBotao(variante)}
            onClick={onConfirmar}
            disabled={carregando}
          >
            {carregando ? textoCarregando : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};
