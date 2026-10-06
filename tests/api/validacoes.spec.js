const { test, expect } = require('@playwright/test');

const cliente = {
  nome: 'Maria Silva',
  email: 'maria@example.com',
  cep: '01310-100',
};

async function enviar(request, testInfo, endpoint, payload) {
  const response = await request.post(endpoint, { data: payload });
  const body = await response.json();

  await testInfo.attach('requisicao-resposta', {
    body: Buffer.from(JSON.stringify({
      executadoEm: new Date().toISOString(),
      endpoint,
      requisicao: payload,
      status: response.status(),
      resposta: body,
    }, null, 2)),
    contentType: 'application/json',
  });

  return { status: response.status(), body };
}

test('API01: catálogo contém os oito produtos e preços documentados', async ({ request }) => {
  const response = await request.get('/api/produtos');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveLength(8);
  const precos = Object.fromEntries(body.map(p => [p.id, p.preco]));
  expect(precos).toEqual({
    P001: 59.9, P002: 139.9, P003: 189.9, P004: 49.9,
    P005: 100, P006: 29.9, P007: 229.9, P008: 50,
  });
});

test('API02: consultar P005 por ID', async ({ request }) => {
  const response = await request.get('/api/produtos/P005');
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    id: 'P005', nome: 'Mochila Urbana 20L', preco: 100,
  });
});

test('API03: produto inexistente retorna 404', async ({ request }) => {
  const response = await request.get('/api/produtos/INEXISTENTE');
  expect(response.status()).toBe(404);
  expect(await response.json()).toMatchObject({
    erro: { codigo: 'PRODUTO_NAO_ENCONTRADO' },
  });
});

for (const cupom of ['bemvindo10', '  BeMvInDo10  ']) {
  test('API04 CA02: normalizar ' + JSON.stringify(cupom), async ({ request }, testInfo) => {
    const result = await enviar(request, testInfo, '/api/carrinho/calcular', {
      itens: [{ produtoId: 'P005', quantidade: 1 }], cupom,
    });
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      subtotal: 100, desconto: 10, frete: 19.9, total: 109.9,
      cupom: { codigo: 'BEMVINDO10', aplicado: true },
    });
  });
}

for (const caso of [
  { cupom: 'TESTEINVALIDO', mensagem: 'Cupom inválido.', codigo: 'CUPOM_INVALIDO' },
  { cupom: 'VERAO2026', mensagem: 'Cupom expirado.', codigo: 'CUPOM_EXPIRADO' },
]) {
  test('API05: cálculo rejeita ' + caso.cupom + ' sem erro HTTP', async ({ request }, testInfo) => {
    const result = await enviar(request, testInfo, '/api/carrinho/calcular', {
      itens: [{ produtoId: 'P005', quantidade: 1 }], cupom: caso.cupom,
    });
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      desconto: 0, total: 119.9,
      cupom: { aplicado: false, mensagem: caso.mensagem },
    });
  });

  test('API06: pedido rejeita ' + caso.cupom + ' com 422', async ({ request }, testInfo) => {
    const result = await enviar(request, testInfo, '/api/pedidos', {
      cliente, itens: [{ produtoId: 'P005', quantidade: 1 }],
      cupom: caso.cupom,
    });
    expect(result.status).toBe(422);
    expect(result.body.erro.codigo).toBe(caso.codigo);
  });
}

test('API07 CA07: subtotal R$ 199,80 e faltante R$ 0,20', async ({ request }, testInfo) => {
  const result = await enviar(request, testInfo, '/api/carrinho/calcular', {
    itens: [
      { produtoId: 'P002', quantidade: 1 },
      { produtoId: 'P001', quantidade: 1 },
    ],
  });
  expect(result.status).toBe(200);
  expect(result.body).toMatchObject({
    subtotal: 199.8, desconto: 0, frete: 19.9,
    freteGratis: false, valorFaltanteFreteGratis: 0.2, total: 219.7,
  });
});

test('API08 CA08: subtotal acima do limite antes do desconto', async ({ request }, testInfo) => {
  const result = await enviar(request, testInfo, '/api/carrinho/calcular', {
    itens: [
      { produtoId: 'P001', quantidade: 3 },
      { produtoId: 'P006', quantidade: 1 },
    ],
    cupom: 'BEMVINDO10',
  });
  expect(result.status).toBe(200);
  expect(result.body).toMatchObject({
    subtotal: 209.6, desconto: 20.96, frete: 0,
    freteGratis: true, valorFaltanteFreteGratis: 0, total: 188.64,
  });
});

