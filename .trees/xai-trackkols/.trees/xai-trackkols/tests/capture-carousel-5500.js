import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('Navigating to page...');
  await page.goto('http://localhost:5500/index.html', { waitUntil: 'networkidle', timeout: 30000 });

  console.log('Waiting for carousel element...');
  // Wait for Splide to be loaded
  await page.waitForSelector('#news-carousel .splide__slide', { timeout: 10000 });

  console.log('Waiting for Splide initialization...');
  // Wait for Splide to fully initialize (check if it has the is-initialized class)
  await page.waitForFunction(() => {
    const carousel = document.querySelector('#news-carousel');
    return carousel && carousel.classList.contains('is-initialized');
  }, { timeout: 10000 });

  // Additional wait for any animations/transitions to complete
  await page.waitForTimeout(2000);

  console.log('Capturing screenshot...');
  // Screenshot just the carousel
  const carousel = await page.locator('#news-carousel');
  await carousel.screenshot({ path: '../carousel-fixed.png' });

  console.log('Carousel screenshot saved to carousel-fixed.png');

  await browser.close();
})();
