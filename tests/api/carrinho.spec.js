const { test, expect } = require('@playwright/test');

test('CA01 e CA09: desconto somente nos produtos, sem descontar o frete', async ({ request }) => {
  const response = await request.post('/api/carrinho/calcular', {
    data: {
      itens: [{ produtoId: 'P005', quantidade: 1 }],
      cupom: 'BEMVINDO10',
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body).toMatchObject({
    subtotal: 100,
    desconto: 10,
    frete: 19.9,
    freteGratis: false,
    valorFaltanteFreteGratis: 100,
    total: 109.9,
    cupom: { aplicado: true },
  });
});

test('CA06 e CA08: frete grátis em R$ 200 antes do desconto', async ({ request }) => {
  const response = await request.post('/api/carrinho/calcular', {
    data: {
      itens: [{ produtoId: 'P005', quantidade: 2 }],
      cupom: 'BEMVINDO10',
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body).toMatchObject({
    subtotal: 200,
    desconto: 20,
    frete: 0,
    freteGratis: true,
    valorFaltanteFreteGratis: 0,
    total: 180,
    cupom: { aplicado: true },
  });
});

test('CA10: API rejeita mais de 5 unidades do mesmo produto', async ({ request }) => {
  const response = await request.post('/api/carrinho/calcular', {
    data: {
      itens: [{ produtoId: 'P005', quantidade: 6 }],
    },
  });

  expect(response.status()).toBe(422);

  const body = await response.json();

  expect(body.erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
});
