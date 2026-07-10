import { test, expect } from '@playwright/test';

// This is deliberately one test of the critical path, not a coverage sweep —
// per the handbook: "an e2e test of the critical path, not coverage theatre."
// Requires the seeded demo account (see backend/prisma/seed.ts) and both the
// frontend and backend running locally.

test('agent logs in, creates a ticket, and sees it in the list', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('demo@demo.com');
  await page.getByLabel('Password').fill('Demo1234!');
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.getByRole('link', { name: 'Tickets' }).click();
  await expect(page).toHaveURL(/\/tickets$/);

  await page.getByRole('button', { name: 'New ticket' }).click();

  const subject = `E2E test ticket ${Date.now()}`;
  await page.getByLabel('Subject').fill(subject);
  await page.getByLabel('Description').fill('Created by the Playwright critical-path test.');

  const customerSelect = page.locator('#customerId');
  const optionCount = await customerSelect.locator('option').count();
  if (optionCount <= 1) {
    // No customers seeded yet in this environment — create one inline.
    await page.getByRole('button', { name: '+ New customer' }).click();
    await page.getByPlaceholder('Name').fill('E2E Test Customer');
    await page.getByPlaceholder('Email').fill(`e2e-${Date.now()}@example.test`);
    await page.getByRole('button', { name: 'Save customer' }).click();
  } else {
    await customerSelect.selectOption({ index: 1 });
  }

  await page.getByRole('button', { name: 'Create ticket' }).click();

  await expect(page.getByText(subject)).toBeVisible({ timeout: 10_000 });
});
