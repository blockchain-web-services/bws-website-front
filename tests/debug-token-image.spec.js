import { test, expect } from '@playwright/test';

test.describe('Token Allocation Image Centering Debug', () => {
  test('Check token allocation image centering and size', async ({ page }) => {
    // Navigate to white paper page
    await page.goto('http://localhost:5500/white-paper.html', { waitUntil: 'networkidle' });

    // Scroll to the NFT Game Cube section
    await page.goto('http://localhost:5500/white-paper.html#nft-game-cube');
    await page.waitForTimeout(1000);

    // Find the token allocation image
    const tokenImage = page.locator('img.image-token-allocation').first();

    // Check if image exists
    const count = await tokenImage.count();
    console.log(`\n=== TOKEN ALLOCATION IMAGE DEBUG ===`);
    console.log(`Images found: ${count}`);

    if (count === 0) {
      console.log('❌ No token allocation image found!');
      return;
    }

    // Get image details
    const imageData = await tokenImage.evaluate((img) => {
      const parentFigure = img.closest('.white-paper-figure');
      const parentFigureStyles = parentFigure ? window.getComputedStyle(parentFigure) : null;
      const imgStyles = window.getComputedStyle(img);

      return {
        // Image properties
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        clientWidth: img.clientWidth,
        clientHeight: img.clientHeight,
        offsetLeft: img.offsetLeft,
        offsetWidth: img.offsetWidth,

        // Image computed styles
        imgDisplay: imgStyles.display,
        imgMaxWidth: imgStyles.maxWidth,
        imgWidth: imgStyles.width,
        imgMargin: imgStyles.margin,
        imgMarginLeft: imgStyles.marginLeft,
        imgMarginRight: imgStyles.marginRight,
        imgFloat: imgStyles.float,
        imgPosition: imgStyles.position,

        // Parent figure properties
        parentExists: !!parentFigure,
        parentTextAlign: parentFigureStyles ? parentFigureStyles.textAlign : 'N/A',
        parentDisplay: parentFigureStyles ? parentFigureStyles.display : 'N/A',
        parentWidth: parentFigure ? parentFigure.clientWidth : 'N/A',
        parentMargin: parentFigureStyles ? parentFigureStyles.margin : 'N/A',
      };
    });

    console.log('\n--- Image Properties ---');
    console.log(`Source: ${imageData.src}`);
    console.log(`Natural size: ${imageData.naturalWidth}x${imageData.naturalHeight}`);
    console.log(`Display size: ${imageData.clientWidth}x${imageData.clientHeight}`);
    console.log(`Offset left: ${imageData.offsetLeft}px`);
    console.log(`Offset width: ${imageData.offsetWidth}px`);

    console.log('\n--- Image Computed Styles ---');
    console.log(`display: ${imageData.imgDisplay}`);
    console.log(`max-width: ${imageData.imgMaxWidth}`);
    console.log(`width: ${imageData.imgWidth}`);
    console.log(`margin: ${imageData.imgMargin}`);
    console.log(`margin-left: ${imageData.imgMarginLeft}`);
    console.log(`margin-right: ${imageData.imgMarginRight}`);
    console.log(`float: ${imageData.imgFloat}`);
    console.log(`position: ${imageData.imgPosition}`);

    console.log('\n--- Parent Figure Properties ---');
    console.log(`Parent exists: ${imageData.parentExists}`);
    console.log(`Parent text-align: ${imageData.parentTextAlign}`);
    console.log(`Parent display: ${imageData.parentDisplay}`);
    console.log(`Parent width: ${imageData.parentWidth}`);
    console.log(`Parent margin: ${imageData.parentMargin}`);

    // Calculate centering
    if (imageData.parentWidth !== 'N/A') {
      const imageWidth = imageData.clientWidth;
      const parentWidth = imageData.parentWidth;
      const expectedOffsetLeft = (parentWidth - imageWidth) / 2;
      const actualOffsetLeft = imageData.offsetLeft;
      const centeringDiff = Math.abs(expectedOffsetLeft - actualOffsetLeft);

      console.log('\n--- Centering Analysis ---');
      console.log(`Parent width: ${parentWidth}px`);
      console.log(`Image width: ${imageWidth}px`);
      console.log(`Expected offset-left (centered): ${expectedOffsetLeft.toFixed(2)}px`);
      console.log(`Actual offset-left: ${actualOffsetLeft}px`);
      console.log(`Difference: ${centeringDiff.toFixed(2)}px`);

      if (centeringDiff > 5) {
        console.log(`\n❌ IMAGE IS NOT CENTERED (diff > 5px)`);
        console.log(`The image appears to be left-aligned instead of centered.`);
      } else {
        console.log(`\n✅ IMAGE IS CENTERED (diff <= 5px)`);
      }
    }

    // Take a screenshot
    await page.screenshot({
      path: 'tests/screenshots/token-allocation-debug.png',
      fullPage: false
    });
    console.log('\n📸 Screenshot saved to: tests/screenshots/token-allocation-debug.png');
  });
});
