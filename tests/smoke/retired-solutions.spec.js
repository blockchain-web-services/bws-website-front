import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const testData = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'fixtures', 'test-data.json'),
    'utf-8'
  )
);

/**
 * Retired Solutions Tombstone Tests
 *
 * IPFS, Blockchain Database, and NFT.zK were retired. Their URLs are kept as
 * noindex tombstones rather than 404s so inbound links degrade into an
 * explanation. These tests lock in that contract.
 *
 * See PRODUCT_DEPRECATION_PLAN.md.
 */

const retiredPages = Object.entries(testData.urls.retiredPages);

test.describe('Retired Solutions', () => {
  retiredPages.forEach(([name, path]) => {
    test(`${name} serves a tombstone, not a 404`, async ({ page }) => {
      const response = await page.goto(`${path}.html`);
      expect(response?.status()).toBeLessThan(400);

      // Must be excluded from search results.
      const robots = await page.locator('meta[name="robots"]').getAttribute('content');
      expect(robots).toContain('noindex');

      // Must explain itself rather than look broken.
      const h1 = (await page.locator('h1').first().textContent())?.trim();
      expect(h1).toBeTruthy();
      expect(h1).toMatch(/retired|standalone/i);

      await expect(page).not.toHaveTitle(/404/);
    });
  });

  test('no live page links to a retired solution', async ({ page }) => {
    for (const surface of ['/', '/about.html', '/resources.html']) {
      await page.goto(surface);
      for (const [, path] of retiredPages) {
        const count = await page.locator(`a[href^="${path}"]`).count();
        expect(count, `${surface} still links to ${path}`).toBe(0);
      }
    }
  });

  test('retired solutions are absent from the sitemap', async ({ request }) => {
    const res = await request.get('/sitemap-0.xml');
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();
    for (const [, path] of retiredPages) {
      expect(xml, `sitemap still lists ${path}`).not.toContain(path);
    }
  });
});
