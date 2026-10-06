# Testes exploratórios

## EXP-01 — Remover todos os itens e reconstruir o carrinho

Data: 06/10/2026.
Objetivo: investigar valores desatualizados e o comportamento
do cupom ao remover todos os produtos e adicionar outro.

### Execução
1. Montar carrinho com uma mochila P005 e BEMVINDO10.
2. Remover o produto, deixando o carrinho vazio.
3. Observar os valores.
4. Adicionar uma garrafa térmica P008 e consultar o resumo.

### Observado
- Ao esvaziar, os valores zeraram e o carrinho ficou vazio.
- Ao adicionar a garrafa, BEMVINDO10 permaneceu ativo.
- Subtotal: R$ 50,00.
- Desconto: R$ 5,00.
- Frete: R$ 19,90.
- Total: R$ 64,90.
- Faltante para frete grátis: R$ 150,00.

### Interpretação
A documentação não especifica se o cupom deve ser removido
quando o carrinho fica vazio. Sua permanência foi considerada
aceitável, pois os valores foram recalculados para os novos itens.

### Resultado
Nenhum defeito adicional identificado nas verificações descritas.
A disponibilidade da opção de finalizar com carrinho vazio
não foi confirmada nesta sessão.