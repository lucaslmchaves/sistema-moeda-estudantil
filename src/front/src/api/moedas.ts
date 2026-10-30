// Cliente HTTP para envio de moedas, resgate de vantagens e extrato.
import { requisicao } from './cliente';
import type {
  EnvioMoedasCriar,
  EnvioMoedasResposta,
  Extrato,
  ResgateResposta,
} from '../tipos/moedas';

// Envia moedas do professor logado a um aluno, com o motivo do reconhecimento.
export async function enviarMoedas(dados: EnvioMoedasCriar): Promise<EnvioMoedasResposta> {
  return requisicao<EnvioMoedasResposta>('/moedas/enviar', {
    method: 'POST',
    body: JSON.stringify({ ...dados, mensagem: dados.mensagem.trim() }),
  });
}

// Troca moedas do aluno logado por uma vantagem e devolve o código do cupom.
export async function resgatarVantagem(idVantagem: number): Promise<ResgateResposta> {
  return requisicao<ResgateResposta>('/moedas/resgatar', {
    method: 'POST',
    body: JSON.stringify({ id_vantagem: idVantagem }),
  });
}

// Consulta o saldo e as movimentações do usuário logado.
export async function consultarExtrato(): Promise<Extrato> {
  return requisicao<Extrato>('/moedas/extrato');
}
