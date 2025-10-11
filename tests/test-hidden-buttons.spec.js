import { test, expect } from '@playwright/test';

test.describe('Hidden Buttons with w-condition-invisible', () => {
  test('database-immutable Solution Website button should be hidden', async ({ page }) => {
    await page.goto('/marketplace/database-immutable.html');

    // Find the Solution Website button with w-condition-invisible class
    const hiddenButton = page.locator('a.w-condition-invisible:has-text("Solution Website")');

    // Should exist in DOM but not be visible
    await expect(hiddenButton).toHaveCount(1);
    await expect(hiddenButton).not.toBeVisible();
  });

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
