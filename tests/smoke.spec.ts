import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Vibecheck/);
});

test('can perform search', async ({ page }) => {
  await page.goto('/');
  const input = page.getByPlaceholder(/Enter a subreddit/i);
  await input.fill('nextjs');
  
  const searchButton = page.getByRole('button', { name: /Analyze/i });
  await searchButton.click();
  
  // Wait for result or error, just ensure the app doesn't crash
  await expect(page.locator('text=Subreddit Overview').or(page.locator('text=Error'))).toBeVisible({ timeout: 15000 });
});
