import { test, expect } from '@playwright/test';

test('Find Company menu structure', async ({ page }) => {
  await page.goto('https://www.bws.ninja');
  await page.waitForLoadState('networkidle');

  // Search for elements containing the news items we know are there
  const quickSyncLink = page.locator('a:has-text("Quick Sync")');
  await expect(quickSyncLink).toBeVisible();

  // Get the parent structure
  const parent1 = quickSyncLink.locator('xpath=..');
  const parent2 = parent1.locator('xpath=..');
  const parent3 = parent2.locator('xpath=..');
  const parent4 = parent3.locator('xpath=..');
  const parent5 = parent4.locator('xpath=..');

  console.log('\n=== Quick Sync link ancestry ===');
  console.log('Link class:', await quickSyncLink.getAttribute('class'));
  console.log('Parent 1:', await parent1.evaluate(el => `<${el.tagName}> class: ${el.className}`));
  console.log('Parent 2:', await parent2.evaluate(el => `<${el.tagName}> class: ${el.className}`));
  console.log('Parent 3:', await parent3.evaluate(el => `<${el.tagName}> class: ${el.className}`));
  console.log('Parent 4:', await parent4.evaluate(el => `<${el.tagName}> class: ${el.className}`));
  console.log('Parent 5:', await parent5.evaluate(el => `<${el.tagName}> class: ${el.className}`));

  // Look for menu trigger near the news items
  const menuWrapper = parent5;
  const menuText = await menuWrapper.evaluate(el => {
    // Find the clickable element that triggers this dropdown
    const trigger = el.querySelector('.top-menu-link, [class*="menu-link"]');
    return trigger ? trigger.textContent.trim() : 'NOT FOUND';
  });

  console.log('\nMenu trigger text:', menuText);

  // Get all top-menu-link elements
  const topMenuLinks = await page.locator('.top-menu-link').all();
  console.log(`\n=== Found ${topMenuLinks.length} .top-menu-link elements ===`);
  for (const link of topMenuLinks) {
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    console.log(`- "${text?.trim()}" | href: ${href}`);
  }

  // Check if news section has a title
  const newsTitle = page.locator('.top-menu-articles-title:has-text("BWS News")');
  const newsTitleVisible = await newsTitle.isVisible();
  console.log('\n=== BWS News title ===');
  console.log('BWS News title visible:', newsTitleVisible);

  if (newsTitleVisible) {
    const newsTitleParent = newsTitle.locator('xpath=../../../..');
    const menuContext = await newsTitleParent.evaluate(el => {
      // Find the menu link that controls this dropdown
      const menu = el.closest('[class*="top-menu"]');
      const trigger = menu?.querySelector('.top-menu-link');
      return {
        menuClass: menu?.className || 'NOT FOUND',
        triggerText: trigger?.textContent?.trim() || 'NOT FOUND'
      };
    });
    console.log('News section parent menu class:', menuContext.menuClass);
    console.log('News section trigger text:', menuContext.triggerText);
  }

  await page.screenshot({ path: 'test-results/company-menu-location.png', fullPage: true });
});
