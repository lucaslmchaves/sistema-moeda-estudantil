// Página de cadastro da empresa parceira e de edição do próprio cadastro.
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { excluirEmpresa } from '../../api/empresas';
import { CabecalhoPagina } from '../../componentes/layout/CabecalhoPagina';
import { CampoFormulario } from '../../componentes/formulario/CampoFormulario';
import { Cartao } from '../../componentes/layout/Cartao';
import { Carregando } from '../../componentes/feedback/Carregando';
import { ExclusaoDoCadastro } from '../../componentes/acesso/ExclusaoDoCadastro';
import { MensagemAlerta } from '../../componentes/feedback/MensagemAlerta';
import { SecaoFormulario } from '../../componentes/formulario/SecaoFormulario';
import { useEmpresaFormulario } from '../../hooks/cadastros/useEmpresaFormulario';
import type { EmpresaFormulario as ValoresEmpresa } from '../../tipos/empresa';
import { CLASSE_ACOES_FORMULARIO, CLASSE_GRADE_FORMULARIO, classeBotao } from '../../utils/estilos';

// Monta o formulário de empresa; login fixo e senha opcional na edição.
export const EmpresaFormulario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const form = useEmpresaFormulario(id);
  const { valores, erros, edicao } = form;
  const voltarPara = edicao ? '/' : '/entrar';

  // Liga um campo ao valor, à alteração e ao erro do formulário.
  const campo = (nome: keyof ValoresEmpresa) => ({
    id: nome,
    valor: valores[nome],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => form.alterarCampo(nome, e.target.value),
    erro: erros[nome],
  });

  if (form.carregandoDados) return <Carregando mensagem="Carregando formulário..." />;

  return (
    <div className={edicao ? '' : 'mx-auto max-w-[960px]'}>
      <CabecalhoPagina
        titulo={edicao ? 'Meu cadastro' : 'Cadastrar empresa parceira'}
        descricao={
          edicao
            ? 'Mantenha os dados da empresa atualizados.'
            : 'Ofereça vantagens aos estudantes em troca de moedas.'
        }
      />

      <MensagemAlerta
        tipo="erro"
        mensagem={form.erroGeral}
        onFechar={() => form.setErroGeral(null)}
      />

      <Cartao>
        <form noValidate onSubmit={form.enviar}>
          <SecaoFormulario titulo="Empresa" descricao="Como a empresa aparece para os alunos.">
            <div className={CLASSE_GRADE_FORMULARIO}>
              <CampoFormulario
                {...campo('nome')}
                rotulo="Nome da empresa"
                autoComplete="organization"
                colunaCheia
                obrigatorio
              />
              <CampoFormulario
                {...campo('cnpj')}
                rotulo="CNPJ"
                placeholder="00.000.000/0000-00"
                inputMode="numeric"
                obrigatorio
              />
              <CampoFormulario
                {...campo('email')}
                rotulo="E-mail"
                tipo="email"
                placeholder="contato@empresa.com.br"
                dica="Recebe o código de cada troca."
                autoComplete="email"
                obrigatorio
              />
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
                placeholder="nome.da.empresa"
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
              {form.salvando ? 'Salvando...' : edicao ? 'Salvar alterações' : 'Cadastrar empresa'}
            </button>
          </div>
        </form>
      </Cartao>

      {edicao ? (
        <ExclusaoDoCadastro
          texto="A empresa deixa de participar e as vantagens saem do catálogo. Os resgates já feitos são mantidos."
          excluirFn={() => excluirEmpresa(Number(id))}
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
