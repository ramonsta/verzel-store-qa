# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/validacoes.spec.js >> API11 CA10: pedido rejeita seis unidades
- Location: tests/api/validacoes.spec.js:168:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 422
Received: 201
```

# Test source

```ts
  72  |   test('API05: cálculo rejeita ' + caso.cupom + ' sem erro HTTP', async ({ request }, testInfo) => {
  73  |     const result = await enviar(request, testInfo, '/api/carrinho/calcular', {
  74  |       itens: [{ produtoId: 'P005', quantidade: 1 }], cupom: caso.cupom,
  75  |     });
  76  |     expect(result.status).toBe(200);
  77  |     expect(result.body).toMatchObject({
  78  |       desconto: 0, total: 119.9,
  79  |       cupom: { aplicado: false, mensagem: caso.mensagem },
  80  |     });
  81  |   });
  82  | 
  83  |   test('API06: pedido rejeita ' + caso.cupom + ' com 422', async ({ request }, testInfo) => {
  84  |     const result = await enviar(request, testInfo, '/api/pedidos', {
  85  |       cliente, itens: [{ produtoId: 'P005', quantidade: 1 }],
  86  |       cupom: caso.cupom,
  87  |     });
  88  |     expect(result.status).toBe(422);
  89  |     expect(result.body.erro.codigo).toBe(caso.codigo);
  90  |   });
  91  | }
  92  | 
  93  | test('API07 CA07: subtotal R$ 199,80 e faltante R$ 0,20', async ({ request }, testInfo) => {
  94  |   const result = await enviar(request, testInfo, '/api/carrinho/calcular', {
  95  |     itens: [
  96  |       { produtoId: 'P002', quantidade: 1 },
  97  |       { produtoId: 'P001', quantidade: 1 },
  98  |     ],
  99  |   });
  100 |   expect(result.status).toBe(200);
  101 |   expect(result.body).toMatchObject({
  102 |     subtotal: 199.8, desconto: 0, frete: 19.9,
  103 |     freteGratis: false, valorFaltanteFreteGratis: 0.2, total: 219.7,
  104 |   });
  105 | });
  106 | 
  107 | test('API08 CA08: subtotal acima do limite antes do desconto', async ({ request }, testInfo) => {
  108 |   const result = await enviar(request, testInfo, '/api/carrinho/calcular', {
  109 |     itens: [
  110 |       { produtoId: 'P001', quantidade: 3 },
  111 |       { produtoId: 'P006', quantidade: 1 },
  112 |     ],
  113 |     cupom: 'BEMVINDO10',
  114 |   });
  115 |   expect(result.status).toBe(200);
  116 |   expect(result.body).toMatchObject({
  117 |     subtotal: 209.6, desconto: 20.96, frete: 0,
  118 |     freteGratis: true, valorFaltanteFreteGratis: 0, total: 188.64,
  119 |   });
  120 | });
  121 | 
  122 | const invalidos = [
  123 |   { nome: 'itens ausentes', payload: {}, codigo: 'ITENS_OBRIGATORIOS' },
  124 |   { nome: 'itens vazios', payload: { itens: [] }, codigo: 'ITENS_OBRIGATORIOS' },
  125 |   { nome: 'item nulo', payload: { itens: [null] }, codigo: 'ITEM_INVALIDO' },
  126 |   {
  127 |     nome: 'produto inexistente',
  128 |     payload: { itens: [{ produtoId: 'INEXISTENTE', quantidade: 1 }] },
  129 |     codigo: 'PRODUTO_NAO_ENCONTRADO',
  130 |   },
  131 |   {
  132 |     nome: 'produto duplicado',
  133 |     payload: { itens: [
  134 |       { produtoId: 'P005', quantidade: 1 },
  135 |       { produtoId: 'P005', quantidade: 1 },
  136 |     ] },
  137 |     codigo: 'ITEM_DUPLICADO',
  138 |   },
  139 | ];
  140 | 
  141 | for (const quantidade of [0, -1, 1.5]) {
  142 |   invalidos.push({
  143 |     nome: 'quantidade ' + quantidade,
  144 |     payload: { itens: [{ produtoId: 'P005', quantidade }] },
  145 |     codigo: 'QUANTIDADE_INVALIDA',
  146 |   });
  147 | }
  148 | 
  149 | for (const caso of invalidos) {
  150 |   test('API09: rejeitar ' + caso.nome, async ({ request }, testInfo) => {
  151 |     const result = await enviar(request, testInfo, '/api/carrinho/calcular', caso.payload);
  152 |     expect(result.status).toBe(422);
  153 |     expect(result.body.erro.codigo).toBe(caso.codigo);
  154 |   });
  155 | }
  156 | 
  157 | test('API10 CA10: aceitar cinco unidades', async ({ request }, testInfo) => {
  158 |   const result = await enviar(request, testInfo, '/api/carrinho/calcular', {
  159 |     itens: [{ produtoId: 'P005', quantidade: 5 }],
  160 |   });
  161 |   expect(result.status).toBe(200);
  162 |   expect(result.body).toMatchObject({
  163 |     subtotal: 500, desconto: 0, frete: 0, total: 500,
  164 |   });
  165 |   expect(result.body.itens[0].quantidade).toBe(5);
  166 | });
  167 | 
  168 | test('API11 CA10: pedido rejeita seis unidades', async ({ request }, testInfo) => {
  169 |   const result = await enviar(request, testInfo, '/api/pedidos', {
  170 |     cliente, itens: [{ produtoId: 'P005', quantidade: 6 }],
  171 |   });
> 172 |   expect(result.status).toBe(422);
      |                         ^ Error: expect(received).toBe(expected) // Object.is equality
  173 |   expect(result.body.erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  174 | });
  175 | 
  176 | for (const caso of [
  177 |   { nome: 'nome sem sobrenome', dados: { ...cliente, nome: 'Maria' } },
  178 |   { nome: 'email inválido', dados: { ...cliente, email: 'maria' } },
  179 |   { nome: 'CEP com sete dígitos', dados: { ...cliente, cep: '0131010' } },
  180 | ]) {
  181 |   test('API12: rejeitar ' + caso.nome, async ({ request }, testInfo) => {
  182 |     const result = await enviar(request, testInfo, '/api/pedidos', {
  183 |       cliente: caso.dados,
  184 |       itens: [{ produtoId: 'P005', quantidade: 1 }],
  185 |     });
  186 |     expect(result.status).toBe(422);
  187 |     expect(result.body.erro.codigo).toBe('DADOS_INVALIDOS');
  188 |   });
  189 | }
  190 | 
  191 | for (const cep of ['01310-100', '01310100']) {
  192 |   test('API13: confirmar pedido e comparar cálculo — CEP ' + cep, async ({ request }, testInfo) => {
  193 |     const payload = {
  194 |       itens: [{ produtoId: 'P005', quantidade: 1 }],
  195 |       cupom: 'BEMVINDO10',
  196 |     };
  197 |     const calculo = await enviar(request, testInfo, '/api/carrinho/calcular', payload);
  198 |     expect(calculo.status).toBe(200);
  199 | 
  200 |     const pedido = await enviar(request, testInfo, '/api/pedidos', {
  201 |       ...payload, cliente: { ...cliente, cep },
  202 |     });
  203 |     expect(pedido.status).toBe(201);
  204 |     expect(pedido.body.numero).toMatch(/^VZ-[0-9]{6}$/);
  205 |     expect(pedido.body.cliente).toMatchObject({
  206 |       nome: 'Maria Silva', email: 'maria@example.com', cep: '01310100',
  207 |     });
  208 |     expect(pedido.body).toMatchObject({
  209 |       subtotal: 100, desconto: 10, frete: 19.9,
  210 |       freteGratis: false, valorFaltanteFreteGratis: 100, total: 109.9,
  211 |     });
  212 | 
  213 |     for (const campo of [
  214 |       'subtotal', 'desconto', 'frete', 'freteGratis',
  215 |       'valorFaltanteFreteGratis', 'total', 'itens', 'cupom',
  216 |     ]) {
  217 |       expect(pedido.body[campo]).toEqual(calculo.body[campo]);
  218 |     }
  219 |   });
  220 | }
  221 | 
```