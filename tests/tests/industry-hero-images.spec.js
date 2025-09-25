import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4321';

// Expected hero images for each industry page
const EXPECTED_HERO_IMAGES = {
  'financial-services': {
    background: '6505dc980dbf1ad68ea4e1f0_Financial-Services_320x400_Layered.jpg',
    article: '654a2597be432d1f0879bfa6_Elevating Financial Services and ESG Compiance.jpg'
  },
  'content-creation': {
    background: '6505db28e3925660b50a55ff_Content-Creation_320x400_Layered.jpg',
    article: '654a258bbfafadcb274d5024_The Future of Creative Ownership and Empowerment.jpg'
  },
  'esg': {
    background: '6505d9933660c5523d5f93eb_ESG-CREDITS_320x400_Layered.jpg',
    article: '654a256e853678a54e9cebdf_Blockchain is the New Frontier in Accountability and Transparency.jpg'
  },
  'legal': {
    background: '6505dde3f53261fa63529ee9_Legal-320x400.jpg',
    article: '654a2515de4301ab69f9951e_Blockchain Trust in Legal Practices.jpg'
  },
  'retail': {
    background: '6505dfa0e3925660b50e279e_Retail_320x400_Layered.jpg',
    article: '654a2561e29f2df41f5bfeb8_Transform the user eXperience with Blockchain.jpg'
  },
  'supply-chain': {
    background: '6505e0f259aeff2f47db9530_Supply-Chain_320x400_layered.jpg',
    article: '654a25780f2320f1dc394e6a_The Future of Transparent and Efficient Supply Chain Management.jpg'
  }
};

test.describe('Industry Page Hero Images', () => {
  test('should have all expected hero images on industry pages', async ({ page }) => {
    const failedPages = [];
    const missingImages = [];

    for (const [pageName, expectedImages] of Object.entries(EXPECTED_HERO_IMAGES)) {
      const pageUrl = `${BASE_URL}/industry-content/${pageName}`;

      console.log(`\nChecking: ${pageName}`);

      // Navigate to the page
      await page.goto(pageUrl, { waitUntil: 'networkidle' });

      // Check for hero section
      const heroSection = await page.locator('.industry-hero-section, .hero-section, [class*="hero"]').first();
      const hasHeroSection = await heroSection.count() > 0;

      if (!hasHeroSection) {
        console.log(`  ⚠️ No hero section found`);
      }

      // Check for background image
      const backgroundImageUrl = expectedImages.background;
      const backgroundImagePath = `/assets/images/6474d385cfec71cb21a9229a/${backgroundImageUrl}`;

      // Check if background image is applied via CSS
      const hasBackgroundImage = await page.evaluate((bgImage) => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.some(el => {
          const style = window.getComputedStyle(el);
          return style.backgroundImage.includes(bgImage);
        });
      }, backgroundImageUrl);

      // Check if background image exists as an img tag
      const hasBackgroundAsImg = await page.locator(`img[src*="${backgroundImageUrl}"]`).count() > 0;

      const backgroundFound = hasBackgroundImage || hasBackgroundAsImg;

      console.log(`  Background Image (${backgroundImageUrl}):`);
      console.log(`    - Applied via CSS: ${hasBackgroundImage ? '✅' : '❌'}`);
      console.log(`    - As img tag: ${hasBackgroundAsImg ? '✅' : '❌'}`);

      if (!backgroundFound) {
        missingImages.push({
          page: pageName,
          type: 'background',
          image: backgroundImageUrl,
          path: backgroundImagePath
        });

        // Check if the file exists
        const filePath = path.join(process.cwd(), '..', '_site', backgroundImagePath.substring(1));
        const fileExists = fs.existsSync(filePath);
        console.log(`    - File exists: ${fileExists ? '✅' : '❌'}`);

        if (!failedPages.includes(pageName)) {
          failedPages.push(pageName);
        }
      }

      // Check for article image (with URL encoding)
      const articleImageUrl = expectedImages.article;
      const encodedArticleImage = articleImageUrl.replace(/ /g, '%20');

      const hasArticleImage = await page.locator(`img[src*="${encodedArticleImage}"], img[src*="${articleImageUrl}"]`).count() > 0;

      console.log(`  Article Image (${articleImageUrl}):`);
      console.log(`    - Found in HTML: ${hasArticleImage ? '✅' : '❌'}`);

      if (!hasArticleImage) {
        missingImages.push({
          page: pageName,
          type: 'article',
          image: articleImageUrl,
          path: `/assets/images/6474d385cfec71cb21a9229a/${encodedArticleImage}`
        });

        if (!failedPages.includes(pageName)) {
          failedPages.push(pageName);
        }
      }
    }

    // Generate detailed report
    if (missingImages.length > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('❌ MISSING HERO IMAGES DETECTED:');
      console.log('='.repeat(60));

      missingImages.forEach(({ page, type, image, path }) => {
        console.log(`\n${page}:`);
        console.log(`  Missing ${type} image: ${image}`);
        console.log(`  Expected path: ${path}`);
      });

      console.log('\n' + '='.repeat(60));
      console.log('SUMMARY:');
      console.log(`Total pages with missing images: ${failedPages.length}`);
      console.log(`Total missing images: ${missingImages.length}`);
      console.log('='.repeat(60));
    }

    // Assert that all hero images are present
    expect(missingImages.length,
      `Found ${missingImages.length} missing hero images on ${failedPages.length} pages:\n${
        failedPages.map(p => `  - ${p}`).join('\n')
      }\n\nMissing images:\n${
        missingImages.map(m => `  - ${m.page}: ${m.type} image (${m.image})`).join('\n')
      }`
    ).toBe(0);
  });
});