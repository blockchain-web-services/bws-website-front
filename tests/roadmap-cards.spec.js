import { test, expect } from '@playwright/test';

test.describe('Roadmap Card Text Visibility', () => {
  test('Gray card Q2 2025 title should be visible with dark text on white', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find Q2'2025 gray card title
    const q2Title = page.locator('.container-head-roadmap-25-2nd .text-roadmap-title-4th').first();
    await expect(q2Title).toBeVisible();

    // Get computed styles
    const color = await q2Title.evaluate(el => window.getComputedStyle(el).color);
    const backgroundColor = await q2Title.evaluate(el => window.getComputedStyle(el).backgroundColor);

    console.log('Q2 2025 Title:');
    console.log('  Text color:', color);
    console.log('  Background color:', backgroundColor);

    // Check that text is dark for high contrast (#1a1b1e)
    // rgb(26, 27, 30) = #1a1b1e
    expect(color).toBe('rgb(26, 27, 30)');

    // Background should be white
    expect(backgroundColor).toBe('rgb(255, 255, 255)');
  });

  test('Q1 2025 rose card title should be visible with rose text on white', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const q1Title = page.locator('.container-head-roadmap-25-1st .text-roadmap-title-2025-q1').first();
    await expect(q1Title).toBeVisible();

    const color = await q1Title.evaluate(el => window.getComputedStyle(el).color);
    const backgroundColor = await q1Title.evaluate(el => window.getComputedStyle(el).backgroundColor);

    console.log('Q1 2025 Title:');
    console.log('  Text color:', color);
    console.log('  Background color:', backgroundColor);

    // Check that text is rose (#c41841)
    // rgb(196, 24, 65) = #c41841
    expect(color).toBe('rgb(196, 24, 65)');

    // Background should be white
    expect(backgroundColor).toBe('rgb(255, 255, 255)');
  });

  test('Q3 2025 dark card title should be visible with dark text on white', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const q3Title = page.locator('.container-head-roadmap .text-roadmap-title').first();
    await expect(q3Title).toBeVisible();

    const color = await q3Title.evaluate(el => window.getComputedStyle(el).color);
    const backgroundColor = await q3Title.evaluate(el => window.getComputedStyle(el).backgroundColor);

    console.log('Q3 2025 Title:');
    console.log('  Text color:', color);
    console.log('  Background color:', backgroundColor);

    // Check that text is dark (#1a1b1e)
    // rgb(26, 27, 30) = #1a1b1e
    expect(color).toBe('rgb(26, 27, 30)');

    // Background should be white
    expect(backgroundColor).toBe('rgb(255, 255, 255)');
  });

  test('Visual snapshot of entire roadmap section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to roadmap section
    const roadmapSection = page.locator('.roadmap-section').first();
    await roadmapSection.scrollIntoViewIfNeeded();

    // Wait a moment for any animations
    await page.waitForTimeout(500);

    // Take a screenshot of the roadmap section
    await expect(roadmapSection).toHaveScreenshot('roadmap-section.png');
  });
});
