// Botão que mostra o código do cupom como QR code, para a empresa ler em vez de digitar.
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import { classeBotao } from '../../utils/estilos';
import { Icone } from '../icones/Icone';

const JanelaDoQr: React.FC<{ codigo: string; aoFechar: () => void }> = ({ codigo, aoFechar }) => {
  const fechar = useRef<HTMLButtonElement>(null);
  const aoSair = useRef(aoFechar);
  aoSair.current = aoFechar;

  useEffect(() => {
    const focoAnterior = document.activeElement as HTMLElement | null;
    fechar.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoSair.current();
    };
    document.addEventListener('keydown', aoTeclar);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = overflow;
      focoAnterior?.focus?.();
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-surgir bg-tinta/40 backdrop-blur-[2px]"
        onClick={aoFechar}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-titulo"
        className="relative w-full max-w-xs animate-subir rounded-[20px] bg-superficie p-6 text-center shadow-flutuante"
      >
        <h3 id="qr-titulo" className="text-lg font-semibold tracking-[-0.01em] text-tinta">
          Cupom em QR code
        </h3>
        <p className="mt-1 text-sm text-tinta-3">Mostre na empresa parceira.</p>
        <div className="mt-5 flex justify-center rounded-cartao border border-linha bg-white p-4">
          <QRCodeSVG
            value={codigo}
            size={208}
            level="M"
            fgColor="#1e1b4b"
            title={`QR code do cupom ${codigo}`}
          />
        </div>
        <p className="mt-4 font-mono text-xl font-semibold tracking-[0.18em] text-tinta">
          {codigo}
        </p>
        <button
          ref={fechar}
          type="button"
          onClick={aoFechar}
          className={`${classeBotao('primario')} mt-5 w-full`}
        >
          Fechar
        </button>
      </div>
    </div>,
    document.body,
  );
};

export const QrDoCupom: React.FC<{ codigo: string; compacto?: boolean }> = ({
  codigo,
  compacto = false,
}) => {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label={`Mostrar QR code do cupom ${codigo}`}
        className={
          compacto
            ? 'inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold text-anil transition hover:bg-anil-100'
            : classeBotao('primario', 'grande')
        }
      >
        <Icone nome="qr-code" tamanho={compacto ? 14 : 18} />
        QR code
      </button>
      {aberto && <JanelaDoQr codigo={codigo} aoFechar={() => setAberto(false)} />}
    </>
  );
};
