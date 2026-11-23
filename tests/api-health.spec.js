const { test, expect } = require('@playwright/test');

test('backend health and database connectivity', async ({ request }) => {
  const response = await request.get('http://localhost:4000/api/health');
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    status: 'ok',
    database: 'connected',
  });
});

test('CORS allows the local web origin', async ({ request }) => {
  const response = await request.fetch('http://localhost:4000/api/auth/me', {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:8081',
      'Access-Control-Request-Method': 'GET',
    },
  });
  expect(response.status()).toBe(204);
  expect(response.headers()['access-control-allow-origin']).toBe('http://localhost:8081');
});
