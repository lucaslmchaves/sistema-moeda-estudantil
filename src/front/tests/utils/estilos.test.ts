// Testes das classes de estilo reutilizadas pelos componentes.
import { describe, expect, it } from 'vitest';
import { classeBotao, classeControle, classeLinkNavegacao } from '../../src/utils/estilos';

describe('classeBotao', () => {
  it('usa a cor de cada variante', () => {
    expect(classeBotao('primario')).toContain('bg-indigo-600');
    expect(classeBotao('secundario')).toContain('bg-white');
    expect(classeBotao('perigo')).toContain('bg-red-500');
  });

  it('usa o tamanho pequeno quando pedido', () => {
    expect(classeBotao('primario', true)).toContain('text-xs');
    expect(classeBotao('primario')).toContain('text-sm');
  });
});

describe('classeLinkNavegacao', () => {
  it('destaca o link da rota ativa', () => {
    expect(classeLinkNavegacao(true)).toContain('bg-indigo-50');
    expect(classeLinkNavegacao(false)).toContain('text-slate-500');
  });
});

describe('classeControle', () => {
  it('usa borda vermelha quando há erro e cinza quando não há', () => {
    expect(classeControle(true)).toContain('border-red-500');
    expect(classeControle(false)).toContain('border-slate-200');
  });
});
