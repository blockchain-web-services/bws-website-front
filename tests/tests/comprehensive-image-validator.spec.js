import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4321';

// Complete list of all website pages
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

test.describe('Comprehensive Image Validator', () => {
  test('should detect ALL broken images across the entire website with advanced validation', async ({ page }) => {
    const report = {
      timestamp: new Date().toISOString(),
      pagesChecked: 0,
      totalImagesChecked: 0,
      totalBrokenImages: 0,
      brokenImagesByPage: {},
      networkErrors: [],
      testSummary: {
        imgTags: { checked: 0, broken: 0 },
        srcsetImages: { checked: 0, broken: 0 },
        backgroundImages: { checked: 0, broken: 0 },
        videoPosters: { checked: 0, broken: 0 },
        dropdownImages: { checked: 0, broken: 0 }
      }
    };

    const allBrokenImages = [];
    const networkRequests = new Map();
    const checkedUrls = new Set();

    // Network monitoring for all image requests
    page.on('request', request => {
      const url = request.url();
      if (isImageUrl(url)) {
        networkRequests.set(url, {
          url,
          status: 'pending',
          type: request.resourceType(),
          timestamp: Date.now()
        });
      }
    });

    page.on('response', response => {
      const url = response.url();
      if (isImageUrl(url)) {
        const existing = networkRequests.get(url);
        networkRequests.set(url, {
          ...existing,
          status: response.status(),
          statusText: response.statusText(),
          responseTime: Date.now() - (existing?.timestamp || Date.now())
        });

        // Track network errors
        if (response.status() >= 400) {
          report.networkErrors.push({
            url,
            status: response.status(),
            statusText: response.statusText(),
            type: 'network-error'
          });
        }
      }
    });

    // Process each page
    for (const pagePath of PAGES) {
      const pageUrl = BASE_URL + pagePath;
      console.log(`\n🔍 Comprehensively checking page: ${pagePath}`);

      const pageResults = {
        imgTags: [],
        srcsetImages: [],
        backgroundImages: [],
        videoPosters: [],
        dropdownImages: [],
        allBrokenImages: []
      };

      try {
        // Navigate with comprehensive wait strategy
        await page.goto(pageUrl, {
          waitUntil: 'networkidle',
          timeout: 45000
        });

        // Wait for dynamic content and animations
        await page.waitForTimeout(2000);

        // Trigger dropdown interactions (homepage navigation)
        if (pagePath === '/') {
          await triggerDropdownsForImageLoading(page, pageResults);
        }

        // Comprehensive scrolling to trigger ALL lazy-loaded content
        await performComprehensiveScrolling(page);

        // Wait for all triggered content to load
        await page.waitForTimeout(3000);

        // 1. Check regular <img> tags with advanced validation
        const imgTagResults = await validateImgTags(page);
        pageResults.imgTags = imgTagResults;
        report.testSummary.imgTags.checked += imgTagResults.length;
        report.testSummary.imgTags.broken += imgTagResults.filter(img => img.isBroken).length;

        // 2. Check srcset images and validate which variant loaded
        const srcsetResults = await validateSrcsetImages(page);
        pageResults.srcsetImages = srcsetResults;
        report.testSummary.srcsetImages.checked += srcsetResults.length;
        report.testSummary.srcsetImages.broken += srcsetResults.filter(img => img.isBroken).length;

        // 3. Check CSS background images
        const backgroundResults = await validateBackgroundImages(page);
        pageResults.backgroundImages = backgroundResults;
        report.testSummary.backgroundImages.checked += backgroundResults.length;
        report.testSummary.backgroundImages.broken += backgroundResults.filter(img => img.isBroken).length;

        // 4. Check video poster images
        const videoResults = await validateVideoPosters(page);
        pageResults.videoPosters = videoResults;
        report.testSummary.videoPosters.checked += videoResults.length;
        report.testSummary.videoPosters.broken += videoResults.filter(img => img.isBroken).length;

        // Collect all broken images for this page
        const allPageBroken = [
          ...imgTagResults.filter(img => img.isBroken),
          ...srcsetResults.filter(img => img.isBroken),
          ...backgroundResults.filter(img => img.isBroken),
          ...videoResults.filter(img => img.isBroken),
          ...pageResults.dropdownImages.filter(img => img.isBroken)
        ];

        pageResults.allBrokenImages = allPageBroken;
        allBrokenImages.push(...allPageBroken);

        if (allPageBroken.length === 0) {
          console.log(`  ✅ All images loading correctly`);
        } else {
          console.log(`  ❌ Found ${allPageBroken.length} broken images`);
          allPageBroken.forEach(img => {
            console.log(`    - ${img.type}: ${img.url} (${img.reason || img.alt || 'No alt text'})`);
          });
        }

        report.brokenImagesByPage[pagePath] = pageResults;
        report.pagesChecked++;

      } catch (error) {
        console.log(`  ⚠️ Error checking page: ${error.message}`);
        report.brokenImagesByPage[pagePath] = {
          error: error.message,
          allBrokenImages: []
        };
      }
    }

    // Calculate totals
    report.totalImagesChecked =
      report.testSummary.imgTags.checked +
      report.testSummary.srcsetImages.checked +
      report.testSummary.backgroundImages.checked +
      report.testSummary.videoPosters.checked +
      report.testSummary.dropdownImages.checked;

    report.totalBrokenImages = allBrokenImages.length;

    // Generate comprehensive reports
    await generateDetailedReports(report, allBrokenImages, networkRequests);

    // Print summary
    console.log(`\n============================================================`);
    console.log(`COMPREHENSIVE IMAGE VALIDATION REPORT`);
    console.log(`============================================================`);
    console.log(`\nPages checked: ${report.pagesChecked}`);
    console.log(`Total images validated: ${report.totalImagesChecked}`);
    console.log(`- IMG tags: ${report.testSummary.imgTags.checked}`);
    console.log(`- Srcset images: ${report.testSummary.srcsetImages.checked}`);
    console.log(`- Background images: ${report.testSummary.backgroundImages.checked}`);
    console.log(`- Video posters: ${report.testSummary.videoPosters.checked}`);
    console.log(`- Dropdown images: ${report.testSummary.dropdownImages.checked}`);
    console.log(`\nTotal broken images: ${report.totalBrokenImages}`);
    console.log(`- IMG tag failures: ${report.testSummary.imgTags.broken}`);
    console.log(`- Srcset failures: ${report.testSummary.srcsetImages.broken}`);
    console.log(`- Background failures: ${report.testSummary.backgroundImages.broken}`);
    console.log(`- Video poster failures: ${report.testSummary.videoPosters.broken}`);
    console.log(`- Network errors: ${report.networkErrors.length}`);

    if (allBrokenImages.length > 0) {
      console.log(`\n🔥 CRITICAL: ${allBrokenImages.length} images are broken!`);
      console.log(`📊 Detailed report: comprehensive-image-validation-report.json`);
      console.log(`🔧 Download script: fix-broken-images.sh`);
      console.log(`============================================================\n`);
    } else {
      console.log(`\n✅ SUCCESS: All images are loading correctly!`);
      console.log(`============================================================\n`);
    }

    // FAIL the test if ANY images are broken
    expect(allBrokenImages.length,
      `Found ${allBrokenImages.length} broken images. Check comprehensive-image-validation-report.json for details.`
    ).toBe(0);
  });
});

