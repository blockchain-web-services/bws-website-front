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
function discoverArticles() {
  if (!fs.existsSync(articlesDir)) {
    console.warn(`Articles directory not found: ${articlesDir}`);
    return [];
  }

  const articleFiles = fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.html'))
    .map(filename => {
      // Extract slug from filename (e.g., "blockchain-badges-2025-10-20.html" -> "blockchain-badges")
      const match = filename.match(/^(.+?)-\d{4}-\d{2}-\d{2}\.html$/);
      if (!match) return null;

      const slug = match[1];
      const metadata = articleMetadata[slug];

      if (!metadata) {
        console.warn(`No metadata found for article slug: ${slug}`);
        return null;
      }

      return {
        url: `/articles/${filename}`,
        slug: slug,
        title: metadata.title
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
    test(`${article.slug} - loads and displays correctly`, async ({ page }) => {
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
});
