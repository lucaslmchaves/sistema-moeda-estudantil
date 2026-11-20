// Campo de seleção com rótulo e mensagem de erro, no mesmo padrão dos campos de texto.
import React from 'react';
import { classeControle } from '../../utils/estilos';
import { Icone } from '../icones/Icone';
import { CampoFormulario } from './CampoFormulario';

interface OpcaoSelect {
  valor: number;
  rotulo: string;
}

interface SelectFormularioProps {
  id: string;
  rotulo: string;
  valor: number | '';
  opcoes: OpcaoSelect[];
  textoPadrao: string;
  onChange: (valor: number) => void;
  erro?: string;
  obrigatorio?: boolean;
  colunaCheia?: boolean;
}

// Mostra a lista de opções e devolve o valor numérico escolhido.
export const SelectFormulario: React.FC<SelectFormularioProps> = ({
  id,
  rotulo,
  valor,
  opcoes,
  textoPadrao,
  onChange,
  erro,
  obrigatorio = false,
  colunaCheia = false,
}) => {
  return (
    <CampoFormulario
      id={id}
      rotulo={rotulo}
      erro={erro}
      obrigatorio={obrigatorio}
      colunaCheia={colunaCheia}
    >
      <div className="relative">
        <select
          id={id}
          className={`${classeControle(Boolean(erro))} cursor-pointer appearance-none pr-10 ${valor === '' ? 'text-tinta-3' : ''}`}
          value={valor}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? `${id}-erro` : undefined}
        >
          <option value="" disabled>
            {textoPadrao}
          </option>
          {opcoes.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor} className="text-tinta">
              {opcao.rotulo}
            </option>
          ))}
        </select>
        <Icone
          nome="caret-down"
          tamanho={16}
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-tinta-3"
        />
      </div>
    </CampoFormulario>
  );
};