// Helper function to determine if URL is an image
function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|svg|webp|avif)(\?|$)/i.test(url) ||
         url.includes('image') ||
         /poster|background|srcset/i.test(url);
}

// Trigger dropdown menus to load their images
async function triggerDropdownsForImageLoading(page, results) {
  console.log(`  🎯 Triggering navigation dropdowns...`);

  const dropdowns = await page.$$('[data-hover="true"], .nav-link-dropdown');
  let dropdownImageCount = 0;

  for (const dropdown of dropdowns) {
    try {
      // Hover to trigger dropdown
      await dropdown.hover();
      await page.waitForTimeout(500);

      // Check if dropdown images loaded
      const dropdownContainer = dropdown.locator('..');
      const dropdownImages = await dropdownContainer.$$('img');

      for (const img of dropdownImages) {
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt') || '';
        const complete = await img.evaluate(el => el.complete);
        const naturalWidth = await img.evaluate(el => el.naturalWidth);

        if (src) {
          const isBroken = !complete || naturalWidth === 0;
          results.dropdownImages.push({
            url: src,
            alt,
            isBroken,
            type: 'dropdown-image',
            reason: isBroken ? 'Failed to load or zero dimensions' : null
          });
          dropdownImageCount++;
        }
      }
    } catch (e) {
      // Some dropdowns might not be interactive
    }
  }

  console.log(`    Found ${dropdownImageCount} dropdown images`);
}

// Comprehensive scrolling to trigger all lazy-loaded content
async function performComprehensiveScrolling(page) {
  console.log(`  📜 Performing comprehensive scrolling...`);

  await page.evaluate(async () => {
    // Multiple scrolling strategies to catch all lazy-loading

    // 1. Smooth incremental scroll
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 150;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve(true);
        }
      }, 100);
    });

    // 2. Jump to specific sections
    const sections = document.querySelectorAll('section, div[id], .section');
    for (const section of sections) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // 3. Final scroll to bottom and back to top
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 500));
  });
}

