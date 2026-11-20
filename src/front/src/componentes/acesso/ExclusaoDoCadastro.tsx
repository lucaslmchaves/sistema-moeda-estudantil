// Área de risco do formulário de edição: botão e confirmação para excluir o próprio cadastro.
import React from 'react';
import { useExclusaoDoCadastro } from '../../hooks/autenticacao/useExclusaoDoCadastro';
import { classeBotao } from '../../utils/estilos';
import { MensagemAlerta } from '../feedback/MensagemAlerta';
import { ModalConfirmacao } from '../feedback/ModalConfirmacao';
import { Icone } from '../icones/Icone';

interface ExclusaoDoCadastroProps {
  texto: string;
  excluirFn: () => Promise<void>;
}

// Explica o que acontece na exclusão e pede confirmação antes de executá-la.
export const ExclusaoDoCadastro: React.FC<ExclusaoDoCadastroProps> = ({ texto, excluirFn }) => {
  const exclusao = useExclusaoDoCadastro(excluirFn);

  return (
    <section className="mt-6 rounded-cartao border border-negativo/25 bg-superficie p-6 sm:p-8">
      <MensagemAlerta
        tipo="erro"
        mensagem={exclusao.erro}
        onFechar={() => exclusao.setErro(null)}
      />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-negativo">
            Excluir cadastro
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-tinta-2">{texto}</p>
        </div>
        <button
          type="button"
          className={`${classeBotao('secundario')} border-negativo/30 text-negativo hover:border-negativo hover:bg-negativo-fundo`}
          onClick={exclusao.abrir}
        >
          <Icone nome="trash" tamanho={16} />
          Excluir meu cadastro
        </button>
      </div>
      <ModalConfirmacao
        aberto={exclusao.confirmando}
        titulo="Excluir o seu cadastro?"
        mensagem="Você será desconectado e não poderá mais entrar com este login."
        textoConfirmar="Sim, excluir"
        carregando={exclusao.excluindo}
        onConfirmar={exclusao.confirmar}
        onCancelar={exclusao.fechar}
      />
    </section>
  );
};
