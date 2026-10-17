// Tabela genérica e responsiva para as listagens do sistema.
import React from 'react';

type Alinhamento = 'left' | 'center' | 'right';

export interface ColunaTabela<T> {
  cabecalho: string;
  render: (item: T) => React.ReactNode;
  alinhamento?: Alinhamento;
}

interface TabelaProps<T> {
  colunas: ColunaTabela<T>[];
  dados: T[];
  chaveExtrator: (item: T) => string | number;
}

const CLASSE_ALINHAMENTO: Record<Alinhamento, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// Desenha o cabeçalho e uma linha por item, alinhando cada coluna.
export function Tabela<T>({ colunas, dados, chaveExtrator }: TabelaProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th
                key={coluna.cabecalho}
                className={`border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-500 ${CLASSE_ALINHAMENTO[coluna.alinhamento ?? 'left']}`}
              >
                {coluna.cabecalho}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr
              key={chaveExtrator(item)}
              className="hover:bg-slate-50 [&:last-child>td]:border-b-0"
            >
              {colunas.map((coluna) => (
                <td
                  key={coluna.cabecalho}
                  className={`border-b border-slate-200 px-4 py-3 ${CLASSE_ALINHAMENTO[coluna.alinhamento ?? 'left']}`}
                >
                  {coluna.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
