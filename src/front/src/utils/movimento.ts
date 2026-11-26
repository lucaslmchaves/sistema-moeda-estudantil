// Preferência de movimento: sem animação quando o navegador não oferece o recurso
// ou quando o usuário pede menos movimento no sistema.
export function podeAnimar(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
