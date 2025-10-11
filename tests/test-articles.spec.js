import { test, expect } from '@playwright/test';

test.describe('Articles Pages', () => {
  const articles = [
    {
      url: '/articles/discover-the-power-of-blockchain-bwss-data-management-solutions.html',
      title: 'Discover the Power of Blockchain: BWS\'s Data Management Solutions',
      contentSnippet: 'BWS.Blockchain.Save'
    },
    {
      url: '/articles/embrace-sustainability-with-esg-credits-bws-solution.html',
      title: 'Embrace Sustainability with ESG.Credits BWS Solution',
      contentSnippet: 'ESG.Credits'
    },
    {
      url: '/articles/investment-impact-reporting-unlocking-a-sustainable-future.html',
      title: 'Investment Impact Reporting: Unlocking a Sustainable Future',
      contentSnippet: 'investment impact reporting'
    }
  ];

  for (const article of articles) {
    test(`${article.title} - loads and displays correctly`, async ({ page }) => {
      await page.goto(article.url);

      // Check title is present
      await expect(page.locator('h1.blog-post-title')).toContainText(article.title);

      // Check navigation is present (use first nav element to avoid strict mode)
      await expect(page.locator('nav').first()).toBeVisible();

      // Check article content is visible (use .blog-post-body-wrapper to be more specific)
      await expect(page.locator('.blog-post-body-wrapper .rich-text')).toBeVisible();

      // Check specific content snippet exists in main article body
      await expect(page.locator('.blog-post-body-wrapper')).toContainText(article.contentSnippet);

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
