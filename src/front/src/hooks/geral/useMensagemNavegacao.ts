// Hook que recebe a mensagem de sucesso enviada pela tela anterior e permite dispensá-la.
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Lê a mensagem do estado da navegação uma única vez e a mantém até ser dispensada.
export function useMensagemNavegacao() {
  const location = useLocation();
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.mensagemSucesso) {
      setMensagem(location.state.mensagemSucesso);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return { mensagem, setMensagem };
}
