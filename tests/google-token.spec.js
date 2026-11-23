const { test, expect } = require('@playwright/test');

test('invalid Google ID token is rejected', async ({ request }) => {
  const response = await request.post('http://localhost:4000/api/auth/google', {
    data: { idToken: 'invalid-runtime-test-token' },
  });
  expect(response.status()).toBe(401);
  expect(await response.json()).toMatchObject({ error: expect.any(String) });
});

test('missing Google ID token is rejected', async ({ request }) => {
  const response = await request.post('http://localhost:4000/api/auth/google', {
    data: {},
  });
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: 'Google ID token is required' });
});
