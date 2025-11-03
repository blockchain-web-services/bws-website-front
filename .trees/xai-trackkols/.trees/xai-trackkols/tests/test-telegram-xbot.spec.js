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

    // Click on Contact Support tab
    const supportTab = page.locator('a:has-text("Contact Support")');
    await supportTab.click();
    await page.waitForTimeout(500);

    // Verify Zapier form elements
    const zapierScript = page.locator('script[src*="interfaces.zapier.com"]');
    await expect(zapierScript).toHaveCount(1);

    const zapierEmbed = page.locator('zapier-interfaces-page-embed');
    await expect(zapierEmbed).toBeAttached();

    // Verify "Need support?" heading is visible
    const supportHeading = page.locator('h2:has-text("Need support?")');
    await expect(supportHeading).toBeVisible();

    // Verify install instructions link exists and points to correct URL
    const installLink = page.locator('a[href="https://xbot.ninja/install.html"]');
    await expect(installLink).toBeVisible();
    await expect(installLink).toContainText('X Bot install instructions');

    // Verify install link has target="_blank"
    const target = await installLink.getAttribute('target');
    expect(target).toBe('_blank');
  });
});
