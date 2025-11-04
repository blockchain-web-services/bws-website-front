import { test, expect } from '@playwright/test';

test.describe('Local Build - Company Menu News', () => {
  test('Company menu news items should not show HTML tags as text', async ({ page }) => {
    // Visit the local site
    await page.goto('http://localhost:5500/index.html');

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

    // Get all news items descriptions
    const descriptions = page.locator('.top-menu-article-description');
    const count = await descriptions.count();

    console.log(`Found ${count} news descriptions`);

    // Check each description
    for (let i = 0; i < count; i++) {
      const description = descriptions.nth(i);
      const text = await description.textContent();
      const html = await description.innerHTML();

      // Should NOT contain escaped HTML entities
      expect(text).not.toContain('&lt;span');
      expect(text).not.toContain('&gt;');
      expect(text).not.toContain('&quot;');
      expect(text).not.toContain('<span class="partner-name">');

      // HTML should contain actual span tags
      expect(html).toContain('<span class="partner-name">');

      console.log(`✓ Description ${i + 1}: No escaped HTML found`);
    }

    // Check that partner names are styled (have the span with class)
    const partnerNameSpans = page.locator('.top-menu-article-description .partner-name');
    const spanCount = await partnerNameSpans.count();

    expect(spanCount).toBeGreaterThan(0);
    console.log(`✓ Found ${spanCount} properly styled partner names`);

    // Verify specific partner names are present and properly rendered
    const expectedPartners = ['Agentify', 'Quick Sync', 'Rouge Studio', 'Matchain'];

    for (const partner of expectedPartners) {
      const partnerSpan = page.locator(`.top-menu-article-description .partner-name:has-text("${partner}")`);
      await expect(partnerSpan).toBeVisible();

      // Check that the span has the correct styling class
      const className = await partnerSpan.getAttribute('class');
      expect(className).toBe('partner-name');

      console.log(`✓ Partner "${partner}" properly styled`);
    }

    console.log('✅ All news items verified - HTML tags rendering correctly');
  });

  test('Partner names should have rose color styling', async ({ page }) => {
    await page.goto('http://localhost:5500/index.html');
    await page.waitForLoadState('networkidle');

    // Hover over Company menu
    const companyMenu = page.locator('.nav-link-dropdown-text:has-text("Company")').first();
    await companyMenu.hover();
    await page.waitForTimeout(500);

    // Check first partner name styling
    const firstPartnerName = page.locator('.top-menu-article-description .partner-name').first();
    await expect(firstPartnerName).toBeVisible();

    // Get computed style (should have rose color from CSS)
    const color = await firstPartnerName.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.color;
    });

    console.log(`Partner name color: ${color}`);
    // Rose color should be set (not default black)
    expect(color).not.toBe('rgb(0, 0, 0)');

    console.log('✅ Partner name styling verified');
  });
});
