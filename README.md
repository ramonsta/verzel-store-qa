# Verzel Store — Teste técnico QA Júnior

Validação da entrega VZS-142: cupom de desconto e frete grátis.
Referência: documentação da versão 2.3.0.

## Entregas

- [Cenários e Gherkin](docs/cenarios.md)
- [Execução manual](docs/execucao.md)
- [Relatório de bugs](docs/bugs.md)
- [Índice de evidências](docs/evidencias.md)
- Automação de API: tests/api.
- Automação de interface: tests/ui.
- [Testes exploratórios](docs/exploratorios.md)

## Instalação

Pré-requisito: Node.js com npm, em versão compatível com o
Playwright fixado no package-lock.json.

    npm ci
    npx playwright install --with-deps chromium

## Execução

    npm test
    npm run test:api
    npm run test:ui
    npm run report

Os testes usam a loja real do ambiente fictício:

https://verzel-store.qa-test-verzel-store.workers.dev/

A configuração usa um worker, sem retries.
Cada teste de interface começa em um contexto isolado.
Os testes de API enviam seus próprios dados a cada chamada.

## Resultados conhecidos

- BUG-001: frete cobrado com subtotal de exatamente R$ 200.
- BUG-002: API aceita seis unidades de um produto no cálculo e na confirmação de pedidos.
- A interface respeitou o limite de cinco unidades.

As assertivas mantêm os resultados exigidos pela documentação.
Testes que reproduzem defeitos conhecidos falham e produzem
código de saída diferente de zero. Falhas novas devem ser analisadas
antes de serem classificadas como bugs.



## Evidências automatizadas

Execução consolidada em 06/10/2026: 32 testes, 28 aprovados
e 4 reprovados, relacionados aos BUG-001 e BUG-002.
O BUG-002 foi reproduzido no cálculo e na confirmação de pedidos.
CA08 passou no cenário separado do limite inclusivo.
O relatório HTML preservado está em
evidencias/execucao-consolidada/playwright-report.

Para abri-lo:

    npx playwright show-report evidencias/execucao-consolidada/playwright-report --host 0.0.0.0

Capturas, traces e demais evidências estão relacionados em
docs/evidencias.md.

## Escopo

Cupons, frete, cálculos, quantidade, dados do cliente e confirmação.
Sem testes de carga, estresse ou segurança.
Sem login, cadastro, pagamento online ou consulta de pedidos.

Pedidos são fictícios e não são armazenados.
Não há cobrança, envio de e-mail ou controle de estoque.

## Uso de IA

ChatGPT foi utilizado como apoio na interpretação da documentação,
organização dos cenários, elaboração e revisão de testes Playwright,
análise dos resultados e redação dos documentos.

O candidato executou os comandos e testes manuais no Codespace e
no navegador e informou os resultados observados.
Os defeitos foram registrados a partir dessas execuções.


