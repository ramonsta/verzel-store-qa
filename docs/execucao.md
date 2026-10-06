# Execução manual — Verzel Store

Data: 06/10/2026.
Referência: VZS-142, versão documentada 2.3.0.

| ID | Cenário | Esperado | Observado | Resultado |
|---|---|---|---|---|
| CT-M01 | 2 P005 sem cupom | Frete grátis; total R$ 200,00 | Frete R$ 19,90; total R$ 219,90 | Reprovado — BUG-001 |
| CT-M02 | 2 P005 com BEMVINDO10 | Desconto R$ 20,00; frete grátis; total R$ 180,00 | Desconto R$ 20,00; frete R$ 19,90; total R$ 199,90 | Reprovado — BUG-001 |
| CT-M03 | 3 P001 + 1 P006 sem cupom | Subtotal R$ 209,60; frete grátis; total R$ 209,60 | Conforme esperado | Aprovado |
| CT-M04 | 3 P001 + 1 P006 com BEMVINDO10 — CA08 | Desconto R$ 20,96; frete grátis; total R$ 188,64 | Conforme esperado | Aprovado |

| CT-M05 | Cupom bemvindo10 em minúsculas — CA02 | Desconto R$ 20,96; frete grátis; total R$ 188,64 | Conforme esperado; código exibido como BEMVINDO10 | Aprovado |
| CT-M06 | Cupom BeMvInDo10 com espaços no início e fim — CA02 | Desconto R$ 20,96; frete grátis; total R$ 188,64 | Conforme esperado; código normalizado para BEMVINDO10 | Aprovado |

| CT-M07 | Cupom TESTEINVALIDO — CA03 | Mensagem de cupom inválido; nenhum desconto; total R$ 209,60 | Mensagem de cupom inválido; total mantido em R$ 209,60 | Aprovado |
| CT-M08 | Cupom VERAO2026 — CA04 | Mensagem de cupom expirado; nenhum desconto; total R$ 209,60 | Mensagem de cupom expirado; total mantido em R$ 209,60 | Aprovado |

| CT-M09 | Tentar aplicar outro cupom com BEMVINDO10 ativo — CA05 | Impedir aplicação de outro cupom | Aplicação de outro cupom indisponível | Aprovado |
| CT-M10 | Remover BEMVINDO10 | Remover desconto; manter frete grátis; total R$ 209,60 | Total original de R$ 209,60 restaurado | Aprovado |

| CT-M11 | Tentar adicionar a sexta mochila P005 — CA10 | Manter no máximo 5 unidades | Limite de 5 unidades; desconto R$ 0,00; frete grátis | Aprovado |

| CT-M12 | 1 P002 + 1 P001 sem cupom — CA07 | Subtotal R$ 199,80; frete R$ 19,90; total R$ 219,70; faltante R$ 0,20 | Conforme esperado | Aprovado |

| CT-M13 | 1 P002 + 1 P001 com BEMVINDO10 — CA01/CA09 | Desconto R$ 19,98; frete R$ 19,90; total R$ 199,72; faltante R$ 0,20 | Conforme esperado | Aprovado |

| CT-M14 | Aumentar P001 de 1 para 2, mantendo P002 e BEMVINDO10 | Subtotal R$ 259,70; desconto R$ 25,97; frete grátis; total R$ 233,73 | Conforme esperado | Aprovado |

| CT-M15 | Reduzir P001 de 2 para 1, mantendo P002 e BEMVINDO10 | Subtotal R$ 199,80; desconto R$ 19,98; frete R$ 19,90; total R$ 199,72; faltante R$ 0,20 | Conforme esperado | Aprovado |

| CT-M16 | Finalizar com nome Maria, e-mail e CEP válidos | Impedir confirmação e exigir nome e sobrenome | Exibiu aviso exigindo sobrenome | Aprovado |

| CT-M17 | Confirmar pedido com Maria Silva, maria@example.com e CEP 01310-100 | Confirmar; número no formato VZ-000000; total R$ 199,72 | Pedido VZ-719431 confirmado; valores conforme esperado | Aprovado |

| CT-M18 | Finalizar com Maria Silva, e-mail maria e CEP válido | Impedir confirmação e exigir e-mail válido | Exigiu e-mail válido | Aprovado |

| CT-M19 | Finalizar com nome e e-mail válidos e CEP 0131010 | Impedir confirmação e exigir CEP com 8 dígitos | Exigiu os 8 dígitos do CEP | Aprovado |

| CT-M20 | Confirmar 1 P005 sem cupom, com dados válidos e CEP 01310100 | Aceitar CEP sem hífen; subtotal R$ 100,00; desconto zero; frete R$ 19,90; total R$ 119,90 | Pedido confirmado; valores conforme esperado | Aprovado |

## Execução automatizada consolidada

Data: 06/10/2026.
Comando: npm test.
Total: 32 testes — 28 aprovados e 4 reprovados.

| Falha | Resultado observado | Bug |
|---|---|---|
| API: subtotal R$ 200 com cupom | Frete R$ 19,90; total R$ 199,90 | BUG-001 |
| Interface: subtotal R$ 200 sem cupom | Frete R$ 19,90 | BUG-001 |
| API: cálculo com seis unidades | HTTP 200 em vez de 422 | BUG-002 |
| API: pedido com seis unidades | HTTP 201 em vez de 422 | BUG-002 |

CA08 foi aprovado separadamente com subtotal R$ 209,60,
desconto R$ 20,96, frete grátis e total R$ 188,64.

Relatório preservado em:
evidencias/execucao-consolidada/playwright-report/index.html.