const invalidos = [
  { nome: 'itens ausentes', payload: {}, codigo: 'ITENS_OBRIGATORIOS' },
  { nome: 'itens vazios', payload: { itens: [] }, codigo: 'ITENS_OBRIGATORIOS' },
  { nome: 'item nulo', payload: { itens: [null] }, codigo: 'ITEM_INVALIDO' },
  {
    nome: 'produto inexistente',
    payload: { itens: [{ produtoId: 'INEXISTENTE', quantidade: 1 }] },
    codigo: 'PRODUTO_NAO_ENCONTRADO',
  },
  {
    nome: 'produto duplicado',
    payload: { itens: [
      { produtoId: 'P005', quantidade: 1 },
      { produtoId: 'P005', quantidade: 1 },
    ] },
    codigo: 'ITEM_DUPLICADO',
  },
];

for (const quantidade of [0, -1, 1.5]) {
  invalidos.push({
    nome: 'quantidade ' + quantidade,
    payload: { itens: [{ produtoId: 'P005', quantidade }] },
    codigo: 'QUANTIDADE_INVALIDA',
  });
}

for (const caso of invalidos) {
  test('API09: rejeitar ' + caso.nome, async ({ request }, testInfo) => {
    const result = await enviar(request, testInfo, '/api/carrinho/calcular', caso.payload);
    expect(result.status).toBe(422);
    expect(result.body.erro.codigo).toBe(caso.codigo);
  });
}

test('API10 CA10: aceitar cinco unidades', async ({ request }, testInfo) => {
  const result = await enviar(request, testInfo, '/api/carrinho/calcular', {
    itens: [{ produtoId: 'P005', quantidade: 5 }],
  });
  expect(result.status).toBe(200);
  expect(result.body).toMatchObject({
    subtotal: 500, desconto: 0, frete: 0, total: 500,
  });
  expect(result.body.itens[0].quantidade).toBe(5);
});

test('API11 CA10: pedido rejeita seis unidades', async ({ request }, testInfo) => {
  const result = await enviar(request, testInfo, '/api/pedidos', {
    cliente, itens: [{ produtoId: 'P005', quantidade: 6 }],
  });
  expect(result.status).toBe(422);
  expect(result.body.erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
});

for (const caso of [
  { nome: 'nome sem sobrenome', dados: { ...cliente, nome: 'Maria' } },
  { nome: 'email inválido', dados: { ...cliente, email: 'maria' } },
  { nome: 'CEP com sete dígitos', dados: { ...cliente, cep: '0131010' } },
]) {
  test('API12: rejeitar ' + caso.nome, async ({ request }, testInfo) => {
    const result = await enviar(request, testInfo, '/api/pedidos', {
      cliente: caso.dados,
      itens: [{ produtoId: 'P005', quantidade: 1 }],
    });
    expect(result.status).toBe(422);
    expect(result.body.erro.codigo).toBe('DADOS_INVALIDOS');
  });
}

for (const cep of ['01310-100', '01310100']) {
  test('API13: confirmar pedido e comparar cálculo — CEP ' + cep, async ({ request }, testInfo) => {
    const payload = {
      itens: [{ produtoId: 'P005', quantidade: 1 }],
      cupom: 'BEMVINDO10',
    };
    const calculo = await enviar(request, testInfo, '/api/carrinho/calcular', payload);
    expect(calculo.status).toBe(200);

    const pedido = await enviar(request, testInfo, '/api/pedidos', {
      ...payload, cliente: { ...cliente, cep },
    });
    expect(pedido.status).toBe(201);
    expect(pedido.body.numero).toMatch(/^VZ-[0-9]{6}$/);
    expect(pedido.body.cliente).toMatchObject({
      nome: 'Maria Silva', email: 'maria@example.com', cep: '01310100',
    });
    expect(pedido.body).toMatchObject({
      subtotal: 100, desconto: 10, frete: 19.9,
      freteGratis: false, valorFaltanteFreteGratis: 100, total: 109.9,
    });

    for (const campo of [
      'subtotal', 'desconto', 'frete', 'freteGratis',
      'valorFaltanteFreteGratis', 'total', 'itens', 'cupom',
    ]) {
      expect(pedido.body[campo]).toEqual(calculo.body[campo]);
    }
  });
}
