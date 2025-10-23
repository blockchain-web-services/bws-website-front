import { test, expect } from '@playwright/test';

test.describe('Detailed Comparison of Local vs Published', () => {
  test('Detailed footer logo investigation', async ({ page }) => {
    console.log('\n========================================');
    console.log('TESTING LOCAL VERSION (localhost:4321)');
    console.log('========================================');

    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');

    // Check footer logo
    const localFooterLogo = page.locator('footer img').first();
    const localSrc = await localFooterLogo.getAttribute('src');
    const localClass = await localFooterLogo.getAttribute('class');
    const localVisible = await localFooterLogo.isVisible();

    console.log('\nLocal Footer Logo:');
    console.log('  src:', localSrc);
    console.log('  class:', localClass);
    console.log('  visible:', localVisible);

    // Check if logo.svg exists locally
    const logoSvgExists = await page.request.get('http://localhost:4321/assets/images/logo.svg');
    console.log('\nlogo.svg status:', logoSvgExists.status());

    console.log('\n========================================');
    console.log('TESTING PUBLISHED VERSION (www.bws.ninja)');
    console.log('========================================');

    await page.goto('https://www.bws.ninja/');
    await page.waitForLoadState('networkidle');

    // Check footer logo
    const publishedFooterLogo = page.locator('footer img').first();
    const publishedSrc = await publishedFooterLogo.getAttribute('src');
    const publishedClass = await publishedFooterLogo.getAttribute('class');
    const publishedVisible = await publishedFooterLogo.isVisible();

    console.log('\nPublished Footer Logo:');
    console.log('  src:', publishedSrc);
    console.log('  class:', publishedClass);
    console.log('  visible:', publishedVisible);

    // Check if logo.svg exists on published
    const publishedLogoSvgExists = await page.request.get('https://www.bws.ninja/assets/images/logo.svg');
    console.log('\nPublished logo.svg status:', publishedLogoSvgExists.status());

    console.log('\n========================================');
    console.log('COMPARISON SUMMARY');
    console.log('========================================');
    console.log('Local uses:', localSrc);
    console.log('Published uses:', publishedSrc);
    console.log('Are they different?', localSrc !== publishedSrc);
  });

  test('Detailed carousel arrows investigation', async ({ page }) => {
    console.log('\n========================================');
    console.log('CAROUSEL TESTING - LOCAL (localhost:4321)');
    console.log('========================================');

    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Swiper to initialize

    // Check for Swiper arrows
    const localPrevButton = page.locator('.swiper-button-prev');
    const localNextButton = page.locator('.swiper-button-next');

    const localPrevCount = await localPrevButton.count();
    const localNextCount = await localNextButton.count();

    console.log('\nLocal Swiper Arrows:');
    console.log('  .swiper-button-prev count:', localPrevCount);
    console.log('  .swiper-button-next count:', localNextCount);

    if (localPrevCount > 0) {
      const prevVisible = await localPrevButton.first().isVisible();
      const prevStyles = await localPrevButton.first().evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          left: styles.left,
          position: styles.position
        };
      });
      console.log('  Left arrow visible:', prevVisible);
      console.log('  Left arrow styles:', prevStyles);
    }

    if (localNextCount > 0) {
      const nextVisible = await localNextButton.first().isVisible();
      const nextStyles = await localNextButton.first().evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          right: styles.right,
          position: styles.position
        };
      });
      console.log('  Right arrow visible:', nextVisible);
      console.log('  Right arrow styles:', nextStyles);
    }

    // Check if Swiper is initialized
    const swiperInitialized = await page.evaluate(() => {
      const carousel = document.querySelector('.news-carousel');
      return carousel && carousel.swiper ? true : false;
    });
    console.log('\nSwiper initialized:', swiperInitialized);

    console.log('\n========================================');
    console.log('CAROUSEL TESTING - PUBLISHED (www.bws.ninja)');
    console.log('========================================');

    await page.goto('https://www.bws.ninja/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Swiper to initialize

    // Check for Swiper arrows
    const publishedPrevButton = page.locator('.swiper-button-prev');
    const publishedNextButton = page.locator('.swiper-button-next');

    const publishedPrevCount = await publishedPrevButton.count();
    const publishedNextCount = await publishedNextButton.count();

    console.log('\nPublished Swiper Arrows:');
    console.log('  .swiper-button-prev count:', publishedPrevCount);
    console.log('  .swiper-button-next count:', publishedNextCount);

    if (publishedPrevCount > 0) {
      const prevVisible = await publishedPrevButton.first().isVisible();
      const prevStyles = await publishedPrevButton.first().evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          left: styles.left,
          position: styles.position
        };
      });
      console.log('  Left arrow visible:', prevVisible);
      console.log('  Left arrow styles:', prevStyles);
    }

    if (publishedNextCount > 0) {
      const nextVisible = await publishedNextButton.first().isVisible();
      const nextStyles = await publishedNextButton.first().evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          right: styles.right,
          position: styles.position
        };
      });
      console.log('  Right arrow visible:', nextVisible);
      console.log('  Right arrow styles:', nextStyles);
    }

    // Check if Swiper is initialized
    const publishedSwiperInitialized = await page.evaluate(() => {
      const carousel = document.querySelector('.news-carousel');
      return carousel && carousel.swiper ? true : false;
    });
    console.log('\nPublished Swiper initialized:', publishedSwiperInitialized);

    console.log('\n========================================');
    console.log('COMPARISON SUMMARY');
    console.log('========================================');
    console.log('Local has', localPrevCount, 'prev buttons');
    console.log('Published has', publishedPrevCount, 'prev buttons');
    console.log('Local has', localNextCount, 'next buttons');
    console.log('Published has', publishedNextCount, 'next buttons');
  });
});
