// Testes das classes de estilo reutilizadas pelos componentes.
import { describe, expect, it } from 'vitest';
import { classeBotao, classeControle, classeLinkNavegacao } from '../../src/utils/estilos';

describe('classeBotao', () => {
  it('usa a cor de cada variante', () => {
    expect(classeBotao('primario')).toContain('bg-anil');
    expect(classeBotao('secundario')).toContain('bg-superficie');
    expect(classeBotao('perigo')).toContain('bg-negativo');
  });

  it('usa o tamanho pequeno quando pedido', () => {
    expect(classeBotao('primario', true)).toContain('text-xs');
    expect(classeBotao('primario')).toContain('text-sm');
    expect(classeBotao('primario', 'grande')).toContain('h-12');
  });
});

describe('classeLinkNavegacao', () => {
  it('destaca o link da rota ativa', () => {
    expect(classeLinkNavegacao(true)).toContain('bg-anil-100');
    expect(classeLinkNavegacao(false)).toContain('text-tinta-2');
  });
});

describe('classeControle', () => {
  it('usa borda vermelha quando há erro e cinza quando não há', () => {
    expect(classeControle(true)).toContain('border-negativo');
    expect(classeControle(false)).toContain('border-linha-forte');
  });
});
