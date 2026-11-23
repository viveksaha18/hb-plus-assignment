const { test, expect } = require('@playwright/test');

test('missing session cannot access protected API', async ({ request }) => {
  const response = await request.get('http://localhost:4000/api/auth/me');
  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ error: 'Authentication required' });
});

test('invalid bearer session cannot access protected API', async ({ request }) => {
  const response = await request.get('http://localhost:4000/api/auth/me', {
    headers: { Authorization: 'Bearer invalid-runtime-test-token' },
  });
  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ error: 'Session expired or invalid' });
});

test('logout is safe without an active session', async ({ request }) => {
  const response = await request.post('http://localhost:4000/api/auth/logout');
  expect(response.status()).toBe(204);
});
