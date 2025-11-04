import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.goto('http://localhost:5500/index.html');
  await page.waitForTimeout(3000);

  // Scroll to the marketplace section
  const carousel = await page.locator('.success-stories-carousel').first();
  await carousel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Take screenshot of just the carousel area
  await carousel.screenshot({ path: '/tmp/carousel-section.png' });

  await browser.close();
  console.log('Screenshot saved to /tmp/carousel-section.png');
})();
