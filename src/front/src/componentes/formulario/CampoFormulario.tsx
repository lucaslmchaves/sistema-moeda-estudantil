// Campo de formulário com rótulo, dica e mensagem de erro acessíveis.
import React from 'react';
import { classeControle } from '../../utils/estilos';
import { Icone } from '../icones/Icone';

interface CampoFormularioProps {
  id: string;
  rotulo: string;
  tipo?: string;
  valor?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  obrigatorio?: boolean;
  desabilitado?: boolean;
  dica?: string;
  erro?: string;
  colunaCheia?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  children?: React.ReactNode;
}

// Mostra o rótulo, o controle (input ou o filho informado) e o feedback de validação.
export const CampoFormulario: React.FC<CampoFormularioProps> = ({
  id,
  rotulo,
  tipo = 'text',
  valor,
  onChange,
  placeholder,
  obrigatorio = false,
  desabilitado = false,
  dica,
  erro,
  colunaCheia = false,
  autoComplete,
  inputMode,
  children,
}) => {
  const idDescricao = erro ? `${id}-erro` : dica ? `${id}-dica` : undefined;

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${colunaCheia ? 'sm:col-span-2' : ''}`}>
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-tinta">
        {rotulo}
        {obrigatorio && (
          <span aria-hidden="true" className="text-violeta">
            *
          </span>
        )}
        {desabilitado && <Icone nome="lock-simple" tamanho={14} className="text-tinta-3" />}
      </label>
      {children ?? (
        <input
          id={id}
          name={id}
          type={tipo}
          className={classeControle(Boolean(erro))}
          value={valor ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={desabilitado}
          required={obrigatorio}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={Boolean(erro)}
          aria-describedby={idDescricao}
        />
      )}
      {erro && (
        <span
          id={`${id}-erro`}
          role="alert"
          className="flex items-center gap-1.5 text-[13px] font-medium text-negativo"
        >
          <Icone nome="warning-circle" tamanho={15} />
          {erro}
        </span>
      )}
      {dica && !erro && (
        <span id={`${id}-dica`} className="text-[13px] leading-snug text-tinta-3">
          {dica}
        </span>
      )}
    </div>
  );
};
