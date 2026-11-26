// Carrega uma lista de vantagens para os painéis da página inicial.
import { useEffect, useState } from 'react';
import type { Vantagem } from '../../tipos/vantagem';

// Em caso de erro devolve lista vazia, para o painel não ficar carregando para sempre.
export function useVantagens(carregar: () => Promise<Vantagem[]>) {
  const [vantagens, setVantagens] = useState<Vantagem[] | null>(null);
  useEffect(() => {
    let ativo = true;
    carregar()
      .then((v) => ativo && setVantagens(v))
      .catch(() => ativo && setVantagens([]));
    return () => {
      ativo = false;
    };
  }, [carregar]);
  return vantagens;
}