// Validate regular <img> tags with comprehensive checks
async function validateImgTags(page) {
  return await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(img => {
      const isVisible = img.offsetParent !== null &&
                       img.style.display !== 'none' &&
                       img.style.visibility !== 'hidden';

      const isBroken = isVisible && (!img.complete || img.naturalWidth === 0);

      return {
        url: img.src,
        alt: img.alt || '',
        width: img.naturalWidth,
        height: img.naturalHeight,
        complete: img.complete,
        visible: isVisible,
        isBroken,
        type: 'img-tag',
        reason: isBroken ?
          (!img.complete ? 'Image not complete' : 'Zero dimensions') : null
      };
    });
  });
}

// Validate srcset images and check which variant was loaded
async function validateSrcsetImages(page) {
  return await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img[srcset]'));
    return images.map(img => {
      const isVisible = img.offsetParent !== null &&
                       img.style.display !== 'none';

      const currentSrc = img.currentSrc || img.src;
      const srcset = img.srcset;
      const isBroken = isVisible && (!img.complete || img.naturalWidth === 0);

      return {
        url: currentSrc,
        srcset: srcset,
        alt: img.alt || '',
        actualLoadedImage: currentSrc,
        width: img.naturalWidth,
        height: img.naturalHeight,
        complete: img.complete,
        visible: isVisible,
        isBroken,
        type: 'srcset-image',
        reason: isBroken ?
          (!img.complete ? 'Srcset image not complete' : 'Zero dimensions') : null
      };
    });
  });
}

// Validate CSS background images
async function validateBackgroundImages(page) {
  return await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    const backgroundImages = [];

    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const backgroundImage = style.backgroundImage;

      if (backgroundImage && backgroundImage !== 'none' && backgroundImage.includes('url(')) {
        // Extract URL from CSS url() function
        const matches = backgroundImage.match(/url\(["']?([^"')]+)["']?\)/g);
        if (matches) {
          matches.forEach(match => {
            const url = match.replace(/url\(["']?([^"')]+)["']?\)/, '$1');
            if (url.startsWith('http') || url.startsWith('/')) {
              backgroundImages.push({
                url: url.startsWith('/') ? window.location.origin + url : url,
                element: element.tagName.toLowerCase() + (element.className ? '.' + element.className.split(' ')[0] : ''),
                type: 'background-image',
                isBroken: false, // Will be validated against network responses
                reason: null
              });
            }
          });
        }
      }
    });

    return backgroundImages;
  });
}

// Validate video poster images
async function validateVideoPosters(page) {
  return await page.evaluate(() => {
    const videos = Array.from(document.querySelectorAll('video[poster], [data-poster-url]'));
    return videos.map(video => {
      const posterUrl = video.getAttribute('poster') || video.getAttribute('data-poster-url');
      if (posterUrl) {
        return {
          url: posterUrl.startsWith('/') ? window.location.origin + posterUrl : posterUrl,
          element: 'video',
          type: 'video-poster',
          isBroken: false, // Will be validated against network responses
          reason: null
        };
      }
    }).filter(Boolean);
  });
}

// Generate detailed reports and fix scripts
async function generateDetailedReports(report, brokenImages, networkRequests) {
  // Save comprehensive JSON report
  const reportPath = path.join(process.cwd(), 'comprehensive-image-validation-report.json');
  const detailedReport = {
    ...report,
    networkRequests: Object.fromEntries(networkRequests),
    brokenImageDetails: brokenImages
  };

  fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));

  // Generate shell script to download missing images
  if (brokenImages.length > 0) {
    const scriptLines = [
      '#!/bin/bash',
      '# Auto-generated script to download missing images',
      '# Run this script from the project root directory',
      '',
      'echo "Downloading missing images..."',
      ''
    ];

    const uniqueUrls = [...new Set(brokenImages.map(img => img.url))];
    uniqueUrls.forEach(url => {
      if (url.startsWith('/assets/')) {
        const filename = url.split('/').pop();
        const directory = url.substring(0, url.lastIndexOf('/'));
        scriptLines.push(`# Download ${filename}`);
        scriptLines.push(`mkdir -p "public${directory}"`);
        scriptLines.push(`curl -L "https://www.bws.ninja${url}" -o "public${url}"`);
        scriptLines.push(`mkdir -p "_site${directory}"`);
        scriptLines.push(`curl -L "https://www.bws.ninja${url}" -o "_site${url}"`);
        scriptLines.push('');
      }
    });

    const scriptPath = path.join(process.cwd(), 'fix-broken-images.sh');
    fs.writeFileSync(scriptPath, scriptLines.join('\n'));
    fs.chmodSync(scriptPath, '755');
  }
}