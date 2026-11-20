# Moeda Estudantil — sistema visual

Referências: SaaS de Abdul Saboor (Behance: Umber, PivotHR), princípios do `impeccable`, ícones Phosphor via Iconify.

- **Fundo:** papel quente `#f4f2ed`; superfícies brancas com borda fina `#e6e2d9`. Sem sombra em cartão parado; sombra só no que flutua (modal, notificações).
- **Tinta:** `#16151a` para texto e botão principal (preto, como nas referências). Secundário `#4a4640`, apagado `#6b655c` (≥ 4,5:1 sobre o papel).
- **Acento:** lavanda (`#ebe5fd` blocos, `#c0aff7` moeda) e violeta `#5a3fd6` (foco, item ativo, palavra de destaque).
- **Sentido do dinheiro:** verde `#17744b` para entradas; saídas em tinta, sem vermelho (trocar moedas não é erro).
- **Tipo:** Instrument Sans (UI e títulos 500, tracking -0,03em) + Instrument Serif itálico em uma palavra de destaque por título de vitrine. Números com `tabular-nums`.
- **Raios:** controles 10px, cartões 16px, carteira 20px, chips em pílula.
- **Peças-chave:** `CartaoCarteira` (saldo no cartão escuro), `ListaMovimentacoes` (lê "De/Para/Resgate" da API), `ValorMoedas` + `IconeMoeda`, `Icone` (SVG embutido, sem rede).
- **Movimento:** só entrada de modal/alertas e hover dos cartões, saída exponencial; respeita `prefers-reduced-motion`.
