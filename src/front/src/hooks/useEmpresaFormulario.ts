// Hook do formulário de empresa parceira: carrega os dados, valida e envia para a API.
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarEmpresa, buscarEmpresaPorId, criarEmpresa } from '../api/empresas';
import type { Empresa, EmpresaFormulario } from '../tipos/empresa';
import { extrairMensagemErro } from '../utils/erros';
import { validarEmpresa } from '../utils/validacao';
import { useFormulario } from './useFormulario';

const VALORES_INICIAIS: EmpresaFormulario = {
  nome: '',
  email: '',
  cnpj: '',
  login: '',
  senha: '',
};

// Converte a empresa vinda da API nos valores do formulário, com a senha em branco.
function paraFormulario(empresa: Empresa): EmpresaFormulario {
  const { nome, email, cnpj, login } = empresa;
  return { nome, email, cnpj, login, senha: '' };
}

// Reúne o carregamento, a validação e o envio do cadastro e da edição de empresa.
export function useEmpresaFormulario(id: string | undefined) {
  const edicao = Boolean(id);
  const navigate = useNavigate();
  const [carregandoDados, setCarregandoDados] = useState(Boolean(id));
  const formulario = useFormulario<EmpresaFormulario>({
    valoresIniciais: VALORES_INICIAIS,
    validar: validarEmpresa,
    edicao,
  });
  const { definirValores, setErroGeral, submeter } = formulario;

  // Na edição, carrega os dados atuais da empresa.
  useEffect(() => {
    if (!id) return;
    let ativo = true;
    const carregar = async () => {
      try {
        const empresa = await buscarEmpresaPorId(Number(id));
        if (ativo) definirValores(paraFormulario(empresa));
      } catch (erro) {
        if (ativo) setErroGeral(extrairMensagemErro(erro));
      } finally {
        if (ativo) setCarregandoDados(false);
      }
    };
    carregar();
    return () => {
      ativo = false;
    };
  }, [id, definirValores, setErroGeral]);

  // Valida o formulário e cadastra ou atualiza a empresa, voltando para a lista.
  const enviar = (evento: FormEvent) =>
    submeter(evento, async (valores) => {
      const { nome, email, cnpj, login, senha } = valores;
      if (id) {
        await atualizarEmpresa(Number(id), { nome, email, cnpj, ...(senha ? { senha } : {}) });
        navigate('/empresas', {
          state: { mensagemSucesso: `Empresa ${valores.nome} atualizada com sucesso!` },
        });
      } else {
        await criarEmpresa({ nome, email, cnpj, login, senha });
        navigate('/empresas', {
          state: { mensagemSucesso: `Empresa ${valores.nome} cadastrada com sucesso!` },
        });
      }
    });

  return { ...formulario, edicao, carregandoDados, enviar };
}
