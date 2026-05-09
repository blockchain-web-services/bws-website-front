import { test, expect } from '@playwright/test';

test.describe('Telegram X Bot Page', () => {
  test('All features work correctly', async ({ page }) => {
    await page.goto('/marketplace/telegram-xbot.html');

    // Verify page loads
    await expect(page.locator('h1')).toContainText('Telegram X Bot');

    // Verify Solution Website button is visible and points to correct URL
    const solutionWebsiteLink = page.locator('a:has-text("Solution Website")').first();
    await expect(solutionWebsiteLink).toBeVisible();
    const href = await solutionWebsiteLink.getAttribute('href');
    expect(href).toBe('https://xbot.ninja');
  });
});
