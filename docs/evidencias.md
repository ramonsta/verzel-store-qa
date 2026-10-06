# Índice de evidências

## API — diagnóstico inicial

- [R$ 200 sem cupom](../evidencias/api/subtotal-200-sem-cupom.json)
- [R$ 200 com cupom](../evidencias/api/subtotal-200-com-cupom.json)
- [Controle acima do limite](../evidencias/api/subtotal-22990-com-cupom.json)
- [Seis unidades](../evidencias/api/quantidade-6.json)

## Interface

- [BUG-001 com cupom — captura manual](../evidencias/ui/bug-001-subtotal-200-com-cupom.png)
- [BUG-001 sem cupom — captura automatizada](../evidencias/automacao-ui/bug-001-test-failed-1.png)
- [Trace do BUG-001](../evidencias/automacao-ui/bug-001-trace.zip)

## Relatórios

- Primeira execução de API: evidencias/primeira-execucao/playwright-report/index.html.
- Execução consolidada: será preservada em evidencias/execucao-consolidada.
- Os testes adicionais de API anexam requisição, status e resposta ao relatório.
- Os resultados manuais estão em execucao.md, com base nas observações do executor.
- Apenas as capturas listadas constituem evidência visual;
  não há captura individual de todos os cenários manuais.

Para abrir o relatório consolidado após sua preservação:

    npx playwright show-report evidencias/execucao-consolidada/playwright-report --host 0.0.0.0

Para abrir o trace:

    npx playwright show-trace evidencias/automacao-ui/bug-001-trace.zip
