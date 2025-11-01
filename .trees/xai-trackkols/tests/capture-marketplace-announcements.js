import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('📱 Navigating to http://localhost:5500/index.html');
  await page.goto('http://localhost:5500/index.html', { waitUntil: 'networkidle' });

  // Wait for carousel to be visible
  await page.waitForSelector('.marketplace-announcement-carousel', { timeout: 10000 });

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots', 'marketplace-announcements');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('📸 Taking screenshots of marketplace announcements...\n');

  // Get all slides
  const slides = await page.locator('.swiper-slide').count();
  console.log(`Found ${slides} announcement slides\n`);

  // Capture each slide
  for (let i = 0; i < slides; i++) {
    console.log(`Capturing slide ${i + 1}/${slides}...`);

    // Navigate to slide
    if (i > 0) {
      await page.click('.swiper-button-next');
      await page.waitForTimeout(500); // Wait for transition
    }

    // Get product name for filename
    const productName = await page.locator('.swiper-slide-active .text-block-38').textContent();
    const filename = `slide-${i + 1}-${productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`;

    // Capture the active slide
    const carousel = page.locator('.marketplace-announcement-carousel');
    await carousel.screenshot({
      path: path.join(screenshotsDir, filename),
      animations: 'disabled'
    });

    console.log(`  ✓ Saved: ${filename}`);

    // Also capture just the announcement card for detailed view
    const cardFilename = `card-${i + 1}-${productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`;
    const card = page.locator('.swiper-slide-active .flex-ngc-announcement');
    await card.screenshot({
      path: path.join(screenshotsDir, cardFilename),
      animations: 'disabled'
    });

    console.log(`  ✓ Saved: ${cardFilename}\n`);
  }

  console.log(`\n✅ All screenshots saved to: ${screenshotsDir}`);

  await browser.close();
})();
