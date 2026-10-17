// Hook genérico de formulário: valores, erros por campo, validação e envio.
import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import { extrairMensagemErro } from '../utils/erros';
import type { ErrosValidacao } from '../utils/validacao';

interface OpcoesFormulario<T> {
  valoresIniciais: T;
  validar: (valores: T, edicao: boolean) => ErrosValidacao;
  edicao?: boolean;
}

// Controla os campos, mostra um erro por campo e só envia quando a validação passa.
export function useFormulario<T extends Record<string, unknown>>({
  valoresIniciais,
  validar,
  edicao = false,
}: OpcoesFormulario<T>) {
  const [valores, setValores] = useState<T>(valoresIniciais);
  const [erros, setErros] = useState<ErrosValidacao>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Altera um campo e apaga o erro dele, pois o usuário já está corrigindo.
  const alterarCampo = useCallback(<K extends keyof T>(campo: K, valor: T[K]) => {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }));
    setErros((anteriores) => {
      if (!anteriores[campo as string]) return anteriores;
      const restantes = { ...anteriores };
      delete restantes[campo as string];
      return restantes;
    });
  }, []);

  // Preenche vários campos de uma vez, por exemplo ao carregar um cadastro para edição.
  const definirValores = useCallback((novosValores: Partial<T>) => {
    setValores((anteriores) => ({ ...anteriores, ...novosValores }));
  }, []);

  // Valida e, se tudo estiver certo, chama o envio; devolve se deu certo.
  const submeter = async (
    evento: FormEvent,
    aoSalvar: (valores: T) => Promise<void>,
  ): Promise<boolean> => {
    evento.preventDefault();
    setErroGeral(null);

    const errosValidacao = validar(valores, edicao);
    if (Object.keys(errosValidacao).length > 0) {
      setErros(errosValidacao);
      return false;
    }

    setErros({});
    setSalvando(true);
    try {
      await aoSalvar(valores);
      return true;
    } catch (erro) {
      setErroGeral(extrairMensagemErro(erro));
      return false;
    } finally {
      setSalvando(false);
    }
  };

  return {
    valores,
    erros,
    erroGeral,
    salvando,
    alterarCampo,
    definirValores,
    setErroGeral,
    submeter,
  };
}
