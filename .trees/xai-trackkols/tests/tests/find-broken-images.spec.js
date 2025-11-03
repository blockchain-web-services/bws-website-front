import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Find All Broken Images', () => {
  test('scan all pages for broken images', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes for scanning entire website
    const brokenImages = [];
    const workingImages = [];
    const allImagesSeen = new Set();

    // Pages to check
    const pages = [
      '/',
      '/about.html',
      '/industries.html',
      '/resources.html',
      '/contact-us.html',
      '/legal-notice.html',
      '/privacy-policy.html',
      // Marketplace pages
      '/marketplace/database-immutable.html',
      '/marketplace/database-mutable.html',
      '/marketplace/ipfs-upload.html',
      '/marketplace/nft-zeroknwoledge.html',
      '/marketplace/nft-gamecube.html',
      '/marketplace/blockchain-badges.html',
      '/marketplace/esg-credits.html',
      '/marketplace/telegram-xbot.html',
      // Industry pages
      '/industry-content/financial-services.html',
      '/industry-content/content-creation.html',
      '/industry-content/retail.html',
      '/industry-content/esg.html',
      '/industry-content/legal.html',
      '/industry-content/supply-chain.html',
      // Article pages
      '/articles/discover-the-power-of-blockchain-bwss-data-management-solutions.html',
      '/articles/embrace-sustainability-with-esg-credits-bws-solution.html',
      '/articles/investment-impact-reporting-unlocking-a-sustainable-future.html'
    ];

    console.log(`\nScanning ${pages.length} pages for images...\n`);

    for (const pagePath of pages) {
      console.log(`\nChecking page: ${pagePath}`);

      // Track failed image requests
      const failedImages = [];

      page.on('requestfailed', request => {
        const url = request.url();
        if (request.resourceType() === 'image' || url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
          failedImages.push(url);
        }
      });

      // Track all responses
      page.on('response', response => {
        const url = response.url();
        if ((response.request().resourceType() === 'image' || url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) &&
            !url.startsWith('data:')) {
          if (response.status() >= 400) {
            failedImages.push(url);
          }
        }
      });

      // Navigate to page
      await page.goto(pagePath, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Scroll to trigger lazy-loaded images
      await page.evaluate(() => {
        return new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0); // Scroll back to top
              resolve();
            }
          }, 100);
        });
      });

      // Wait for any lazy-loaded images
      await page.waitForTimeout(2000);

      // Find all images in the DOM
      const imagesInDOM = await page.evaluate(() => {
        const images = [];

        // Regular img tags
        document.querySelectorAll('img').forEach(img => {
          if (img.src && !img.src.startsWith('data:')) {
            images.push({
              src: img.src,
              alt: img.alt || '',
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              complete: img.complete,
              currentSrc: img.currentSrc || img.src
            });
          }
        });

        // Background images
        document.querySelectorAll('*').forEach(el => {
          const bg = window.getComputedStyle(el).backgroundImage;
          if (bg && bg !== 'none' && bg.includes('url(')) {
            const urlMatch = bg.match(/url\(['"]?([^'")]+)['"]?\)/);
            if (urlMatch && urlMatch[1] && !urlMatch[1].startsWith('data:')) {
              images.push({
                src: urlMatch[1],
                alt: 'background-image',
                naturalWidth: -1,
                naturalHeight: -1,
                complete: true,
                currentSrc: urlMatch[1]
              });
            }
          }
        });

        // SVG images
        document.querySelectorAll('svg image').forEach(img => {
          const href = img.getAttribute('href') || img.getAttribute('xlink:href');
          if (href && !href.startsWith('data:')) {
            images.push({
              src: href,
              alt: 'svg-image',
              naturalWidth: -1,
              naturalHeight: -1,
              complete: true,
              currentSrc: href
            });
          }
        });

        // Picture elements with source tags
        document.querySelectorAll('picture source').forEach(source => {
          const srcset = source.srcset;
          if (srcset) {
            // Extract all URLs from srcset
            const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
            urls.forEach(url => {
              if (url && !url.startsWith('data:')) {
                images.push({
                  src: url,
                  alt: 'picture-source',
                  naturalWidth: -1,
                  naturalHeight: -1,
                  complete: true,
                  currentSrc: url
                });
              }
            });
          }
        });

        // Video poster images
        document.querySelectorAll('video[poster]').forEach(video => {
          const poster = video.poster;
          if (poster && !poster.startsWith('data:')) {
            images.push({
              src: poster,
              alt: 'video-poster',
              naturalWidth: -1,
              naturalHeight: -1,
              complete: true,
              currentSrc: poster
            });
          }
        });

        return images;
      });

      // Process found images
      for (const img of imagesInDOM) {
        const imageUrl = img.src.replace(/^http:\/\/localhost:\d+/, '');

        if (!allImagesSeen.has(imageUrl)) {
          allImagesSeen.add(imageUrl);

          // Check if image failed to load
          const isBroken = failedImages.some(url => url.includes(imageUrl)) ||
                          (img.naturalWidth === 0 && img.naturalHeight === 0 && img.complete);

          if (isBroken) {
            brokenImages.push({
              page: pagePath,
              url: imageUrl,
              alt: img.alt,
              fullUrl: img.src
            });
            console.log(`  ❌ BROKEN: ${imageUrl}`);
          } else {
            workingImages.push({
              page: pagePath,
              url: imageUrl,
              alt: img.alt
            });
            console.log(`  ✓ OK: ${imageUrl}`);
          }
        }
      }

      // Check for failed images that weren't in DOM
      for (const failedUrl of failedImages) {
        const imageUrl = failedUrl.replace(/^http:\/\/localhost:\d+/, '');
        if (!allImagesSeen.has(imageUrl)) {
          allImagesSeen.add(imageUrl);
          brokenImages.push({
            page: pagePath,
            url: imageUrl,
            alt: 'not-in-dom',
            fullUrl: failedUrl
          });
          console.log(`  ❌ BROKEN (not in DOM): ${imageUrl}`);
        }
      }

      // Clean up event listeners
      page.removeAllListeners('requestfailed');
      page.removeAllListeners('response');
    }

    // Generate report
    console.log('\n' + '='.repeat(80));
    console.log('FINAL REPORT');
    console.log('='.repeat(80));
    console.log(`\nTotal images found: ${allImagesSeen.size}`);
    console.log(`Working images: ${workingImages.length}`);
    console.log(`Broken images: ${brokenImages.length}`);

    if (brokenImages.length > 0) {
      console.log('\n' + '='.repeat(80));
      console.log('BROKEN IMAGES LIST');
      console.log('='.repeat(80));

      // Group broken images by URL
      const brokenByUrl = {};
      for (const img of brokenImages) {
        if (!brokenByUrl[img.url]) {
          brokenByUrl[img.url] = [];
        }
        brokenByUrl[img.url].push(img.page);
      }

      // Sort by URL and print
      const sortedUrls = Object.keys(brokenByUrl).sort();
      for (const url of sortedUrls) {
        console.log(`\n${url}`);
        console.log(`  Found on pages: ${brokenByUrl[url].join(', ')}`);
      }

      // Save to file
      const outputPath = path.join(process.cwd(), 'broken-images.json');
      fs.writeFileSync(outputPath, JSON.stringify({
        summary: {
          total: allImagesSeen.size,
          working: workingImages.length,
          broken: brokenImages.length,
          timestamp: new Date().toISOString()
        },
        brokenImages: brokenByUrl,
        allBrokenImages: brokenImages
      }, null, 2));

      console.log(`\n\nDetailed report saved to: ${outputPath}`);

      // Generate download script
      const downloadScript = sortedUrls.map(url => {
        // Clean up the URL for downloading from live site
        const cleanUrl = url.replace(/%2F/g, '/').replace(/^\//, '');
        return `curl -o "public/${cleanUrl}" "https://bws.ninja/${cleanUrl}"`;
      }).join('\n');

      const scriptPath = path.join(process.cwd(), 'download-broken-images.sh');
      fs.writeFileSync(scriptPath, '#!/bin/bash\n\n' + downloadScript + '\n');
      fs.chmodSync(scriptPath, '755');

      console.log(`Download script saved to: ${scriptPath}`);
    }
  });
});