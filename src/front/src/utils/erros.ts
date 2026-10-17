// Extração tolerante de mensagens de erro devolvidas pela API ou falhas de rede.

export function extrairMensagemErro(erro: unknown): string {
  // Trata objetos de erro nativos do JavaScript
  if (erro instanceof Error) {
    return erro.message;
  }

  // Trata respostas com corpo nulo ou indefinido
  if (!erro || typeof erro !== 'object') {
    if (typeof erro === 'string') {
      try {
        const json = JSON.parse(erro);
        return extrairMensagemErro(json);
      } catch {
        return erro;
      }
    }
    return 'Ocorreu um erro inesperado.';
  }

  const obj = erro as Record<string, unknown>;

  // Extrai mensagem no formato padronizado detalhe
  if (typeof obj.detalhe === 'string' && obj.detalhe.trim()) {
    return obj.detalhe;
  }

  // Extrai mensagem no formato detail string do FastAPI
  if (typeof obj.detail === 'string' && obj.detail.trim()) {
    return obj.detail;
  }

  // Concatena mensagens de validação do formato detail array do FastAPI
  if (Array.isArray(obj.detail)) {
    const mensagens: string[] = [];
    for (const item of obj.detail) {
      if (item && typeof item === 'object') {
        const itemObj = item as Record<string, unknown>;
        const loc = Array.isArray(itemObj.loc) ? itemObj.loc.slice(1).join('.') : '';
        const msg = typeof itemObj.msg === 'string' ? itemObj.msg : 'dado inválido';
        mensagens.push(loc ? `${loc}: ${msg}` : msg);
      }
    }
    if (mensagens.length > 0) {
      return mensagens.join('; ');
    }
  }

  return 'Ocorreu um erro inesperado.';
}
