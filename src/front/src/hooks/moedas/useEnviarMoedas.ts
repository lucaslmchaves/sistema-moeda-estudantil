// Hook do envio de moedas: carrega os alunos, valida o formulário e envia pela API.
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { listarAlunos } from '../../api/alunos';
import { enviarMoedas } from '../../api/moedas';
import type { AlunoResumo } from '../../tipos/aluno';
import type { EnvioMoedasFormulario } from '../../tipos/moedas';
import { extrairMensagemErro } from '../../utils/erros';
import { formatarMoedas } from '../../utils/formatacao';
import { validarEnvioMoedas } from '../../utils/validacao';
import { useExtrato } from './useExtrato';
import { useFormulario } from '../geral/useFormulario';

const VALORES_INICIAIS: EnvioMoedasFormulario = { id_aluno: '', valor: '', mensagem: '' };

// Reúne alunos, saldo do professor, validação e envio de moedas.
export function useEnviarMoedas() {
  const [alunos, setAlunos] = useState<AlunoResumo[]>([]);
  const [carregandoAlunos, setCarregandoAlunos] = useState(true);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const { extrato, recarregar, erro: erroSaldo } = useExtrato();
  const formulario = useFormulario<EnvioMoedasFormulario>({
    valoresIniciais: VALORES_INICIAIS,
    validar: validarEnvioMoedas,
  });
  const { definirValores, setErroGeral, submeter } = formulario;

  // Carrega a lista de alunos que podem receber moedas.
  useEffect(() => {
    let ativo = true;
    listarAlunos()
      .then((lista) => ativo && setAlunos(lista))
      .catch((falha) => ativo && setErroGeral(extrairMensagemErro(falha)))
      .finally(() => ativo && setCarregandoAlunos(false));
    return () => {
      ativo = false;
    };
  }, [setErroGeral]);

  // Valida e envia as moedas; depois limpa o formulário, avisa o resultado e atualiza o saldo.
  const enviar = (evento: FormEvent) => {
    setSucesso(null);
    return submeter(evento, async (valores) => {
      const valor = Number(valores.valor);
      await enviarMoedas({
        id_aluno: Number(valores.id_aluno),
        valor,
        mensagem: valores.mensagem,
      });
      const aluno = alunos.find((a) => a.id_usuario === Number(valores.id_aluno));
      setSucesso(
        `${formatarMoedas(valor)} enviadas para ${aluno?.nome ?? 'o aluno'}. O aluno foi avisado por e-mail.`,
      );
      definirValores({ valor: '', mensagem: '' });
      await recarregar();
    });
  };

  return {
    ...formulario,
    alunos,
    carregandoAlunos,
    saldo: extrato?.saldo ?? null,
    erroSaldo,
    sucesso,
    setSucesso,
    enviar,
  };
}
