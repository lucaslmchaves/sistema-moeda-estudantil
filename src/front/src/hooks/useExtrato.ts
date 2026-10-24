// Hook do extrato: carrega o saldo e as movimentações do usuário logado.
import { useCallback, useEffect, useState } from 'react';
import { consultarExtrato } from '../api/moedas';
import type { Extrato } from '../tipos/moedas';
import { extrairMensagemErro } from '../utils/erros';

// Busca o extrato ao abrir a tela e permite recarregá-lo depois de uma operação.
export function useExtrato() {
  const [extrato, setExtrato] = useState<Extrato | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      setExtrato(await consultarExtrato());
    } catch (falha) {
      setErro(extrairMensagemErro(falha));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { extrato, carregando, erro, setErro, recarregar: carregar };
}
