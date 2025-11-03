import { test, expect } from '@playwright/test';

test.describe('Zapier Forms on Marketplace Pages', () => {
  // Only telegram-xbot has a working Zapier form with Contact Support tab visible
  // Other marketplace pages have w-condition-invisible on Contact Support tabs and empty page-id values
  const marketplacePages = [
    '/marketplace/telegram-xbot.html'
  ];

  for (const pagePath of marketplacePages) {
    test(`Zapier form loads on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);

      // Click on Contact Support tab to reveal Zapier form
      const supportTab = page.locator('a:has-text("Contact Support")');
      await supportTab.click();

      // Wait a bit for tab animation
      await page.waitForTimeout(500);

      // Verify Zapier script is loaded from CDN
      const zapierScript = page.locator('script[src*="interfaces.zapier.com"]');
      await expect(zapierScript).toHaveCount(1);

      // Verify the Zapier embed element exists
      const zapierEmbed = page.locator('zapier-interfaces-page-embed');
      await expect(zapierEmbed).toBeVisible();

      // Verify the embed has page-id attribute
      const pageId = await zapierEmbed.getAttribute('page-id');
      expect(pageId).toBeTruthy();
      expect(pageId.length).toBeGreaterThan(10);
    });
  }
});
