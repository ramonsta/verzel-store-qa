const { test, expect } = require('@playwright/test');

async function abrirCarrinhoComMochila(page) {
  await page.goto('/');

  const produto = page.locator('.produto-corpo').filter({
    has: page.getByRole('heading', {
      name: 'Mochila Urbana 20L',
      exact: true,
    }),
  });

  await produto.getByRole('button', {
    name: 'Adicionar ao carrinho',
    exact: true,
  }).click();

  await expect(
    page.getByRole('link', { name: /Carrinho/ })
  ).toContainText('1');

  await page.getByRole('link', { name: /Carrinho/ }).click();

  await expect(page.locator('[data-valor="subtotal"]'))
    .toHaveText('R$ 100,00');
}

test('CA01/CA02/CA09: aplicar cupom com espaços e letras variadas', async ({ page }) => {
  await abrirCarrinhoComMochila(page);

  await page.getByLabel('Cupom de desconto', { exact: true })
    .fill('  BeMvInDo10  ');
  await page.getByRole('button', {
    name: 'Aplicar cupom',
    exact: true,
  }).click();

  await expect(page.locator('[data-valor="subtotal"]'))
    .toHaveText('R$ 100,00');
  await expect(page.locator('[data-valor="desconto"]'))
    .toHaveText(/-\s*R\$\s*10,00/);
  await expect(page.locator('[data-valor="frete"]'))
    .toHaveText('R$ 19,90');
  await expect(page.locator('[data-valor="total"]'))
    .toHaveText('R$ 109,90');
});

test('CA06: frete grátis no subtotal de exatamente R$ 200 — BUG-001', async ({ page }) => {
  await abrirCarrinhoComMochila(page);

  await page.getByRole('button', {
    name: 'Aumentar quantidade de Mochila Urbana 20L',
    exact: true,
  }).click();

  await expect(page.locator('[data-valor="subtotal"]'))
    .toHaveText('R$ 200,00');
  await expect(page.locator('[data-valor="frete"]'))
    .toHaveText('Grátis');
  await expect(page.locator('[data-valor="total"]'))
    .toHaveText('R$ 200,00');
});

test('CA10: interface limita o produto a 5 unidades', async ({ page }) => {
  await abrirCarrinhoComMochila(page);

  const aumentar = page.getByRole('button', {
    name: 'Aumentar quantidade de Mochila Urbana 20L',
    exact: true,
  });
  const quantidade = page.locator('output').filter({
    hasText: /^1$/,
  });

  await expect(quantidade).toHaveCount(1);

  const contador = page.locator(
    'output[aria-label="Quantidade de Mochila Urbana 20L"]'
  );

  for (let valor = 2; valor <= 5; valor++) {
    await aumentar.click();
    await expect(contador).toHaveText(String(valor));
  }

  await expect(aumentar).toBeDisabled();
  await expect(contador).toHaveText('5');
  await expect(page.locator('[data-valor="subtotal"]'))
    .toHaveText('R$ 500,00');
  await expect(page.locator('[data-valor="desconto"]'))
    .toHaveText('R$ 0,00');
  await expect(page.locator('[data-valor="frete"]'))
    .toHaveText('Grátis');
  await expect(page.locator('[data-valor="total"]'))
    .toHaveText('R$ 500,00');
});