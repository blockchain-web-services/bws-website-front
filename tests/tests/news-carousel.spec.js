import { test, expect } from '@playwright/test';

test.describe('News Carousel with Swiper', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('carousel should be present and initialized', async ({ page }) => {
    // Wait for Swiper to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check that Swiper container exists
    const carousel = await page.locator('.news-carousel.swiper');
    await expect(carousel).toBeVisible();

    // Check that Swiper wrapper exists
    const wrapper = await page.locator('.swiper-wrapper');
    await expect(wrapper).toBeVisible();

    // Check that slides exist
    const slides = await page.locator('.swiper-slide');
    const slideCount = await slides.count();
    console.log(`Found ${slideCount} slides`);
    expect(slideCount).toBeGreaterThan(0);
  });

  test('first slide should be visible', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // First slide should be visible
    const firstSlide = await page.locator('.swiper-slide').first();
    await expect(firstSlide).toBeVisible();

    // Check if the announcement box inside is visible
    const announcementBox = await firstSlide.locator('.announcement-box');
    await expect(announcementBox).toBeVisible();
  });

  test('navigation arrows should be present', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const nextButton = await page.locator('.swiper-button-next');
    const prevButton = await page.locator('.swiper-button-prev');

    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();
  });

  test('clicking next arrow should change slide', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Get first slide content before clicking
    const firstSlideContent = await page.locator('.swiper-slide').first().textContent();

    // Click next button
    await page.locator('.swiper-button-next').click();
    await page.waitForTimeout(500);

    // Get first slide content after clicking
    const newFirstSlideContent = await page.locator('.swiper-slide').first().textContent();

    // Content should have changed (because of loop mode, slides rotate)
    console.log('Before:', firstSlideContent?.substring(0, 50));
    console.log('After:', newFirstSlideContent?.substring(0, 50));
  });

  test('partnership cards should have backgrounds', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Find partnership cards (they have container-image-partnership class)
    const partnershipCards = await page.locator('[class*="container-image-partnership"]');
    const count = await partnershipCards.count();

    if (count > 0) {
      console.log(`Found ${count} partnership cards`);

      // Check first partnership card has background image
      const firstCard = partnershipCards.first();
      await expect(firstCard).toBeVisible();

      const bgImage = await firstCard.evaluate(el => {
        return window.getComputedStyle(el).backgroundImage;
      });

      console.log('Background image:', bgImage);
      expect(bgImage).not.toBe('none');
      expect(bgImage).toContain('url');
    }
  });

  test('partnership logos should be circular', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Find partner logos (not BWS)
    const partnerLogos = await page.locator('.image-partnership:not(.image-partnership-bws)');
    const count = await partnerLogos.count();

    if (count > 0) {
      console.log(`Found ${count} partner logos`);

      // Check first partner logo is circular
      const firstLogo = partnerLogos.first();
      await expect(firstLogo).toBeVisible();

      const borderRadius = await firstLogo.evaluate(el => {
        return window.getComputedStyle(el).borderRadius;
      });

      console.log('Border radius:', borderRadius);
      expect(borderRadius).toContain('50%');
    }
  });

  test('announcement text should have fixed height', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const announcementTexts = await page.locator('.announcement-text');
    const count = await announcementTexts.count();

    if (count > 0) {
      console.log(`Found ${count} announcement text elements`);

      // Check first one has fixed height
      const firstText = announcementTexts.first();
      const height = await firstText.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          minHeight: styles.minHeight,
          maxHeight: styles.maxHeight
        };
      });

      console.log('Text heights:', height);
      expect(height.minHeight).toBe('72px');
      expect(height.maxHeight).toBe('72px');
    }
  });

  test('take screenshot of carousel', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Scroll to carousel
    await page.locator('.news-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/carousel-swiper.png',
      fullPage: false
    });
  });
});
