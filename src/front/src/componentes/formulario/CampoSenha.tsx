// Campo de senha com o botão de mostrar e ocultar o que foi digitado.
import React, { useState } from 'react';
import { classeControle } from '../../utils/estilos';
import { Icone } from '../icones/Icone';
import { CampoFormulario } from './CampoFormulario';

interface CampoSenhaProps {
  id: string;
  rotulo: string;
  valor?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  obrigatorio?: boolean;
  dica?: string;
  erro?: string;
  autoComplete?: string;
}

export const CampoSenha: React.FC<CampoSenhaProps> = ({
  id,
  valor,
  onChange,
  placeholder,
  autoComplete,
  ...campo
}) => {
  const [visivel, setVisivel] = useState(false);
  const idDescricao = campo.erro ? `${id}-erro` : campo.dica ? `${id}-dica` : undefined;

  return (
    <CampoFormulario id={id} {...campo}>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visivel ? 'text' : 'password'}
          className={`${classeControle(Boolean(campo.erro))} pr-12`}
          value={valor ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          required={campo.obrigatorio}
          autoComplete={autoComplete}
          aria-invalid={Boolean(campo.erro)}
          aria-describedby={idDescricao}
        />
        <button
          type="button"
          aria-label={visivel ? 'Ocultar o que foi digitado' : 'Mostrar o que foi digitado'}
          aria-pressed={visivel}
          onClick={() => setVisivel((v) => !v)}
          className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-tinta-3 transition hover:bg-tinta/5 hover:text-tinta"
        >
          <Icone nome={visivel ? 'eye-slash' : 'eye'} tamanho={18} />
        </button>
      </div>
    </CampoFormulario>
  );
};
