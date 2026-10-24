// Campo de seleção com rótulo e mensagem de erro, no mesmo padrão dos campos de texto.
import React from 'react';
import { classeControle } from '../../utils/estilos';
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
}) => {
  return (
    <CampoFormulario id={id} rotulo={rotulo} erro={erro} obrigatorio={obrigatorio}>
      <select
        id={id}
        className={classeControle(Boolean(erro))}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
      >
        <option value="" disabled>
          {textoPadrao}
        </option>
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </CampoFormulario>
  );
};
