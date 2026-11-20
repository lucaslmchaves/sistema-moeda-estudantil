// Página de cadastro do aluno e de edição do próprio cadastro.
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { excluirAluno } from '../../api/alunos';
import { CabecalhoPagina } from '../../componentes/layout/CabecalhoPagina';
import { CampoFormulario } from '../../componentes/formulario/CampoFormulario';
import { Cartao } from '../../componentes/layout/Cartao';
import { Carregando } from '../../componentes/feedback/Carregando';
import { ExclusaoDoCadastro } from '../../componentes/acesso/ExclusaoDoCadastro';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { SecaoFormulario } from '../../componentes/formulario/SecaoFormulario';
import { SelectFormulario } from '../../componentes/formulario/SelectFormulario';
import { useAlunoFormulario } from '../../hooks/cadastros/useAlunoFormulario';
import type { AlunoFormulario as ValoresAluno } from '../../tipos/aluno';
import { CLASSE_ACOES_FORMULARIO, CLASSE_GRADE_FORMULARIO, classeBotao } from '../../utils/estilos';

type CampoTexto = Exclude<keyof ValoresAluno, 'id_instituicao'>;

// Monta o formulário de aluno; login fixo e senha opcional na edição.
export const AlunoFormulario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const form = useAlunoFormulario(id);
  const { valores, erros, edicao } = form;
  const voltarPara = edicao ? '/' : '/entrar';

  // Liga um campo de texto ao valor, à alteração e ao erro do formulário.
  const campo = (nome: CampoTexto) => ({
    id: nome,
    valor: valores[nome],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => form.alterarCampo(nome, e.target.value),
    erro: erros[nome],
  });

  if (form.carregandoDados) return <Carregando mensagem="Carregando formulário..." />;

  return (
    <div className={edicao ? '' : 'mx-auto max-w-[960px]'}>
      <CabecalhoPagina
        titulo={edicao ? 'Meu cadastro' : 'Criar conta de aluno'}
        descricao={
          edicao
            ? 'Mantenha os seus dados atualizados.'
            : 'Com a conta, você recebe moedas dos professores e troca por vantagens.'
        }
      />

      <MensagemAlerta
        tipo="erro"
        mensagem={form.erroGeral}
        onFechar={() => form.setErroGeral(null)}
      />

      <Cartao>
        <form noValidate onSubmit={form.enviar}>
          <SecaoFormulario
            titulo="Dados pessoais"
            descricao="Usados para identificar você na instituição."
          >
            <div className={CLASSE_GRADE_FORMULARIO}>
              <CampoFormulario
                {...campo('nome')}
                rotulo="Nome completo"
                autoComplete="name"
                colunaCheia
                obrigatorio
              />
              <CampoFormulario
                {...campo('email')}
                rotulo="E-mail"
                tipo="email"
                placeholder="nome@exemplo.com"
                dica="Os avisos de moedas e os cupons chegam aqui."
                autoComplete="email"
                colunaCheia
                obrigatorio
              />
              <CampoFormulario
                {...campo('cpf')}
                rotulo="CPF"
                placeholder="000.000.000-00"
                inputMode="numeric"
                obrigatorio
              />
              <CampoFormulario
                {...campo('rg')}
                rotulo="RG"
                placeholder="MG-00.000.000"
                obrigatorio
              />
              <CampoFormulario
                {...campo('endereco')}
                rotulo="Endereço"
                autoComplete="street-address"
                colunaCheia
                obrigatorio
              />
            </div>
          </SecaoFormulario>

          <SecaoFormulario titulo="Instituição" descricao="Onde você estuda e qual curso faz.">
            <div className={CLASSE_GRADE_FORMULARIO}>
              <SelectFormulario
                id="id_instituicao"
                rotulo="Instituição de ensino"
                valor={valores.id_instituicao}
                opcoes={form.instituicoes.map((i) => ({ valor: i.id_instituicao, rotulo: i.nome }))}
                textoPadrao="Selecione"
                onChange={(valor) => form.alterarCampo('id_instituicao', valor)}
                erro={erros.id_instituicao}
                obrigatorio
              />
              <CampoFormulario {...campo('curso')} rotulo="Curso" obrigatorio />
            </div>
          </SecaoFormulario>

          <SecaoFormulario
            titulo="Acesso"
            descricao={
              edicao ? 'O login não pode ser alterado.' : 'Você vai usar estes dados para entrar.'
            }
          >
            <div className={CLASSE_GRADE_FORMULARIO}>
              <CampoFormulario
                {...campo('login')}
                rotulo="Login"
                placeholder="nome.sobrenome"
                desabilitado={edicao}
                autoComplete="username"
                obrigatorio={!edicao}
              />
              <CampoFormulario
                {...campo('senha')}
                rotulo={edicao ? 'Nova senha' : 'Senha'}
                tipo="password"
                placeholder={edicao ? 'Deixe em branco para manter' : ''}
                dica="Mínimo de 8 caracteres."
                autoComplete="new-password"
                obrigatorio={!edicao}
              />
            </div>
          </SecaoFormulario>

          <div className={CLASSE_ACOES_FORMULARIO}>
            <Link to={voltarPara} className={classeBotao('fantasma')}>
              Cancelar
            </Link>
            <button type="submit" className={classeBotao('primario')} disabled={form.salvando}>
              {form.salvando ? 'Salvando...' : edicao ? 'Salvar alterações' : 'Criar conta'}
            </button>
          </div>
        </form>
      </Cartao>

      {edicao ? (
        <ExclusaoDoCadastro
          texto="Você deixa de participar do sistema e perde o acesso ao saldo. O histórico de transações é mantido."
          excluirFn={() => excluirAluno(Number(id))}
        />
      ) : (
        <p className="mt-6 text-center text-sm text-tinta-3">
          Já tem conta?{' '}
          <Link to="/entrar" className="font-medium text-tinta underline">
            Entrar
          </Link>
        </p>
      )}
    </div>
  );
};
