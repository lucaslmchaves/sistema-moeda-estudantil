// Faz o conteúdo surgir quando ele chega na área visível da tela.
import React, { useEffect, useRef, useState } from 'react';

interface RevelarProps {
  children: React.ReactNode;
  className?: string;
}

export const Revelar: React.FC<RevelarProps> = ({ children, className = '' }) => {
  const alvo = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (visivel || !alvo.current) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) setVisivel(true);
      },
      { threshold: 0.15 },
    );
    observador.observe(alvo.current);
    return () => observador.disconnect();
  }, [visivel]);

  return (
    <div ref={alvo} className={`revelar ${visivel ? 'visivel' : ''} ${className}`}>
      {children}
    </div>
  );
};
