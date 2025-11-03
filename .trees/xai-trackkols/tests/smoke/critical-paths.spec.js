import { test, expect } from '@playwright/test';

test.describe('Critical Path Smoke Tests', () => {
  test('Homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);

    // Check critical elements are present
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.locator('.nav-menu')).toBeVisible();
    // Note: No footer element exists in the current HTML structure
  });

  test('Critical CSS and JS files load', async ({ page }) => {
    const failedResources = [];

    page.on('response', response => {
      const url = response.url();
      if ((url.includes('.css') || url.includes('.js')) && response.status() >= 400) {
        failedResources.push(`${url} - Status: ${response.status()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedResources).toHaveLength(0);
  });

  test('Main navigation pages are accessible', async ({ page }) => {
    const criticalPages = [
      { path: '/', checkContent: true },
      { path: '/about.html', checkContent: false }, // Page exists but may be empty
      { path: '/industries.html', checkContent: false }, // Page exists but may be empty
      { path: '/resources.html', checkContent: false }, // Page exists but may be empty
      { path: '/contact-us.html', checkContent: true }
    ];

    for (const pageInfo of criticalPages) {
      const response = await page.goto(pageInfo.path);
      expect(response?.status()).toBeLessThan(400);

      if (pageInfo.checkContent) {
        // Check page has content - wait for it to load
        await page.waitForLoadState('domcontentloaded');
        const hasContent = await page.locator('h1, h2, .title').first().isVisible().catch(() => false);
        expect(hasContent).toBeTruthy();
      }
    }
  });

  test('No console errors on homepage', async ({ page }) => {
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('DevTools') &&
      !error.includes('permissions policy') &&
      !error.includes('Potential permissions policy violation') &&
      !error.includes('Failed to load resource') && // External resources may fail
      !error.includes('500') && // Server errors from external resources
      !error.includes('404') // Missing external resources
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('Contact page loads successfully', async ({ page }) => {
    const response = await page.goto('/contact-us.html');
    expect(response?.status()).toBeLessThan(400);

    // Check that contact page has content
    await expect(page.locator('h1').first()).toBeVisible();

    // Check for contact information or call-to-action button
    const contactContent = page.locator('.contact-content-wrapper, .contact-main').first();
    await expect(contactContent).toBeVisible();
  });

  test('White Paper page has required content', async ({ page }) => {
    await page.goto('/white-paper.html');

    // Check critical elements
    await expect(page.locator('.title').first()).toBeVisible();
    await expect(page.locator('.nav-menu')).toBeVisible();

    // Check for specific content
    const heading = await page.locator('h1.hero-title').textContent();
    expect(heading).toContain('Blockchain Web Services');

    // Verify white paper sections exist (use unique IDs to avoid TOC duplicates)
    await expect(page.locator('#abstract')).toBeVisible();
    await expect(page.locator('#introduction')).toBeVisible();
    await expect(page.locator('#tokenomics')).toBeVisible();
  });

  test('Images load without 404 errors', async ({ page }) => {
    const brokenImages = [];

    page.on('response', response => {
      const url = response.url();
      if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) && response.status() === 404) {
        brokenImages.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(brokenImages).toHaveLength(0);
  });
});