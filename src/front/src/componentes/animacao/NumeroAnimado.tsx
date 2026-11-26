// Conta de zero até o valor quando ele aparece, para o saldo chamar a atenção.
import React, { useEffect, useState } from 'react';
import { podeAnimar } from '../../utils/movimento';

const DURACAO_MS = 900;

interface NumeroAnimadoProps {
  valor: number;
  children: (numero: number) => React.ReactNode;
}

export const NumeroAnimado: React.FC<NumeroAnimadoProps> = ({ valor, children }) => {
  const [numero, setNumero] = useState(() => (podeAnimar() ? 0 : valor));

  useEffect(() => {
    if (!podeAnimar()) {
      setNumero(valor);
      return;
    }
    let quadro = 0;
    const inicio = performance.now();
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / DURACAO_MS);
      // Desacelera no final.
      setNumero(Math.round(valor * (1 - Math.pow(1 - t, 3))));
      if (t < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    // Garante o valor certo se a aba estiver em segundo plano e os quadros não rodarem.
    const garantia = window.setTimeout(() => setNumero(valor), DURACAO_MS + 200);
    return () => {
      cancelAnimationFrame(quadro);
      window.clearTimeout(garantia);
    };
  }, [valor]);

  return <>{children(numero)}</>;
};
