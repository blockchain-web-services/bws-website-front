import { test, expect } from '@playwright/test';

test.describe('Compare Local vs Published Version', () => {
  test('Compare footer logo', async ({ browser }) => {
    // Create two contexts for parallel comparison
    const localContext = await browser.newContext();
    const publishedContext = await browser.newContext();

    const localPage = await localContext.newPage();
    const publishedPage = await publishedContext.newPage();

    // Navigate to both versions
    await localPage.goto('http://localhost:4321');
    await publishedPage.goto('https://www.bws.ninja/');

    // Wait for pages to load
    await localPage.waitForLoadState('networkidle');
    await publishedPage.waitForLoadState('networkidle');

    // Check footer logo on local version
    const localFooterLogo = await localPage.locator('footer img, footer svg').first();
    const localLogoSrc = await localFooterLogo.getAttribute('src') || await localFooterLogo.evaluate(el => el.outerHTML);
    const localLogoVisible = await localFooterLogo.isVisible();

    console.log('\n=== LOCAL VERSION (localhost:4321) ===');
    console.log('Footer logo source:', localLogoSrc);
    console.log('Footer logo visible:', localLogoVisible);

    // Check footer logo on published version
    const publishedFooterLogo = await publishedPage.locator('footer img, footer svg').first();
    const publishedLogoSrc = await publishedFooterLogo.getAttribute('src') || await publishedFooterLogo.evaluate(el => el.outerHTML);
    const publishedLogoVisible = await publishedFooterLogo.isVisible();

    console.log('\n=== PUBLISHED VERSION (www.bws.ninja) ===');
    console.log('Footer logo source:', publishedLogoSrc);
    console.log('Footer logo visible:', publishedLogoVisible);

    // Get all footer images/svgs for detailed comparison
    const localFooterImages = await localPage.locator('footer img, footer svg').all();
    console.log('\n=== LOCAL FOOTER - All images/SVGs ===');
    for (let i = 0; i < localFooterImages.length; i++) {
      const src = await localFooterImages[i].getAttribute('src') || 'SVG element';
      const alt = await localFooterImages[i].getAttribute('alt') || 'no alt';
      console.log(`[${i}] src: ${src}, alt: ${alt}`);
    }

    const publishedFooterImages = await publishedPage.locator('footer img, footer svg').all();
    console.log('\n=== PUBLISHED FOOTER - All images/SVGs ===');
    for (let i = 0; i < publishedFooterImages.length; i++) {
      const src = await publishedFooterImages[i].getAttribute('src') || 'SVG element';
      const alt = await publishedFooterImages[i].getAttribute('alt') || 'no alt';
      console.log(`[${i}] src: ${src}, alt: ${alt}`);
    }

    await localContext.close();
    await publishedContext.close();
  });

  test('Compare carousel arrows', async ({ browser }) => {
    const localContext = await browser.newContext();
    const publishedContext = await browser.newContext();

    const localPage = await localContext.newPage();
    const publishedPage = await publishedContext.newPage();

    // Navigate to both versions
    await localPage.goto('http://localhost:4321');
    await publishedPage.goto('https://www.bws.ninja/');

    // Wait for pages to load
    await localPage.waitForLoadState('networkidle');
    await publishedPage.waitForLoadState('networkidle');

    // Check carousel arrows on local version
    const localLeftArrow = localPage.locator('.w-slider-arrow-left, [class*="arrow"][class*="left"], [class*="slider"] .left-arrow');
    const localRightArrow = localPage.locator('.w-slider-arrow-right, [class*="arrow"][class*="right"], [class*="slider"] .right-arrow');

    const localLeftCount = await localLeftArrow.count();
    const localRightCount = await localRightArrow.count();
    const localLeftVisible = localLeftCount > 0 ? await localLeftArrow.first().isVisible() : false;
    const localRightVisible = localRightCount > 0 ? await localRightArrow.first().isVisible() : false;

    console.log('\n=== LOCAL VERSION - Carousel Arrows ===');
    console.log('Left arrows found:', localLeftCount);
    console.log('Right arrows found:', localRightCount);
    console.log('Left arrow visible:', localLeftVisible);
    console.log('Right arrow visible:', localRightVisible);

    if (localLeftCount > 0) {
      const leftArrowHTML = await localLeftArrow.first().evaluate(el => el.outerHTML.substring(0, 200));
      console.log('Left arrow HTML (first 200 chars):', leftArrowHTML);
    }

    // Check carousel arrows on published version
    const publishedLeftArrow = publishedPage.locator('.w-slider-arrow-left, [class*="arrow"][class*="left"], [class*="slider"] .left-arrow');
    const publishedRightArrow = publishedPage.locator('.w-slider-arrow-right, [class*="arrow"][class*="right"], [class*="slider"] .right-arrow');

    const publishedLeftCount = await publishedLeftArrow.count();
    const publishedRightCount = await publishedRightArrow.count();
    const publishedLeftVisible = publishedLeftCount > 0 ? await publishedLeftArrow.first().isVisible() : false;
    const publishedRightVisible = publishedRightCount > 0 ? await publishedRightArrow.first().isVisible() : false;

    console.log('\n=== PUBLISHED VERSION - Carousel Arrows ===');
    console.log('Left arrows found:', publishedLeftCount);
    console.log('Right arrows found:', publishedRightCount);
    console.log('Left arrow visible:', publishedLeftVisible);
    console.log('Right arrow visible:', publishedRightVisible);

    if (publishedLeftCount > 0) {
      const leftArrowHTML = await publishedLeftArrow.first().evaluate(el => el.outerHTML.substring(0, 200));
      console.log('Left arrow HTML (first 200 chars):', leftArrowHTML);
    }

    // Check computed styles for arrows
    if (localLeftCount > 0) {
      const localLeftStyles = await localLeftArrow.first().evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          position: styles.position
        };
      });
      console.log('\n=== LOCAL - Left Arrow Computed Styles ===');
      console.log(localLeftStyles);
    }

    if (publishedLeftCount > 0) {
      const publishedLeftStyles = await publishedLeftArrow.first().evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          position: styles.position
        };
      });
      console.log('\n=== PUBLISHED - Left Arrow Computed Styles ===');
      console.log(publishedLeftStyles);
    }

    await localContext.close();
    await publishedContext.close();
  });
});
