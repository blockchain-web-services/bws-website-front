import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4321';

// List of all pages in the website
const PAGES = [
  '/',
  '/about',
  '/contact-us',
  '/industries',
  '/resources',
  '/legal-notice',
  '/privacy-policy',
  // Industry content pages
  '/industry-content/financial-services',
  '/industry-content/content-creation',
  '/industry-content/retail',
  '/industry-content/esg',
  '/industry-content/legal',
  '/industry-content/supply-chain',
  // Marketplace pages
  '/marketplace/database-immutable',
  '/marketplace/database-mutable',
  '/marketplace/ipfs-upload',
  '/marketplace/nft-zeroknwoledge',
  '/marketplace/nft-gamecube',
  '/marketplace/blockchain-badges',
  '/marketplace/esg-credits',
  '/marketplace/telegram-xbot',
  // Article pages
  '/articles/discover-the-power-of-blockchain-bwss-data-management-solutions',
  '/articles/embrace-sustainability-with-esg-credits-bws-solution',
  '/articles/investment-impact-reporting-unlocking-a-sustainable-future'
];

test.describe('Full Site Image Check', () => {
  test('should check ALL images across entire website', async ({ page }) => {
    // Increase test timeout to prevent browser closure during long image checks
    test.setTimeout(180000); // 3 minutes

    const allBrokenAssets = [];
    const checkedUrls = new Set();
    const pageReports = [];

    // Configure page to listen for responses
    page.on('response', response => {
      const url = response.url();
      if ((url.includes('.jpg') || url.includes('.png') || url.includes('.svg') || url.includes('.webp')) && 
          !checkedUrls.has(url)) {
        checkedUrls.add(url);
        if (response.status() === 404) {
          allBrokenAssets.push({
            url: url,
            status: response.status(),
            type: 'network-request',
            page: page.url()
          });
        }
      }
    });

    // Check each page
    for (const pagePath of PAGES) {
      const pageUrl = BASE_URL + pagePath;
      console.log(`\nChecking page: ${pagePath}`);
      
      const pageBrokenAssets = [];
      
      try {
        // Navigate to the page
        await page.goto(pageUrl, {
          waitUntil: 'networkidle',
          timeout: 60000 // Increased to 60 seconds
        });

        // Wait for any dynamic content
        await page.waitForTimeout(1000);

        // Trigger dropdown menus if on homepage
        if (pagePath === '/') {
          const dropdowns = await page.$$('[data-hover="true"]');
          for (const dropdown of dropdowns) {
            try {
              await dropdown.hover();
              await page.waitForTimeout(300);
            } catch (e) {
              // Dropdown might not be visible
            }
          }
        }

        // Scroll to trigger lazy-loaded images
        await page.evaluate(() => {
          return new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 200;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                window.scrollTo(0, 0);
                resolve();
              }
            }, 50);
          });
        });

        // Wait for images to load
        await page.waitForTimeout(1000);

        // Check all <img> tags
        const imgResults = await page.evaluate(() => {
          const images = Array.from(document.querySelectorAll('img'));
          return images.map(img => ({
            src: img.src,
            alt: img.alt || '',
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            displayed: img.offsetParent !== null || img.style.display !== 'none',
            complete: img.complete
          }));
        });

        // Find broken images
        for (const img of imgResults) {
          if (img.displayed && (img.naturalWidth === 0 || !img.complete)) {
            pageBrokenAssets.push({
              url: img.src,
              type: 'img-tag',
              alt: img.alt,
              page: pagePath
            });
            allBrokenAssets.push({
              url: img.src,
              type: 'img-tag',
              alt: img.alt,
              page: pagePath
            });
          }
        }

        // Check all background images
        const bgImages = await page.evaluate(() => {
          const elements = document.querySelectorAll('*');
          const backgrounds = [];
          
          elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const bgImage = style.backgroundImage;
            
            if (bgImage && bgImage !== 'none' && bgImage.includes('url')) {
              const matches = bgImage.match(/url\(["']?([^"'\)]+)["']?\)/);
              if (matches && matches[1]) {
                const url = matches[1];
                const absoluteUrl = new URL(url, window.location.href).href;
                backgrounds.push({
                  url: absoluteUrl,
                  element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : '')
                });
              }
            }
          });
          
          return backgrounds;
        });

        // Check each background image
        for (const bgImage of bgImages) {
          if (!checkedUrls.has(bgImage.url)) {
            checkedUrls.add(bgImage.url);
            try {
              const response = await page.request.get(bgImage.url);
              if (response.status() === 404) {
                pageBrokenAssets.push({
                  url: bgImage.url,
                  type: 'background-image',
                  element: bgImage.element,
                  page: pagePath
                });
                allBrokenAssets.push({
                  url: bgImage.url,
                  type: 'background-image',
                  element: bgImage.element,
                  page: pagePath
                });
              }
            } catch (e) {
              // Request failed
              pageBrokenAssets.push({
                url: bgImage.url,
                type: 'background-image',
                element: bgImage.element,
                error: 'Request failed',
                page: pagePath
              });
            }
          }
        }

        // Report for this page
        if (pageBrokenAssets.length > 0) {
          console.log(`  ❌ Found ${pageBrokenAssets.length} broken images`);
          pageReports.push({
            page: pagePath,
            brokenCount: pageBrokenAssets.length,
            assets: pageBrokenAssets
          });
        } else {
          console.log(`  ✅ All images loading correctly`);
        }

      } catch (error) {
        console.log(`  ⚠️ Error checking page: ${error.message}`);
        pageReports.push({
          page: pagePath,
          error: error.message
        });
      }
    }

    // Generate comprehensive report
    console.log('\n' + '='.repeat(60));
    console.log('FULL SITE IMAGE CHECK REPORT');
    console.log('='.repeat(60));
    
    console.log(`\nPages checked: ${PAGES.length}`);
    console.log(`Total images checked: ${checkedUrls.size}`);
    console.log(`Total broken images: ${allBrokenAssets.length}`);
    
    if (allBrokenAssets.length > 0) {
      console.log('\nBroken images by page:');
      console.log('-'.repeat(60));
      
      // Group by page
      const byPage = {};
      allBrokenAssets.forEach(asset => {
        if (!byPage[asset.page]) {
          byPage[asset.page] = [];
        }
        byPage[asset.page].push(asset);
      });
      
      Object.keys(byPage).sort().forEach(page => {
        console.log(`\n${page} (${byPage[page].length} broken):`);
        byPage[page].forEach(asset => {
          console.log(`  - ${asset.url.replace(BASE_URL, '')}`);
          if (asset.alt) console.log(`    Alt: ${asset.alt}`);
          if (asset.element) console.log(`    Element: ${asset.element}`);
        });
      });
      
      // Save detailed report
      const report = {
        timestamp: new Date().toISOString(),
        pagesChecked: PAGES.length,
        totalImagesChecked: checkedUrls.size,
        totalBrokenImages: allBrokenAssets.length,
        brokenByPage: byPage,
        pageReports: pageReports
      };
      
      fs.writeFileSync(
        path.join(process.cwd(), 'full-site-image-report.json'),
        JSON.stringify(report, null, 2)
      );
      console.log('\nDetailed report saved to full-site-image-report.json');
      
      // Also create a download script
      const downloadScript = allBrokenAssets
        .map(asset => {
          const filename = asset.url.split('/').pop();
          const dir = asset.url.replace(BASE_URL, '').split('/').slice(0, -1).join('/');
          return `# ${asset.page}\nmkdir -p "public${dir}"\ncurl -o "public${dir}/${filename}" "https://www.bws.ninja${asset.url.replace(BASE_URL, '')}"\n`;
        })
        .join('\n');
      
      fs.writeFileSync(
        path.join(process.cwd(), 'download-broken-images.sh'),
        `#!/bin/bash\n# Script to download all broken images\n\n${downloadScript}`
      );
      console.log('Download script saved to download-broken-images.sh');
    } else {
      console.log('\n🎉 SUCCESS: All images across the entire website are loading correctly!');
    }
    
    console.log('\n' + '='.repeat(60));

    // Test fails if any broken images found
    expect(allBrokenAssets.length).toBe(0);
  });
});