# Cenários de teste — VZS-142

Referência: documentação da entrega, versão 2.3.0.
Os resultados de execução ficam em execucao.md e nos relatórios automatizados.

## Cenários manuais

| ID | Cenário | Referência |
|---|---|---|
| CT-M01 | Frete no subtotal de R$ 200 sem cupom | CA06 |
| CT-M02 | Frete no subtotal de R$ 200 com cupom | CA06/CA08 |
| CT-M03 | Frete acima de R$ 200 sem cupom | CA06 |
| CT-M04 | Frete considera subtotal antes do desconto | CA08 |
| CT-M05 | Cupom em minúsculas | CA02 |
| CT-M06 | Cupom com letras variadas e espaços externos | CA02 |
| CT-M07 | Cupom inexistente | CA03 |
| CT-M08 | Cupom expirado | CA04 |
| CT-M09 | Impedir outro cupom enquanto há um ativo | CA05 |
| CT-M10 | Remover cupom e restaurar valores | CA05 |
| CT-M11 | Limitar produto a 5 unidades na interface | CA10 |
| CT-M12 | Frete e valor faltante abaixo de R$ 200 | CA07 |
| CT-M13 | Desconto somente nos produtos | CA01/CA09 |
| CT-M14 | Recalcular ao aumentar quantidade | CA01/CA06 |
| CT-M15 | Recalcular ao reduzir quantidade | CA01/CA07 |
| CT-M16 | Rejeitar nome sem sobrenome | Regra do cliente |
| CT-M17 | Confirmar pedido com dados válidos e CEP com hífen | Regra do pedido |
| CT-M18 | Rejeitar e-mail inválido | Regra do cliente |
| CT-M19 | Rejeitar CEP com 7 dígitos | Regra do cliente |
| CT-M20 | Confirmar pedido com CEP sem hífen | Regra do cliente |

## Gherkin dos fluxos principais

### Cupom válido — CA01/CA09

Dado um carrinho com uma mochila de R$ 100,00
Quando aplico o cupom BEMVINDO10
Então o desconto é R$ 10,00
E o frete é R$ 19,90
E o total é R$ 109,90

### Normalização do cupom — CA02

Dado um carrinho com produtos
Quando aplico "bemvindo10" ou "  BeMvInDo10  "
Então o cupom é reconhecido como BEMVINDO10
E aplica 10% de desconto sobre o subtotal

### Cupons rejeitados — CA03/CA04

Dado um carrinho sem cupom ativo
Quando aplico TESTEINVALIDO
Então vejo "Cupom inválido."
E nenhum desconto é aplicado

Dado um carrinho sem cupom ativo
Quando aplico VERAO2026
Então vejo "Cupom expirado."
E nenhum desconto é aplicado

### Limite inclusivo do frete — CA06

Dado um carrinho com duas mochilas de R$ 100,00 cada
Quando o resumo é calculado
Então o frete é grátis
E o total sem cupom é R$ 200,00

### Base do frete — CA08

Dado um carrinho com subtotal de R$ 209,60
Quando aplico BEMVINDO10
Então o desconto é R$ 20,96
E o frete permanece grátis
E o total é R$ 188,64

### Quantidade máxima — CA10

Dado um produto com 5 unidades no carrinho
Quando tento adicionar a sexta unidade pela interface
Então o carrinho mantém no máximo 5 unidades

Dado uma requisição de cálculo com 6 unidades de P005
Quando envio a requisição
Então recebo HTTP 422
E o código QUANTIDADE_MAXIMA_EXCEDIDA

## Cobertura adicional de API

- Consultar os oito produtos e um produto por ID.
- Validar subtotal abaixo, no limite e acima de R$ 200.
- Validar cupons inexistentes e expirados no cálculo e no pedido.
- Validar itens vazios, duplicados e produtos inexistentes.
- Rejeitar quantidade zero, negativa, fracionária e maior que 5.
- Aceitar quantidade 5.
- Validar dados do cliente e confirmação do pedido.
- Comparar valores do cálculo com a confirmação.

## Interpretações e limites

- HTTP 200 sem desconto para cupom inválido/expirado no cálculo
  é esperado; no pedido, deve retornar HTTP 422.
- Código do cupom exibido em maiúsculas é normalização aceitável.
- CA08 é testado separadamente do limite inclusivo do CA06.
- Os preços fixos terminam em décimos de real; com desconto de 10%,
  os dados disponíveis não exigem arredondamento de terceira casa.
  Verificamos precisão dos valores e apresentação com duas casas.
- Carrinho isolado por aba, pedidos fictícios, ausência de estoque,
  e-mail e cobrança são simplificações esperadas.
- Carga, estresse, segurança, login, cadastro, pagamento online
  e consulta de pedidos ficam fora do escopo.
