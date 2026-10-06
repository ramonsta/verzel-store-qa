# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/carrinho.spec.js >> CA06 e CA08: frete grátis em R$ 200 antes do desconto
- Location: tests/api/carrinho.spec.js:26:1

# Error details

```
Error: expect(received).toMatchObject(expected)

- Expected  - 3
+ Received  + 3

  Object {
    "cupom": Object {
      "aplicado": true,
    },
    "desconto": 20,
-   "frete": 0,
-   "freteGratis": true,
+   "frete": 19.9,
+   "freteGratis": false,
    "subtotal": 200,
-   "total": 180,
+   "total": 199.9,
    "valorFaltanteFreteGratis": 0,
  }
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('CA01 e CA09: desconto somente nos produtos, sem descontar o frete', async ({ request }) => {
  4  |   const response = await request.post('/api/carrinho/calcular', {
  5  |     data: {
  6  |       itens: [{ produtoId: 'P005', quantidade: 1 }],
  7  |       cupom: 'BEMVINDO10',
  8  |     },
  9  |   });
  10 | 
  11 |   expect(response.status()).toBe(200);
  12 | 
  13 |   const body = await response.json();
  14 | 
  15 |   expect(body).toMatchObject({
  16 |     subtotal: 100,
  17 |     desconto: 10,
  18 |     frete: 19.9,
  19 |     freteGratis: false,
  20 |     valorFaltanteFreteGratis: 100,
  21 |     total: 109.9,
  22 |     cupom: { aplicado: true },
  23 |   });
  24 | });
  25 | 
  26 | test('CA06 e CA08: frete grátis em R$ 200 antes do desconto', async ({ request }) => {
  27 |   const response = await request.post('/api/carrinho/calcular', {
  28 |     data: {
  29 |       itens: [{ produtoId: 'P005', quantidade: 2 }],
  30 |       cupom: 'BEMVINDO10',
  31 |     },
  32 |   });
  33 | 
  34 |   expect(response.status()).toBe(200);
  35 | 
  36 |   const body = await response.json();
  37 | 
> 38 |   expect(body).toMatchObject({
     |                ^ Error: expect(received).toMatchObject(expected)
  39 |     subtotal: 200,
  40 |     desconto: 20,
  41 |     frete: 0,
  42 |     freteGratis: true,
  43 |     valorFaltanteFreteGratis: 0,
  44 |     total: 180,
  45 |     cupom: { aplicado: true },
  46 |   });
  47 | });
  48 | 
  49 | test('CA10: API rejeita mais de 5 unidades do mesmo produto', async ({ request }) => {
  50 |   const response = await request.post('/api/carrinho/calcular', {
  51 |     data: {
  52 |       itens: [{ produtoId: 'P005', quantidade: 6 }],
  53 |     },
  54 |   });
  55 | 
  56 |   expect(response.status()).toBe(422);
  57 | 
  58 |   const body = await response.json();
  59 | 
  60 |   expect(body.erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  61 | });
  62 | 
```