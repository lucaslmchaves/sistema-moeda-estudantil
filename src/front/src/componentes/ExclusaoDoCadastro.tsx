// Área de risco do formulário de edição: botão e confirmação para excluir o próprio cadastro.
import React from 'react';
import { useExclusaoDoCadastro } from '../hooks/useExclusaoDoCadastro';
import { classeBotao } from '../utils/estilos';
import { Cartao } from './Cartao';
import { MensagemAlerta } from './MensagemAlerta';
import { ModalConfirmacao } from './ModalConfirmacao';

interface ExclusaoDoCadastroProps {
  texto: string;
  excluirFn: () => Promise<void>;
}

// Explica o que acontece na exclusão e pede confirmação antes de executá-la.
export const ExclusaoDoCadastro: React.FC<ExclusaoDoCadastroProps> = ({ texto, excluirFn }) => {
  const exclusao = useExclusaoDoCadastro(excluirFn);

  return (
    <Cartao>
      <h2 className="text-lg font-semibold text-slate-800">Excluir cadastro</h2>
      <p className="mt-1 mb-4 text-sm text-slate-500">{texto}</p>
      <MensagemAlerta
        tipo="erro"
        mensagem={exclusao.erro}
        onFechar={() => exclusao.setErro(null)}
      />
      <button type="button" className={classeBotao('perigo')} onClick={exclusao.abrir}>
        Excluir meu cadastro
      </button>
      <ModalConfirmacao
        aberto={exclusao.confirmando}
        titulo="Confirmar exclusão do cadastro"
        mensagem="Tem certeza que deseja excluir o seu cadastro? Você será desconectado."
        carregando={exclusao.excluindo}
        onConfirmar={exclusao.confirmar}
        onCancelar={exclusao.fechar}
      />
    </Cartao>
  );
};
