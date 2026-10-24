// Hook do formulário de aluno: carrega os dados, valida e envia para a API.
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarAluno, buscarAlunoPorId, criarAluno } from '../api/alunos';
import { listarInstituicoes } from '../api/instituicoes';
import type { Aluno, AlunoFormulario } from '../tipos/aluno';
import type { Instituicao } from '../tipos/instituicao';
import { extrairMensagemErro } from '../utils/erros';
import { validarAluno } from '../utils/validacao';
import { useFormulario } from './useFormulario';

const VALORES_INICIAIS: AlunoFormulario = {
  nome: '',
  email: '',
  cpf: '',
  rg: '',
  endereco: '',
  curso: '',
  id_instituicao: '',
  login: '',
  senha: '',
};

// Converte o aluno vindo da API nos valores do formulário, com a senha em branco.
function paraFormulario(aluno: Aluno): AlunoFormulario {
  const { nome, email, cpf, rg, endereco, curso, id_instituicao, login } = aluno;
  return { nome, email, cpf, rg, endereco, curso, id_instituicao, login, senha: '' };
}

// Reúne o carregamento, a validação e o envio do cadastro e da edição de aluno.
export function useAlunoFormulario(id: string | undefined) {
  const edicao = Boolean(id);
  const navigate = useNavigate();
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const formulario = useFormulario<AlunoFormulario>({
    valoresIniciais: VALORES_INICIAIS,
    validar: validarAluno,
    edicao,
  });
  const { alterarCampo, definirValores, setErroGeral, submeter } = formulario;

  // Carrega as instituições e, na edição, os dados atuais do aluno.
  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      try {
        const lista = await listarInstituicoes();
        if (!ativo) return;
        setInstituicoes(lista);
        if (id) {
          const aluno = await buscarAlunoPorId(Number(id));
          if (ativo) definirValores(paraFormulario(aluno));
        } else if (lista.length > 0) {
          alterarCampo('id_instituicao', lista[0].id_instituicao);
        }
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
  }, [id, alterarCampo, definirValores, setErroGeral]);

  // Valida e cadastra o aluno (vai ao login) ou atualiza o cadastro (vai ao início).
  const enviar = (evento: FormEvent) =>
    submeter(evento, async (valores) => {
      const { nome, email, cpf, rg, endereco, curso, login, senha } = valores;
      const id_instituicao = Number(valores.id_instituicao);
      if (id) {
        await atualizarAluno(Number(id), {
          nome,
          email,
          cpf,
          rg,
          endereco,
          curso,
          id_instituicao,
          ...(senha ? { senha } : {}),
        });
        navigate('/', {
          state: { mensagemSucesso: `Aluno ${valores.nome} atualizado com sucesso!` },
        });
      } else {
        await criarAluno({ nome, email, cpf, rg, endereco, curso, id_instituicao, login, senha });
        navigate('/entrar', {
          state: {
            mensagemSucesso: `Aluno ${valores.nome} cadastrado com sucesso! Entre com o seu login e a sua senha.`,
          },
        });
      }
    });

  return { ...formulario, edicao, instituicoes, carregandoDados, enviar };
}
