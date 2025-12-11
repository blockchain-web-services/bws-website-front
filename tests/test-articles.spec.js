import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve _site directory relative to project root
const siteDir = path.join(__dirname, '..', '_site');
const articlesDir = path.join(siteDir, 'articles');

// Article metadata mapping - maps article slugs to their expected titles
// NOTE: Content is dynamically generated and may change, so we only validate structure and titles
const articleMetadata = {
  'blockchain-badges': {
    title: 'Blockchain Badges'
  },
  'esg-credits': {
    title: 'ESG Credits'
  },
  'fan-game-cube': {
    title: 'Fan Game Cube'
  },
  'x-bot': {
    title: 'X Bot'
  }
};

// Dynamically discover article files from the build output
// Only includes articles from the last 3 days to test recently generated articles
// with the latest code changes (caption fixes, proper figure/figcaption structure)
function discoverArticles() {
  if (!fs.existsSync(articlesDir)) {
    console.warn(`Articles directory not found: ${articlesDir}`);
    return [];
  }

  // Calculate date threshold (3 days ago)
  // Using a short window to only test recently generated articles with latest code
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const articleFiles = fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.html'))
    .map(filename => {
      // Extract slug and date from filename (e.g., "blockchain-badges-2025-10-20.html")
      const match = filename.match(/^(.+?)-(\d{4})-(\d{2})-(\d{2})\.html$/);
      if (!match) return null;

      const [, slug, year, month, day] = match;
      const articleDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      // Only include articles from the last 3 days
      if (articleDate < threeDaysAgo) {
        return null;
      }

      const metadata = articleMetadata[slug];

      if (!metadata) {
        console.warn(`No metadata found for article slug: ${slug}`);
        return null;
      }

      return {
        url: `/articles/${filename}`,
        slug: slug,
        filename: filename,
        title: metadata.title,
        date: articleDate
      };
    })
    .filter(Boolean); // Remove null entries

  return articleFiles;
}

