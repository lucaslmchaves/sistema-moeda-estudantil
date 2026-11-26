// Campo de seleção com rótulo e mensagem de erro, no mesmo padrão dos campos de texto.
import { classeControle } from '../../utils/estilos';
import { Icone } from '../icones/Icone';
import { CampoFormulario } from './CampoFormulario';

interface OpcaoSelect<V> {
  valor: V;
  rotulo: string;
}

interface SelectFormularioProps<V> {
  id: string;
  rotulo: string;
  valor: V | '';
  opcoes: OpcaoSelect<V>[];
  textoPadrao: string;
  onChange: (valor: V) => void;
  erro?: string;
  obrigatorio?: boolean;
  colunaCheia?: boolean;
}

// Mostra a lista de opções e devolve o valor escolhido, no tipo das opções.
export function SelectFormulario<V extends string | number>({
  id,
  rotulo,
  valor,
  opcoes,
  textoPadrao,
  onChange,
  erro,
  obrigatorio = false,
  colunaCheia = false,
}: SelectFormularioProps<V>) {
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
          onChange={(e) => {
            const escolhida = opcoes.find((o) => String(o.valor) === e.target.value);
            if (escolhida) onChange(escolhida.valor);
          }}
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
}
