// Página de cadastro e de edição de aluno.
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CabecalhoPagina } from '../componentes/CabecalhoPagina';
import { CampoFormulario } from '../componentes/CampoFormulario';
import { Cartao } from '../componentes/Cartao';
import { Carregando } from '../componentes/Carregando';
import { MensagemAlerta } from '../componentes/MensagemAlerta';
import { SelectFormulario } from '../componentes/SelectFormulario';
import { useAlunoFormulario } from '../hooks/useAlunoFormulario';
import type { AlunoFormulario as ValoresAluno } from '../tipos/aluno';
import { CLASSE_ACOES_FORMULARIO, CLASSE_GRADE_FORMULARIO, classeBotao } from '../utils/estilos';

type CampoTexto = Exclude<keyof ValoresAluno, 'id_instituicao'>;

// Monta o formulário de aluno; login fixo e senha opcional na edição.
export const AlunoFormulario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const form = useAlunoFormulario(id);
  const { valores, erros, edicao } = form;

  // Liga um campo de texto ao valor, à alteração e ao erro do formulário.
  const campo = (nome: CampoTexto) => ({
    id: nome,
    valor: valores[nome],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => form.alterarCampo(nome, e.target.value),
    erro: erros[nome],
  });

  if (form.carregandoDados) return <Carregando mensagem="Carregando formulário..." />;

  return (
    <div>
      <CabecalhoPagina
        titulo={edicao ? 'Editar Aluno' : 'Novo Aluno'}
        descricao={
          edicao
            ? 'Atualize os dados do estudante (o login não pode ser modificado)'
            : 'Preencha os dados para cadastrar um novo aluno'
        }
      >
        <Link to="/alunos" className={classeBotao('secundario')}>
          Voltar para Lista
        </Link>
      </CabecalhoPagina>

      <MensagemAlerta
        tipo="erro"
        mensagem={form.erroGeral}
        onFechar={() => form.setErroGeral(null)}
      />

      <Cartao>
        <form noValidate onSubmit={form.enviar}>
          <div className={CLASSE_GRADE_FORMULARIO}>
            <CampoFormulario
              {...campo('nome')}
              rotulo="Nome Completo"
              placeholder="Ex: Lucas Silva"
              obrigatorio
            />
            <CampoFormulario
              {...campo('email')}
              rotulo="E-mail"
              tipo="email"
              placeholder="Ex: lucas@exemplo.com"
              obrigatorio
            />
            <CampoFormulario
              {...campo('cpf')}
              rotulo="CPF"
              placeholder="Ex: 123.456.789-09 ou 12345678909"
              dica="Pode ser digitado com ou sem pontos/traço."
              obrigatorio
            />
            <CampoFormulario
              {...campo('rg')}
              rotulo="RG"
              placeholder="Ex: MG-12.345.678"
              obrigatorio
            />
            <CampoFormulario
              {...campo('curso')}
              rotulo="Curso"
              placeholder="Ex: Engenharia de Software"
              obrigatorio
            />
            <SelectFormulario
              id="id_instituicao"
              rotulo="Instituição de Ensino"
              valor={valores.id_instituicao}
              opcoes={form.instituicoes.map((i) => ({ valor: i.id_instituicao, rotulo: i.nome }))}
              textoPadrao="Selecione uma instituição..."
              onChange={(valor) => form.alterarCampo('id_instituicao', valor)}
              erro={erros.id_instituicao}
              obrigatorio
            />
            <CampoFormulario
              {...campo('endereco')}
              rotulo="Endereço Completo"
              placeholder="Ex: Av. Dom José Gaspar, 500"
              colunaCheia
              obrigatorio
            />
            <CampoFormulario
              {...campo('login')}
              rotulo={edicao ? 'Login de Usuário (Bloqueado)' : 'Login de Usuário'}
              placeholder="Ex: lucas.silva"
              desabilitado={edicao}
              dica={edicao ? 'O login é único e não pode ser alterado após o cadastro.' : undefined}
              obrigatorio={!edicao}
            />
            <CampoFormulario
              {...campo('senha')}
              rotulo={edicao ? 'Nova Senha (Opcional)' : 'Senha de Acesso'}
              tipo="password"
              placeholder={
                edicao ? 'Deixe em branco para manter a atual' : 'Mínimo de 8 caracteres'
              }
              dica={
                edicao
                  ? 'Preencha somente se desejar redefinir a senha (mínimo 8 caracteres).'
                  : 'A senha deve conter pelo menos 8 caracteres.'
              }
              obrigatorio={!edicao}
            />
          </div>

          <div className={CLASSE_ACOES_FORMULARIO}>
            <Link to="/alunos" className={classeBotao('secundario')}>
              Cancelar
            </Link>
            <button type="submit" className={classeBotao('primario')} disabled={form.salvando}>
              {form.salvando ? 'Salvando...' : edicao ? 'Salvar Alterações' : 'Cadastrar Aluno'}
            </button>
          </div>
        </form>
      </Cartao>
    </div>
  );
};
