import { test, expect } from '@playwright/test';

test.describe('Dropdown CSS Hover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('dropdowns should be visible on CSS hover', async ({ page }) => {
    // Test each dropdown menu
    const dropdownMenus = [
      { name: 'Solutions', selector: '.nav-link-dropdown:has-text("Solutions")' },
      { name: 'Build With Us', selector: '.nav-link-dropdown:has-text("Build With Us")' },
      { name: 'Resources', selector: '.nav-link-dropdown:has-text("Resources")' },
      { name: 'Company', selector: '.nav-link-dropdown:has-text("Company")' }
    ];

    for (const menu of dropdownMenus) {
      console.log(`Testing ${menu.name} dropdown...`);

      const dropdown = page.locator(menu.selector).first();
      const toggle = dropdown.locator('.w-dropdown-toggle').first();
      const list = dropdown.locator('.w-dropdown-list').first();

      // Verify toggle is visible
      await expect(toggle).toBeVisible();

      // Hover over the dropdown
      await dropdown.hover();
      await page.waitForTimeout(200);

      // Check if dropdown list is visible after hover
      const isVisible = await list.isVisible();
      console.log(`  ${menu.name} dropdown list visible: ${isVisible}`);

      // Get computed display property
      const display = await list.evaluate(el => window.getComputedStyle(el).display);
      console.log(`  ${menu.name} dropdown list display: ${display}`);

      // Assert the dropdown should be visible
      expect(isVisible).toBeTruthy();
      expect(display).not.toBe('none');
    }
  });
});
