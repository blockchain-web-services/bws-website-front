import { test, expect } from '@playwright/test';

test.describe('Carousel Debug', () => {
  test('check carousel cards size and buttons', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to carousel
    await page.locator('.news-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Check if Swiper is loaded
    const swiperLoaded = await page.evaluate(() => {
      return typeof window.Swiper !== 'undefined';
    });
    console.log('Swiper loaded:', swiperLoaded);

    // Check carousel structure
    const carouselExists = await page.locator('.news-carousel.swiper').count();
    console.log('Carousel exists:', carouselExists > 0);

    const wrapperExists = await page.locator('.swiper-wrapper').count();
    console.log('Swiper wrapper exists:', wrapperExists > 0);

    const slideCount = await page.locator('.swiper-slide').count();
    console.log('Number of slides:', slideCount);

    // Check card sizes
    const cardSizes = await page.evaluate(() => {
      const cards = document.querySelectorAll('.announcement-box');
      return Array.from(cards).map(card => ({
        width: card.offsetWidth,
        computedWidth: window.getComputedStyle(card).width,
        maxWidth: window.getComputedStyle(card).maxWidth,
        minWidth: window.getComputedStyle(card).minWidth
      }));
    });

    console.log('Card sizes:', JSON.stringify(cardSizes, null, 2));

    // Check if any card exceeds 440px
    const exceedsMaxWidth = cardSizes.some(card => card.width > 440);
    console.log('Any card exceeds 440px?', exceedsMaxWidth);

    // Check navigation buttons (use .first() to avoid strict mode violation when multiple carousels exist)
    const nextButton = page.locator('.swiper-button-next').first();
    const prevButton = page.locator('.swiper-button-prev').first();

    const nextVisible = await nextButton.isVisible();
    const prevVisible = await prevButton.isVisible();

    console.log('Next button visible:', nextVisible);
    console.log('Prev button visible:', prevVisible);

    // Check button styles
    if (nextVisible) {
      const nextStyles = await nextButton.evaluate(el => ({
        display: window.getComputedStyle(el).display,
        opacity: window.getComputedStyle(el).opacity,
        cursor: window.getComputedStyle(el).cursor,
        pointerEvents: window.getComputedStyle(el).pointerEvents
      }));
      console.log('Next button styles:', nextStyles);
    }

    // Try clicking next button
    if (nextVisible) {
      console.log('Attempting to click next button...');
      try {
        await nextButton.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
        console.log('Next button clicked successfully');
      } catch (err) {
        console.log('Failed to click next button:', err.message);
      }
    }

    // Check if Swiper instance exists
    const swiperInstance = await page.evaluate(() => {
      const carousel = document.querySelector('.news-carousel');
      if (carousel && carousel.swiper) {
        return {
          exists: true,
          slides: carousel.swiper.slides.length,
          activeIndex: carousel.swiper.activeIndex,
          initialized: carousel.swiper.initialized
        };
      }
      return { exists: false };
    });
    console.log('Swiper instance:', JSON.stringify(swiperInstance, null, 2));

    // Take screenshot
    await page.screenshot({
      path: 'tests/tests/screenshots/carousel-debug-5500.png',
      fullPage: true
    });
  });

  test('check CSS files loaded', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if Swiper CSS is loaded
    const swiperCSSLoaded = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map(link => link.href).filter(href => href.includes('swiper'));
    });
    console.log('Swiper CSS files:', swiperCSSLoaded);

    // Check if partnerships.css is loaded
    const partnershipCSS = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map(link => link.href).filter(href => href.includes('partnerships'));
    });
    console.log('Partnership CSS files:', partnershipCSS);

    // Check all CSS files
    const allCSS = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map(link => link.href);
    });
    console.log('All CSS files loaded:', allCSS.length);
    allCSS.forEach(css => console.log('  -', css));
  });

  test('check JavaScript files loaded', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if Swiper JS is loaded
    const swiperJSLoaded = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.map(script => script.src).filter(src => src.includes('swiper'));
    });
    console.log('Swiper JS files:', swiperJSLoaded);

    // Check all JS files
    const allJS = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.map(script => script.src);
    });
    console.log('All JS files loaded:', allJS.length);
    allJS.forEach(js => console.log('  -', js));
  });
});
