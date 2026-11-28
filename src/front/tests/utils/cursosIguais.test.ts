// Garante que a lista de cursos da tela é a mesma que a API aceita.
/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import api from '../../../back/app/service/formatos.py?raw';
import { CURSOS } from '../../src/utils/regrasDeCampos';

describe('lista de cursos', () => {
  it('é igual à da API', () => {
    const inicio = api.indexOf('CURSOS = (');
    const bloco = api.slice(inicio, api.indexOf('\n)', inicio));

    expect([...bloco.matchAll(/"([^"]+)"/g)].map((m) => m[1])).toEqual(CURSOS);
  });
});
