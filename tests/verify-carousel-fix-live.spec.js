import { test, expect } from '@playwright/test';

test.describe('Verify carousel arrow fix on live site', () => {
  test('News carousel should have NO navigation arrows', async ({ page }) => {
    await page.goto('https://www.bws.ninja/');

    // Wait for carousel to load
    await page.waitForSelector('.news-carousel', { timeout: 10000 });

    // Check for Swiper navigation arrows
    const prevButtons = await page.locator('.swiper-button-prev').count();
    const nextButtons = await page.locator('.swiper-button-next').count();

    console.log(`Live site - Left arrows: ${prevButtons}, Right arrows: ${nextButtons}`);

    expect(prevButtons).toBe(0);
    expect(nextButtons).toBe(0);
  });

  test('Footer logo should use logo.svg', async ({ page }) => {
    await page.goto('https://www.bws.ninja/');

    const footerLogo = page.locator('footer img.image-logo-footer').first();
    const src = await footerLogo.getAttribute('src');

    console.log(`Footer logo src: ${src}`);

    expect(src).toBe('/assets/images/logo.svg');
  });
});
