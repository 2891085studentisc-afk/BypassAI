import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  // This checks if your site actually loaded
  await expect(page).toHaveTitle(/./); 
});