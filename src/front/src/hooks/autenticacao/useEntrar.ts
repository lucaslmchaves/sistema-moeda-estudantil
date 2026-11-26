// Hook do formulário de login: valida, autentica e leva o usuário à tela de destino.
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { conferirPerfilDaAba } from '../../utils/perfilDeAcesso';
import { validarLogin } from '../../utils/validacao';
import { useAutenticacao } from './useAutenticacao';
import { useFormulario } from '../geral/useFormulario';

type LoginFormulario = { login: string; senha: string };

const VALORES_INICIAIS: LoginFormulario = { login: '', senha: '' };

// Reúne a validação e o envio do login, voltando à tela que o usuário queria abrir.
export function useEntrar(perfil?: 'professor') {
  const navigate = useNavigate();
  const location = useLocation();
  const { entrar } = useAutenticacao();
  const formulario = useFormulario<LoginFormulario>({
    valoresIniciais: VALORES_INICIAIS,
    validar: validarLogin,
  });

  // Autentica e segue para a tela de origem; sem origem, vai para o início.
  const enviar = (evento: FormEvent) =>
    formulario.submeter(evento, async ({ login, senha }) => {
      await entrar(login, senha, (usuario) => conferirPerfilDaAba(usuario.tipo_usuario, perfil));
      navigate(location.state?.origem ?? '/', { replace: true });
    });

  return { ...formulario, enviar };
}
