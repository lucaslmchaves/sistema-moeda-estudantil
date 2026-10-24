// Hook do catálogo: lista as vantagens e resgata a escolhida pelo aluno.
import { useCallback, useEffect, useState } from 'react';
import { resgatarVantagem } from '../../api/moedas';
import { listarVantagens } from '../../api/vantagens';
import type { Vantagem } from '../../tipos/vantagem';
import { extrairMensagemErro } from '../../utils/erros';
import { useExtrato } from './useExtrato';

// Carrega o catálogo e o saldo, e controla a confirmação e o resultado do resgate.
export function useCatalogo() {
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [vantagemParaResgatar, setVantagemParaResgatar] = useState<Vantagem | null>(null);
  const [resgatando, setResgatando] = useState(false);
  const { extrato, recarregar } = useExtrato();

  const carregar = useCallback(async () => {
    try {
      setVantagens(await listarVantagens());
    } catch (falha) {
      setErro(extrairMensagemErro(falha));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Resgata a vantagem escolhida, mostra o código do cupom e atualiza o saldo.
  const confirmarResgate = async () => {
    if (!vantagemParaResgatar) return;
    setResgatando(true);
    setErro(null);
    setSucesso(null);
    try {
      const resgate = await resgatarVantagem(vantagemParaResgatar.id_vantagem);
      setSucesso(
        `Resgate realizado! Código do cupom: ${resgate.codigo}. Enviamos o cupom para o seu e-mail.`,
      );
      await recarregar();
    } catch (falha) {
      setErro(extrairMensagemErro(falha));
    } finally {
      setVantagemParaResgatar(null);
      setResgatando(false);
    }
  };

  return {
    vantagens,
    carregando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    saldo: extrato?.saldo ?? null,
    vantagemParaResgatar,
    abrirResgate: setVantagemParaResgatar,
    fecharResgate: () => setVantagemParaResgatar(null),
    resgatando,
    confirmarResgate,
  };
}
