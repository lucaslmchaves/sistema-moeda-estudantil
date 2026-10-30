// Página inicial: apresenta o sistema ao visitante e os atalhos do perfil ao usuário logado.
import React from 'react';
import { Link } from 'react-router-dom';
import { CabecalhoPagina } from '../../componentes/layout/CabecalhoPagina';
import { Cartao } from '../../componentes/layout/Cartao';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { useAutenticacao } from '../../hooks/autenticacao/useAutenticacao';
import { useExtrato } from '../../hooks/moedas/useExtrato';
import { useMensagemNavegacao } from '../../hooks/geral/useMensagemNavegacao';
import { classeBotao } from '../../utils/estilos';
import { formatarMoedas } from '../../utils/formatacao';

interface Atalho {
  titulo: string;
  texto: string;
  para: string;
  rotulo: string;
}

const ATALHOS_VISITANTE: Atalho[] = [
  {
    titulo: '🎓 Sou aluno',
    texto: 'Cadastre-se para receber moedas dos professores e trocá-las por vantagens.',
    para: '/cadastro/aluno',
    rotulo: 'Cadastrar aluno',
  },
  {
    titulo: '🏢 Sou empresa parceira',
    texto: 'Cadastre a sua empresa e ofereça vantagens em troca de moedas.',
    para: '/cadastro/empresa',
    rotulo: 'Cadastrar empresa',
  },
];

const ATALHOS_ALUNO: Atalho[] = [
  {
    titulo: '🎁 Vantagens',
    texto: 'Veja as vantagens das empresas parceiras e troque as suas moedas.',
    para: '/vantagens',
    rotulo: 'Ver vantagens',
  },
  {
    titulo: '🧾 Extrato',
    texto: 'Acompanhe o seu saldo, as moedas recebidas e as trocas feitas.',
    para: '/extrato',
    rotulo: 'Ver extrato',
  },
];

const ATALHOS_PROFESSOR: Atalho[] = [
  {
    titulo: '🏅 Enviar moedas',
    texto: 'Reconheça um aluno enviando moedas, com o motivo do reconhecimento.',
    para: '/enviar-moedas',
    rotulo: 'Enviar moedas',
  },
  {
    titulo: '🧾 Extrato',
    texto: 'Acompanhe o seu saldo e as moedas que já enviou.',
    para: '/extrato',
    rotulo: 'Ver extrato',
  },
];

const ATALHOS_EMPRESA: Atalho[] = [
  {
    titulo: '🎁 Minhas vantagens',
    texto: 'Veja, cadastre e exclua as vantagens que a sua empresa oferece.',
    para: '/minhas-vantagens',
    rotulo: 'Ver vantagens',
  },
  {
    titulo: '➕ Nova vantagem',
    texto: 'Cadastre uma vantagem com descrição, foto e custo em moedas.',
    para: '/minhas-vantagens/nova',
    rotulo: 'Cadastrar vantagem',
  },
];

// Mostra o saldo do usuário que tem conta (aluno e professor).
const SaldoDaConta: React.FC = () => {
  const { extrato } = useExtrato();
  if (!extrato) return null;
  return (
    <p className="mb-6 text-lg text-slate-800">
      Seu saldo: <strong>{formatarMoedas(extrato.saldo)}</strong>
    </p>
  );
};

// Escolhe os atalhos conforme o perfil de quem está logado.
function atalhosDoPerfil(tipo: string | undefined): Atalho[] {
  if (tipo === 'ALUNO') return ATALHOS_ALUNO;
  if (tipo === 'PROFESSOR') return ATALHOS_PROFESSOR;
  if (tipo === 'EMPRESA_PARCEIRA') return ATALHOS_EMPRESA;
  return ATALHOS_VISITANTE;
}

// Monta a tela inicial com a saudação, o saldo e os atalhos do perfil.
export const Inicio: React.FC = () => {
  const { usuario } = useAutenticacao();
  const { mensagem, setMensagem } = useMensagemNavegacao();
  const temConta = usuario?.tipo_usuario === 'ALUNO' || usuario?.tipo_usuario === 'PROFESSOR';

  return (
    <div>
      <CabecalhoPagina
        titulo={usuario ? `Olá, ${usuario.nome}` : 'Moeda Estudantil'}
        descricao="Sistema de reconhecimento e moeda virtual estudantil"
      >
        {!usuario && (
          <Link to="/entrar" className={classeBotao('primario')}>
            Entrar
          </Link>
        )}
      </CabecalhoPagina>

      <MensagemAlerta tipo="sucesso" mensagem={mensagem} onFechar={() => setMensagem(null)} />
      {temConta && <SaldoDaConta />}

      <div className="mt-2 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        {atalhosDoPerfil(usuario?.tipo_usuario).map(({ titulo, texto, para, rotulo }) => (
          <Cartao key={para}>
            <h2 className="mb-3 text-xl font-semibold">{titulo}</h2>
            <p className="mb-6 text-sm text-slate-500">{texto}</p>
            <Link to={para} className={classeBotao('primario')}>
              {rotulo}
            </Link>
          </Cartao>
        ))}
      </div>
    </div>
  );
};
