// Percebe quando uma chamada à API está demorando (o servidor gratuito dorme e leva
// até um minuto para acordar) e avisa a tela.

export const EVENTO_SERVIDOR_LENTO = 'moeda:servidor-lento';
export const LIMITE_DE_ESPERA_MS = 4000;

let chamadasLentas = 0;

function avisar(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENTO_SERVIDOR_LENTO, { detail: chamadasLentas > 0 }));
}

// Começa a contar o tempo de uma chamada; a função devolvida encerra a contagem.
export function acompanharDemora(): () => void {
  let marcada = false;
  const espera = setTimeout(() => {
    marcada = true;
    chamadasLentas += 1;
    avisar();
  }, LIMITE_DE_ESPERA_MS);

  return () => {
    clearTimeout(espera);
    if (!marcada) return;
    marcada = false;
    chamadasLentas -= 1;
    avisar();
  };
}
