# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/carrinho.spec.js >> CA06: frete grátis no subtotal de exatamente R$ 200 — BUG-001
- Location: tests/ui/carrinho.spec.js:48:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('[data-valor="frete"]')
Expected: "Grátis"
Received: "R$ 19,90"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" locator('[data-valor="frete"]') with timeout 5000ms
  - waiting for locator('[data-valor="frete"]')
    14 × locator resolved to <dd data-valor="frete">R$ 19,90</dd>
       - unexpected value "R$ 19,90"

```

```yaml
- definition: R$ 19,90
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | async function abrirCarrinhoComMochila(page) {
  4  |   await page.goto('/');
  5  | 
  6  |   const produto = page.locator('.produto-corpo').filter({
  7  |     has: page.getByRole('heading', {
  8  |       name: 'Mochila Urbana 20L',
  9  |       exact: true,
  10 |     }),
  11 |   });
  12 | 
  13 |   await produto.getByRole('button', {
  14 |     name: 'Adicionar ao carrinho',
  15 |     exact: true,
  16 |   }).click();
  17 | 
  18 |   await expect(
  19 |     page.getByRole('link', { name: /Carrinho/ })
  20 |   ).toContainText('1');
  21 | 
  22 |   await page.getByRole('link', { name: /Carrinho/ }).click();
  23 | 
  24 |   await expect(page.locator('[data-valor="subtotal"]'))
  25 |     .toHaveText('R$ 100,00');
  26 | }
  27 | 
  28 | test('CA01/CA02/CA09: aplicar cupom com espaços e letras variadas', async ({ page }) => {
  29 |   await abrirCarrinhoComMochila(page);
  30 | 
  31 |   await page.getByLabel('Cupom de desconto', { exact: true })
  32 |     .fill('  BeMvInDo10  ');
  33 |   await page.getByRole('button', {
  34 |     name: 'Aplicar cupom',
  35 |     exact: true,
  36 |   }).click();
  37 | 
  38 |   await expect(page.locator('[data-valor="subtotal"]'))
  39 |     .toHaveText('R$ 100,00');
  40 |   await expect(page.locator('[data-valor="desconto"]'))
  41 |     .toHaveText(/-\s*R\$\s*10,00/);
  42 |   await expect(page.locator('[data-valor="frete"]'))
  43 |     .toHaveText('R$ 19,90');
  44 |   await expect(page.locator('[data-valor="total"]'))
  45 |     .toHaveText('R$ 109,90');
  46 | });
  47 | 
  48 | test('CA06: frete grátis no subtotal de exatamente R$ 200 — BUG-001', async ({ page }) => {
  49 |   await abrirCarrinhoComMochila(page);
  50 | 
  51 |   await page.getByRole('button', {
  52 |     name: 'Aumentar quantidade de Mochila Urbana 20L',
  53 |     exact: true,
  54 |   }).click();
  55 | 
  56 |   await expect(page.locator('[data-valor="subtotal"]'))
  57 |     .toHaveText('R$ 200,00');
  58 |   await expect(page.locator('[data-valor="frete"]'))
> 59 |     .toHaveText('Grátis');
     |      ^ Error: expect(locator).toHaveText(expected) failed
  60 |   await expect(page.locator('[data-valor="total"]'))
  61 |     .toHaveText('R$ 200,00');
  62 | });
  63 | 
  64 | test('CA10: interface limita o produto a 5 unidades', async ({ page }) => {
  65 |   await abrirCarrinhoComMochila(page);
  66 | 
  67 |   const aumentar = page.getByRole('button', {
  68 |     name: 'Aumentar quantidade de Mochila Urbana 20L',
  69 |     exact: true,
  70 |   });
  71 |   const quantidade = page.locator('output').filter({
  72 |     hasText: /^1$/,
  73 |   });
  74 | 
  75 |   await expect(quantidade).toHaveCount(1);
  76 | 
  77 |   const contador = page.locator(
  78 |     'output[aria-label="Quantidade de Mochila Urbana 20L"]'
  79 |   );
  80 | 
  81 |   for (let valor = 2; valor <= 5; valor++) {
  82 |     await aumentar.click();
  83 |     await expect(contador).toHaveText(String(valor));
  84 |   }
  85 | 
  86 |   await expect(aumentar).toBeDisabled();
  87 |   await expect(contador).toHaveText('5');
  88 |   await expect(page.locator('[data-valor="subtotal"]'))
  89 |     .toHaveText('R$ 500,00');
  90 |   await expect(page.locator('[data-valor="desconto"]'))
  91 |     .toHaveText('R$ 0,00');
  92 |   await expect(page.locator('[data-valor="frete"]'))
  93 |     .toHaveText('Grátis');
  94 |   await expect(page.locator('[data-valor="total"]'))
  95 |     .toHaveText('R$ 500,00');
  96 | });
```