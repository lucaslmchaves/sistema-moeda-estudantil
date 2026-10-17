// Página de cadastro e de edição de empresa parceira.
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CabecalhoPagina } from '../componentes/CabecalhoPagina';
import { CampoFormulario } from '../componentes/CampoFormulario';
import { Cartao } from '../componentes/Cartao';
import { Carregando } from '../componentes/Carregando';
import { MensagemAlerta } from '../componentes/MensagemAlerta';
import { useEmpresaFormulario } from '../hooks/useEmpresaFormulario';
import type { EmpresaFormulario as ValoresEmpresa } from '../tipos/empresa';
import { CLASSE_ACOES_FORMULARIO, CLASSE_GRADE_FORMULARIO, classeBotao } from '../utils/estilos';

// Monta o formulário de empresa; login fixo e senha opcional na edição.
export const EmpresaFormulario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const form = useEmpresaFormulario(id);
  const { valores, erros, edicao } = form;

  // Liga um campo ao valor, à alteração e ao erro do formulário.
  const campo = (nome: keyof ValoresEmpresa) => ({
    id: nome,
    valor: valores[nome],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => form.alterarCampo(nome, e.target.value),
    erro: erros[nome],
  });

  if (form.carregandoDados) return <Carregando mensagem="Carregando formulário..." />;

  return (
    <div>
      <CabecalhoPagina
        titulo={edicao ? 'Editar Empresa Parceira' : 'Nova Empresa Parceira'}
        descricao={
          edicao
            ? 'Atualize os dados da empresa parceira (o login não pode ser modificado)'
            : 'Preencha os dados cadastrais da empresa parceira'
        }
      >
        <Link to="/empresas" className={classeBotao('secundario')}>
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
              rotulo="Razão Social / Nome Fantasia"
              placeholder="Ex: Livraria Universitária Ltda"
              obrigatorio
            />
            <CampoFormulario
              {...campo('email')}
              rotulo="E-mail Corporativo"
              tipo="email"
              placeholder="Ex: contato@livraria.com.br"
              obrigatorio
            />
            <CampoFormulario
              {...campo('cnpj')}
              rotulo="CNPJ"
              placeholder="Ex: 00.000.000/0001-91 ou 00000000000191"
              dica="Pode ser digitado com ou sem pontuação."
              obrigatorio
            />
            <CampoFormulario
              {...campo('login')}
              rotulo={edicao ? 'Login de Usuário (Bloqueado)' : 'Login de Usuário'}
              placeholder="Ex: livraria.universitaria"
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
                  ? 'Preencha somente se desejar redefinir a senha da empresa (mínimo 8 caracteres).'
                  : 'A senha deve conter pelo menos 8 caracteres.'
              }
              colunaCheia
              obrigatorio={!edicao}
            />
          </div>

          <div className={CLASSE_ACOES_FORMULARIO}>
            <Link to="/empresas" className={classeBotao('secundario')}>
              Cancelar
            </Link>
            <button type="submit" className={classeBotao('primario')} disabled={form.salvando}>
              {form.salvando ? 'Salvando...' : edicao ? 'Salvar Alterações' : 'Cadastrar Empresa'}
            </button>
          </div>
        </form>
      </Cartao>
    </div>
  );
};
