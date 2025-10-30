import { test, expect } from '@playwright/test';

test.describe('Live Site - Company Menu News', () => {
  test('Company menu displays 4 news items with titles and descriptions', async ({ page }) => {
    // Visit the live site
    await page.goto('https://www.bws.ninja');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Hover over Company menu to show dropdown
    const companyMenu = page.locator('.nav-link-dropdown-text:has-text("Company")').first();
    await companyMenu.hover();

    // Wait for dropdown to appear
    await page.waitForTimeout(500);

    // Check that news section exists
    const newsSection = page.locator('.top-menu-articles-title:has-text("BWS News")');
    await expect(newsSection).toBeVisible();

    // Get all news items specifically within the Company dropdown (BWS News section)
    const newsItems = page.locator('.top-menu-articles-title:has-text("BWS News")').locator('xpath=../..').locator('.top-menu-article-link');

    // Should have exactly 4 news items
    await expect(newsItems).toHaveCount(4);

    // Verify each news item has title and description
    for (let i = 0; i < 4; i++) {
      const newsItem = newsItems.nth(i);

      // Check title exists and has content
      const title = newsItem.locator('.top-menu-article-title');
      await expect(title).toBeVisible();
      const titleText = await title.textContent();
      expect(titleText.trim().length).toBeGreaterThan(0);

      // Check description exists and has content
      const description = newsItem.locator('.top-menu-article-description');
      await expect(description).toBeVisible();
      const descText = await description.textContent();
      expect(descText.trim().length).toBeGreaterThan(20); // Descriptions should be substantial

      console.log(`✓ News ${i + 1}: "${titleText.trim()}"`);
      console.log(`  Description: "${descText.trim().substring(0, 60)}..."`);
    }

    // Verify expected news items are present (based on news.ts data)
    const expectedTitles = [
      'Quick Sync',
      'Rouge Studio',
      'Matchain',
      '$BWS Token Launch Success!'
    ];

    for (const title of expectedTitles) {
      const newsItem = page.locator(`.top-menu-article-title:has-text("${title}")`);
      await expect(newsItem).toBeVisible();
    }

    // Verify news items are clickable links
    const firstNewsLink = newsItems.first();
    const href = await firstNewsLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toContain('https://');

    console.log('✅ All news items verified successfully');
  });

  test('News items have proper styling', async ({ page }) => {
    await page.goto('https://www.bws.ninja');
    await page.waitForLoadState('networkidle');

    // Hover over Company menu
    const companyMenu = page.locator('.nav-link-dropdown-text:has-text("Company")').first();
    await companyMenu.hover();
    await page.waitForTimeout(500);

    // Check first news item styling (specifically within BWS News section)
    const firstNewsItem = page.locator('.top-menu-articles-title:has-text("BWS News")').locator('xpath=../..').locator('.top-menu-article-link').first();
    const title = firstNewsItem.locator('.top-menu-article-title');
    const description = firstNewsItem.locator('.top-menu-article-description');

    // Verify title styling
    const titleFontWeight = await title.evaluate(el =>
      window.getComputedStyle(el).fontWeight
    );
    expect(parseInt(titleFontWeight)).toBeGreaterThanOrEqual(600); // Bold

    // Verify description styling
    const descriptionFontSize = await description.evaluate(el =>
      window.getComputedStyle(el).fontSize
    );
    const descriptionOpacity = await description.evaluate(el =>
      window.getComputedStyle(el).opacity
    );

    expect(parseFloat(descriptionFontSize)).toBeLessThan(16); // Smaller than title
    expect(parseFloat(descriptionOpacity)).toBeLessThan(1); // Semi-transparent

    console.log('✅ News styling verified');
  });
});
