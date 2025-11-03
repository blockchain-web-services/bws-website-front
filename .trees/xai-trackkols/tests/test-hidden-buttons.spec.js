import { test, expect } from '@playwright/test';

test.describe('Solution Website Buttons on Marketplace Pages', () => {
  // Only test pages that have Solution Website buttons
  // Not all marketplace pages require this button

  test('telegram-xbot Solution Website button should be visible', async ({ page }) => {
    await page.goto('/marketplace/telegram-xbot.html');

    // Find the Solution Website button WITHOUT w-condition-invisible class
    const visibleButton = page.locator('a:has-text("Solution Website")').first();

    // Should be visible
    await expect(visibleButton).toBeVisible();

    // Verify it doesn't have w-condition-invisible class
    const classes = await visibleButton.getAttribute('class');
    expect(classes).not.toContain('w-condition-invisible');
  });
});
