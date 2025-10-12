import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:4321');
  await page.waitForTimeout(2000); // Wait for carousel to initialize

  // Find the carousel section and screenshot it
  const carousel = await page.locator('#news-carousel');
  await carousel.screenshot({ path: '../carousel-section.png' });

  console.log('Carousel screenshot saved to carousel-section.png');

  await browser.close();
})();
