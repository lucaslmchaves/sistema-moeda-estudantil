// Hook de listagem: carrega os itens, mostra mensagens e exclui com confirmação.
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { extrairMensagemErro } from '../utils/erros';

interface OpcoesListagem<T> {
  carregarFn: () => Promise<T[]>;
  excluirFn: (id: number) => Promise<void>;
  obterId: (item: T) => number;
  obterNome: (item: T) => string;
}

export interface EstadoListagem<T> {
  itens: T[];
  carregando: boolean;
  erro: string | null;
  sucesso: string | null;
  itemParaExcluir: T | null;
  excluindo: boolean;
  setErro: (mensagem: string | null) => void;
  setSucesso: (mensagem: string | null) => void;
  abrirConfirmacaoExclusao: (item: T) => void;
  fecharConfirmacaoExclusao: () => void;
  confirmarExclusao: () => Promise<void>;
}

// Controla o carregamento da lista e o fluxo de exclusão com confirmação.
export function useListagem<T>({
  carregarFn,
  excluirFn,
  obterId,
  obterNome,
}: OpcoesListagem<T>): EstadoListagem<T> {
  const [itens, setItens] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [itemParaExcluir, setItemParaExcluir] = useState<T | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const location = useLocation();

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setItens(await carregarFn());
    } catch (falha) {
      setErro(extrairMensagemErro(falha));
    } finally {
      setCarregando(false);
    }
  }, [carregarFn]);

  // Mostra a mensagem enviada pela tela anterior (cadastro ou edição) e recarrega a lista.
  useEffect(() => {
    if (location.state?.mensagemSucesso) {
      setSucesso(location.state.mensagemSucesso);
      window.history.replaceState({}, document.title);
    }
    carregar();
  }, [location.state, carregar]);

  // Exclui o item escolhido, avisa o resultado e atualiza a lista.
  const confirmarExclusao = async () => {
    if (!itemParaExcluir) return;
    setExcluindo(true);
    setErro(null);
    try {
      await excluirFn(obterId(itemParaExcluir));
      setSucesso(`Cadastro "${obterNome(itemParaExcluir)}" excluído com sucesso.`);
      setItemParaExcluir(null);
      await carregar();
    } catch (falha) {
      setErro(extrairMensagemErro(falha));
      setItemParaExcluir(null);
    } finally {
      setExcluindo(false);
    }
  };

  return {
    itens,
    carregando,
    erro,
    sucesso,
    itemParaExcluir,
    excluindo,
    setErro,
    setSucesso,
    abrirConfirmacaoExclusao: setItemParaExcluir,
    fecharConfirmacaoExclusao: () => setItemParaExcluir(null),
    confirmarExclusao,
  };
}
