const { test, expect } = require('@playwright/test');

test('web app initializes and exposes the sign-in screen', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(page.getByText('Authorized domain: @hbplus.fit')).toBeVisible();
});

test('unauthenticated dashboard does not show account data', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(page.getByText('ACCOUNT OVERVIEW')).toHaveCount(0);
});
