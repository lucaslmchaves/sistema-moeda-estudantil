// Campo de senha com o botão de mostrar e ocultar o que foi digitado.
import React, { useState } from 'react';
import { classeControle } from '../../utils/estilos';
import { REQUISITOS_DA_SENHA } from '../../utils/regrasDeCampos';
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
  mostrarRequisitos?: boolean;
}

export const CampoSenha: React.FC<CampoSenhaProps> = ({
  id,
  valor,
  onChange,
  placeholder,
  autoComplete,
  mostrarRequisitos = false,
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
      {mostrarRequisitos && valor && (
        <ul aria-label="Requisitos da senha" className="flex flex-wrap gap-x-3 gap-y-1">
          {REQUISITOS_DA_SENHA.map((requisito) => {
            const ok = requisito.atende(valor);
            return (
              <li
                key={requisito.rotulo}
                className={`flex items-center gap-1 text-[13px] transition-colors ${ok ? 'text-positivo' : 'text-tinta-3'}`}
              >
                <Icone nome={ok ? 'check-circle' : 'info'} tamanho={14} />
                {requisito.rotulo}
                <span className="sr-only">{ok ? ' (ok)' : ' (falta)'}</span>
              </li>
            );
          })}
        </ul>
      )}
    </CampoFormulario>
  );
};
