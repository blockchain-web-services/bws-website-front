import { test, expect } from '@playwright/test';

test('Inspect live site navigation structure', async ({ page }) => {
  await page.goto('https://www.bws.ninja');
  await page.waitForLoadState('networkidle');

  // Take a screenshot of the page
  await page.screenshot({ path: 'test-results/live-site-homepage.png', fullPage: true });

  // Get all links in navigation
  const navLinks = await page.locator('nav a, .navigation a, .nav a, .menu a, [class*="nav"] a, [class*="menu"] a').all();

  console.log(`Found ${navLinks.length} navigation links:`);

  for (const link of navLinks) {
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    const classes = await link.getAttribute('class');
    console.log(`- "${text?.trim()}" | href: ${href} | class: ${classes}`);
  }

  // Look for Company menu specifically
  const companyLinks = await page.locator('a:has-text("Company")').all();
  console.log(`\nFound ${companyLinks.length} links with "Company" text:`);
  for (const link of companyLinks) {
    const text = await link.textContent();
    const classes = await link.getAttribute('class');
    console.log(`- "${text?.trim()}" | class: ${classes}`);
  }

  // Look for top menu links
  const topMenuLinks = await page.locator('[class*="top-menu"]').all();
  console.log(`\nFound ${topMenuLinks.length} elements with "top-menu" in class:`);
  for (const el of topMenuLinks.slice(0, 10)) {
    const tag = await el.evaluate(el => el.tagName);
    const classes = await el.getAttribute('class');
    const text = await el.textContent();
    console.log(`- <${tag}> class: ${classes} | text: "${text?.trim().substring(0, 50)}"`);
  }
});
