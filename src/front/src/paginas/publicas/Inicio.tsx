// Página inicial: apresenta o sistema ao visitante e o painel do perfil ao usuário logado.
import React from 'react';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { ApresentacaoVisitante } from '../../componentes/inicio/ApresentacaoVisitante';
import {
  PainelAluno,
  PainelEmpresa,
  PainelProfessor,
  Saudacao,
} from '../../componentes/inicio/PaineisDoUsuario';
import { useAutenticacao } from '../../hooks/autenticacao/useAutenticacao';
import { useMensagemNavegacao } from '../../hooks/geral/useMensagemNavegacao';

// Monta a tela inicial conforme o perfil de quem está logado.
export const Inicio: React.FC = () => {
  const { usuario } = useAutenticacao();
  const { mensagem, setMensagem } = useMensagemNavegacao();

  if (!usuario) {
    return (
      <>
        <MensagemAlerta tipo="sucesso" mensagem={mensagem} onFechar={() => setMensagem(null)} />
        <ApresentacaoVisitante />
      </>
    );
  }

  return (
    <div>
      <Saudacao usuario={usuario} />
      <MensagemAlerta tipo="sucesso" mensagem={mensagem} onFechar={() => setMensagem(null)} />
      {usuario.tipo_usuario === 'ALUNO' && <PainelAluno usuario={usuario} />}
      {usuario.tipo_usuario === 'PROFESSOR' && <PainelProfessor usuario={usuario} />}
      {usuario.tipo_usuario === 'EMPRESA_PARCEIRA' && <PainelEmpresa usuario={usuario} />}
    </div>
  );
};
