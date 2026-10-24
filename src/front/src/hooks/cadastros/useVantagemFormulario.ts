// Hook do formulário de vantagem: valida os dados e a foto e cadastra pela API.
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarVantagem } from '../api/vantagens';
import type { VantagemFormulario } from '../tipos/vantagem';
import { validarVantagem } from '../utils/validacao';
import { useFormulario } from './useFormulario';

const VALORES_INICIAIS: VantagemFormulario = { descricao: '', custo: '', foto: null };

// Reúne a validação e o envio do cadastro de vantagem, voltando para a lista da empresa.
export function useVantagemFormulario() {
  const navigate = useNavigate();
  const formulario = useFormulario<VantagemFormulario>({
    valoresIniciais: VALORES_INICIAIS,
    validar: validarVantagem,
  });

  // Valida e cadastra a vantagem com a foto escolhida.
  const enviar = (evento: FormEvent) =>
    formulario.submeter(evento, async ({ descricao, custo, foto }) => {
      await criarVantagem(descricao, Number(custo), foto as File);
      navigate('/minhas-vantagens', {
        state: { mensagemSucesso: `Vantagem "${descricao.trim()}" cadastrada com sucesso!` },
      });
    });

  return { ...formulario, enviar };
}
