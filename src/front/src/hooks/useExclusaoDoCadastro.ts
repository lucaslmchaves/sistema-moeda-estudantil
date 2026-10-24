// Hook da exclusão do próprio cadastro: confirma, exclui, encerra a sessão e volta ao login.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extrairMensagemErro } from '../utils/erros';
import { useAutenticacao } from './useAutenticacao';

// Controla a confirmação e a execução da exclusão do cadastro do usuário logado.
export function useExclusaoDoCadastro(excluirFn: () => Promise<void>) {
  const navigate = useNavigate();
  const { sair } = useAutenticacao();
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Exclui o cadastro, encerra a sessão e leva ao login com um aviso.
  const confirmar = async () => {
    setExcluindo(true);
    setErro(null);
    try {
      await excluirFn();
      sair();
      navigate('/entrar', { state: { mensagemSucesso: 'Seu cadastro foi excluído.' } });
    } catch (falha) {
      setErro(extrairMensagemErro(falha));
      setConfirmando(false);
    } finally {
      setExcluindo(false);
    }
  };

  return {
    confirmando,
    excluindo,
    erro,
    setErro,
    abrir: () => setConfirmando(true),
    fechar: () => setConfirmando(false),
    confirmar,
  };
}
