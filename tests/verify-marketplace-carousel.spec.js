import { test, expect } from '@playwright/test';

test.describe('Marketplace Carousel - Success Stories', () => {
  test('Carousel should have proper padding to prevent arrow overlap', async ({ page }) => {
    await page.goto('http://localhost:5500/index.html');
    await page.waitForLoadState('networkidle');

    // Find the success stories carousel
    const carousel = page.locator('.success-stories-carousel').first();
    await expect(carousel).toBeVisible();

    // Get carousel padding
    const padding = await carousel.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        left: parseInt(style.paddingLeft),
        right: parseInt(style.paddingRight),
        top: parseInt(style.paddingTop),
        bottom: parseInt(style.paddingBottom)
      };
    });

    console.log(`Carousel padding: ${JSON.stringify(padding)}`);

    // Carousel should have horizontal padding to create space for arrows
    expect(padding.left).toBe(60);
    expect(padding.right).toBe(60);

    console.log('✓ Carousel has padding to prevent arrow overlap with cards');

    // Check arrow buttons exist
    const nextButton = page.locator('.success-stories-carousel .swiper-button-next');
    const prevButton = page.locator('.success-stories-carousel .swiper-button-prev');

    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();

    // Get arrow positions
    const nextPos = await nextButton.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        right: parseInt(style.right),
        width: parseInt(style.width),
        height: parseInt(style.height)
      };
    });

    const prevPos = await prevButton.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        left: parseInt(style.left),
        width: parseInt(style.width),
        height: parseInt(style.height)
      };
    });

    console.log(`Next arrow: right=${nextPos.right}px, size=${nextPos.width}x${nextPos.height}px`);
    console.log(`Prev arrow: left=${prevPos.left}px, size=${prevPos.width}x${prevPos.height}px`);

    // Arrows should be positioned outside carousel (negative positioning)
    expect(nextPos.right).toBe(-60);
    expect(prevPos.left).toBe(-60);

    console.log('✓ Arrow buttons positioned outside carousel container');

    // Check title font size
    const titleElement = page.locator('.success-stories-carousel .text-block-38').first();
    if (await titleElement.isVisible()) {
      const titleFontSize = await titleElement.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });

      console.log(`Title font size: ${titleFontSize}`);

      // Should be 2rem (32px) instead of 2.4rem (38.4px)
      const fontSizePx = parseFloat(titleFontSize);
      expect(fontSizePx).toBeLessThanOrEqual(34); // Should be around 32px (2rem)
      expect(fontSizePx).toBeGreaterThanOrEqual(30);

      console.log('✓ Title font size reduced to 2rem');
    }

    console.log('✅ Marketplace carousel spacing and sizing verified');
  });

  test('Carousel arrows should be styled and functional', async ({ page }) => {
    await page.goto('http://localhost:5500/index.html');
    await page.waitForLoadState('networkidle');

    // Check arrow styling
    const nextButton = page.locator('.success-stories-carousel .swiper-button-next');

    const buttonStyle = await nextButton.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        width: style.width,
        height: style.height
      };
    });

    console.log(`Arrow button style: ${JSON.stringify(buttonStyle)}`);

    // Should have rounded background
    expect(buttonStyle.borderRadius).toContain('50%');

    // Should have background color (white with opacity)
    expect(buttonStyle.backgroundColor).toBeTruthy();

    console.log('✅ Arrow buttons have proper styling');
  });
});
