import { test, expect } from '@playwright/test';

test.describe('Verify fixes on live site www.bws.ninja', () => {
  test('Footer logo uses logo.svg', async ({ page }) => {
    await page.goto('https://www.bws.ninja/');
    await page.waitForLoadState('networkidle');

    const footerLogo = page.locator('footer img').first();
    const src = await footerLogo.getAttribute('src');

    console.log('\n=== FOOTER LOGO VERIFICATION ===');
    console.log('Footer logo src:', src);
    console.log('Expected: /assets/images/logo.svg');
    console.log('Match:', src === '/assets/images/logo.svg');

    expect(src).toBe('/assets/images/logo.svg');
  });

  test('News carousel has NO navigation arrows', async ({ page }) => {
    await page.goto('https://www.bws.ninja/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Swiper to initialize

    // Check for Swiper navigation arrows
    const prevButton = page.locator('.swiper-button-prev');
    const nextButton = page.locator('.swiper-button-next');

    const prevCount = await prevButton.count();
    const nextCount = await nextButton.count();

    console.log('\n=== CAROUSEL ARROWS VERIFICATION ===');
    console.log('Left arrow count:', prevCount);
    console.log('Right arrow count:', nextCount);
    console.log('Expected: Both should be 0');
    console.log('Match:', prevCount === 0 && nextCount === 0);

    expect(prevCount).toBe(0);
    expect(nextCount).toBe(0);
  });
});
