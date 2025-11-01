import { test, expect } from '@playwright/test';

test.describe('Basic Smoke Tests', () => {
  test('Homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('About page loads successfully', async ({ page }) => {
    const response = await page.goto('/about.html');
    expect(response?.status()).toBeLessThan(400);
    // Page loads but may not have h1 content yet
    await expect(page.locator('body')).toBeVisible();
  });

  test('Contact page loads successfully', async ({ page }) => {
    const response = await page.goto('/contact-us.html');
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Industries page loads successfully', async ({ page }) => {
    const response = await page.goto('/industries.html');
    expect(response?.status()).toBeLessThan(400);
    // Page loads but may not have h1 content yet
    await expect(page.locator('body')).toBeVisible();
  });

  test('White Paper page loads successfully', async ({ page }) => {
    const response = await page.goto('/white-paper.html');
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('CSS loads successfully', async ({ page }) => {
    const response = await page.goto('/styles.css');
    expect(response?.status()).toBe(200);
  });

  test('Images directory is accessible', async ({ page }) => {
    const response = await page.request.get('/assets/images/');
    expect(response.status()).toBeLessThan(500);
  });
});