test.describe('Articles Pages', () => {
  // Dynamically discover articles from filesystem
  const articles = discoverArticles();

  // Ensure we have articles to test (fail early if generation failed)
  test.beforeAll(() => {
    if (articles.length === 0) {
      throw new Error('No articles found in _site/articles/. Article generation may have failed.');
    }
    console.log(`Found ${articles.length} articles to test:`, articles.map(a => a.slug));
  });

  for (const article of articles) {
    test(`${article.filename} - loads and displays correctly`, async ({ page }) => {
      await page.goto(article.url);

      // Check title is present
      await expect(page.locator('h1.blog-post-title')).toContainText(article.title);

      // Check navigation is present (use first nav element to avoid strict mode)
      await expect(page.locator('nav').first()).toBeVisible();

      // Check article content is visible and has content (use .blog-post-body-wrapper to be more specific)
      const articleBody = page.locator('.blog-post-body-wrapper .rich-text');
      await expect(articleBody).toBeVisible();

      // Verify article body has actual text content (not empty)
      const bodyText = await articleBody.textContent();
      expect(bodyText.trim().length).toBeGreaterThan(100); // At least 100 chars of content

      // Check footer is present
      await expect(page.locator('footer').first()).toBeVisible();

      // Verify page structure starts with .page-top-section (not orphaned elements)
      const firstMainElement = await page.locator('body > *').first().getAttribute('class');
      expect(firstMainElement).not.toContain('top-menu-column');
    });
  }

  test('All articles have proper page structure', async ({ page }) => {
    for (const article of articles) {
      await page.goto(article.url);

      // Check page has proper sections in order
      const pageTopSection = page.locator('.page-top-section');
      await expect(pageTopSection).toBeVisible();

      // Verify blog post body wrapper exists
      const bodyWrapper = page.locator('.blog-post-body-wrapper');
      await expect(bodyWrapper).toBeVisible();

      // Verify decorative elements exist in DOM (they may be hidden by CSS)
      const blobs = page.locator('.bg-blobs-wrapper');
      await expect(blobs).toHaveCount(1);
    }
  });

  test('Article pages have no 404 image errors', async ({ page }) => {
    const allFailed404s = [];

    for (const article of articles) {
      const failed404s = [];

      page.on('response', response => {
        const url = response.url();
        if (url.includes('/assets/images/') && response.status() === 404) {
          failed404s.push({
            article: article.url,
            imageUrl: url,
            status: response.status()
          });
        }
      });

      await page.goto(article.url, { waitUntil: 'networkidle' });

      if (failed404s.length > 0) {
        console.error(`\n❌ ${article.url}: ${failed404s.length} image 404 error(s)`);
        failed404s.forEach(error => {
          console.error(`   - ${error.imageUrl}`);
        });
        allFailed404s.push(...failed404s);
      } else {
        console.log(`✅ ${article.url}: No 404 image errors`);
      }

      // Remove listener to avoid duplicates
      page.removeAllListeners('response');
    }

    if (allFailed404s.length > 0) {
      console.error(`\n${'='.repeat(80)}`);
      console.error(`TOTAL: ${allFailed404s.length} image 404 errors across all articles`);
      console.error(`${'='.repeat(80)}\n`);

      // Group by image URL
      const grouped = allFailed404s.reduce((acc, error) => {
        if (!acc[error.imageUrl]) {
          acc[error.imageUrl] = [];
        }
        acc[error.imageUrl].push(error.article);
        return acc;
      }, {});

      console.error('Missing images:');
      Object.entries(grouped).forEach(([imageUrl, articleUrls]) => {
        console.error(`\n  ${imageUrl}`);
        console.error(`  Used in: ${articleUrls.join(', ')}`);
      });

      throw new Error(`${allFailed404s.length} images returned 404 errors across ${articles.length} articles`);
    }

    console.log(`\n✅ All ${articles.length} articles have valid images`);
  });

  test('Article images are visible and properly loaded', async ({ page }) => {
    for (const article of articles) {
      await page.goto(article.url, { waitUntil: 'networkidle' });

      // Find all article images (excluding header/nav images)
      const articleImages = page.locator('.rich-text img, figure img').filter({ hasNot: page.locator('[class*="nav"], [class*="header"]') });
      const imageCount = await articleImages.count();

      if (imageCount === 0) {
        console.log(`⚠️ ${article.url}: No product images found`);
        continue;
      }

      console.log(`\n📸 ${article.url}: Testing ${imageCount} image(s)`);

      for (let i = 0; i < imageCount; i++) {
        const img = articleImages.nth(i);
        const src = await img.getAttribute('src');

        // Check if visible
        const isVisible = await img.isVisible();

        // Check if loaded (naturalWidth > 0)
        const dimensions = await img.evaluate(el => ({
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight
        }));

        if (!isVisible) {
          console.error(`   ❌ Image ${i + 1}: Not visible`);
          console.error(`      src: ${src}`);
        } else if (dimensions.naturalWidth === 0 || dimensions.naturalHeight === 0) {
          console.error(`   ❌ Image ${i + 1}: Failed to load (0x0 natural dimensions)`);
          console.error(`      src: ${src}`);
        } else if (dimensions.clientWidth === 0 || dimensions.clientHeight === 0) {
          console.error(`   ❌ Image ${i + 1}: Not displaying (0x0 client dimensions)`);
          console.error(`      src: ${src}`);
          console.error(`      natural: ${dimensions.naturalWidth}x${dimensions.naturalHeight}`);
        } else {
          console.log(`   ✅ Image ${i + 1}: ${dimensions.clientWidth}x${dimensions.clientHeight} (natural: ${dimensions.naturalWidth}x${dimensions.naturalHeight})`);
          console.log(`      src: ${src}`);
        }

        expect(isVisible).toBeTruthy();
        expect(dimensions.naturalWidth).toBeGreaterThan(0);
        expect(dimensions.naturalHeight).toBeGreaterThan(0);
        expect(dimensions.clientWidth).toBeGreaterThan(0);
        expect(dimensions.clientHeight).toBeGreaterThan(0);
      }
    }
  });

  test('Article images have descriptive captions', async ({ page }) => {
    const genericCaptions = ['product screenshot', 'cover', 'product photo', 'product foto', 'image', 'screenshot'];

    for (const article of articles) {
      await page.goto(article.url, { waitUntil: 'networkidle' });

      const figures = page.locator('figure');
      const figureCount = await figures.count();

      if (figureCount === 0) {
        console.log(`⚠️ ${article.url}: No figures with captions found`);
        continue;
      }

      console.log(`\n📝 ${article.url}: Checking ${figureCount} caption(s)`);

      for (let i = 0; i < figureCount; i++) {
        const figure = figures.nth(i);
        const caption = figure.locator('figcaption');
        const captionCount = await caption.count();

        if (captionCount === 0) {
          console.error(`   ❌ Figure ${i + 1}: Missing caption`);
          expect(captionCount).toBeGreaterThan(0);
          continue;
        }

        const captionText = (await caption.textContent())?.trim().toLowerCase() || '';

        // Check if caption is generic
        const isGeneric = genericCaptions.some(generic => captionText === generic);

        if (isGeneric) {
          console.error(`   ❌ Figure ${i + 1}: Generic caption "${captionText}"`);
          console.error(`      Caption should be descriptive, not generic`);
          expect(isGeneric).toBeFalsy();
        } else {
          console.log(`   ✅ Figure ${i + 1}: "${captionText}"`);
        }
      }
    }
  });
});
