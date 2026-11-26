# Moeda Estudantil — sistema visual

Referências: SaaS de Abdul Saboor (Behance: Umber, PivotHR), princípios do `impeccable`, ícones Phosphor via Iconify.

- **Fundo:** claro e frio `#f6f7fb`; superfícies brancas com borda fina `#e4e8f1`. Sem sombra em cartão parado; sombra no que flutua (modal, notificações, cartão de saldo).
- **Tinta:** `#0f172a` para texto. Secundário `#334155`, apagado `#5b6678` (≥ 4,5:1 sobre o fundo).
- **Principal:** azul-índigo (`anil`, `#4f46e5`) nos botões, no foco, no item ativo e nas palavras de destaque; degradê índigo no cartão de saldo e nos painéis de destaque.
- **Moedas:** ouro (`#f6d365`, `#e0aa1f`) em toda moeda desenhada, nos anéis do cartão e nos destaques sobre fundo escuro.
- **Sentido do dinheiro:** verde `#17744b` para entradas; saídas em tinta, sem vermelho (trocar moedas não é erro).
- **Tipo:** Instrument Sans (UI e títulos 500, tracking -0,03em) + Instrument Serif itálico em uma palavra de destaque por título de vitrine. Números com `tabular-nums`.
- **Raios:** controles 10px, cartões 16px, carteira 20px, chips em pílula.
- **Peças-chave:** `CartaoCarteira` (saldo com contagem), `ListaMovimentacoes` (lê "De/Para/Resgate" da API), `ValorMoedas` + `IconeMoeda`, `Icone` (SVG embutido, sem rede).
- **Movimento** (`componentes/animacao`): transição entre páginas, entrada em sequência, saldo contando, mural de mensagens no login, moedas flutuando, palavra "moeda" que vira moeda e seções que surgem ao rolar. Tudo respeita `prefers-reduced-motion`.
- **Login:** a aba "Professor" aceita só professores; a aba "Aluno ou empresa" recusa professores (`utils/perfilDeAcesso.ts`).
- **Espera:** quando uma resposta demora mais de 4 segundos (primeira visita do dia), aparece a tela `EsperaComMoedas`, com frases e moedas para apanhar, no lugar de um aviso técnico.
- **Comemoração:** chuva de moedas ao enviar moedas e ao trocar por vantagem.
- **Formulários:** CPF e CNPJ com máscara e conferência dos dígitos, senha com mostrar/ocultar e confirmação, cursor no primeiro campo com erro.
