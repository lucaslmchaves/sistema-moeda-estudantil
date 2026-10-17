// Campo de formulário com rótulo, dica e mensagem de erro acessíveis.
import React from 'react';
import { classeControle } from '../utils/estilos';

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
  children,
}) => {
  const idDescricao = erro ? `${id}-erro` : dica ? `${id}-dica` : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${colunaCheia ? 'col-span-full' : ''}`}>
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">
        {rotulo} {obrigatorio && '*'}
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
          aria-invalid={Boolean(erro)}
          aria-describedby={idDescricao}
        />
      )}
      {erro && (
        <span id={`${id}-erro`} role="alert" className="text-xs font-medium text-red-500">
          {erro}
        </span>
      )}
      {dica && !erro && (
        <span id={`${id}-dica`} className="text-xs text-slate-500">
          {dica}
        </span>
      )}
    </div>
  );
};
