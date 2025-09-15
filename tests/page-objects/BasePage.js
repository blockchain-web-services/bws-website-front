import { Page, Locator, expect } from '@playwright/test';

/**
 * Base page object containing common functionality for all pages
 */
export class BasePage {
  page;
  navigationMenu;
  footer;
  cookieBanner;

  constructor(page) {
    this.page = page;
    this.navigationMenu = page.locator('.navigation-dropdown');
    this.footer = page.locator('footer');
    this.cookieBanner = page.locator('.cookie-banner');
  }

  /**
   * Navigate to a specific path
   */
  async navigateTo(path) {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Check if the page is responsive at a given viewport size
   */
  async checkResponsiveness(width, height) {
    await this.page.setViewportSize({ width, height });
    const bodyWidth = await this.page.evaluate(() => document.body.scrollWidth);
    return bodyWidth <= width + 20; // Allow small margin for scrollbar
  }

  /**
   * Get page title
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector) {
    const element = this.page.locator(selector);
    return await element.isVisible();
  }

  /**
   * Take a screenshot for visual testing
   */
  async takeScreenshot(name) {
    return await this.page.screenshot({
      path: `tests/screenshots/${name}.png`,
      fullPage: true
    });
  }

  /**
   * Check for console errors
   */
  async checkForConsoleErrors() {
    const errors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }

  /**
   * Check for 404 errors in network requests
   */
  async check404Errors() {
    const failed404s = [];
    this.page.on('response', response => {
      if (response.status() === 404) {
        failed404s.push(response.url());
      }
    });
    return failed404s;
  }

  /**
   * Accept cookies if banner is present
   */
  async acceptCookies() {
    const cookieButton = this.page.locator('button:has-text("Accept")');
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
    }
  }

  /**
   * Navigate using the main navigation menu
   */
  async navigateViaMenu(menuItem) {
    await this.navigationMenu.locator(`a:has-text("${menuItem}")`).click();
    await this.waitForPageLoad();
  }

  /**
   * Get all image sources on the page
   */
  async getAllImageSources() {
    return await this.page.$$eval('img', images =>
      images.map(img => img.src)
    );
  }

  /**
   * Check if all images are loaded
   */
  async areAllImagesLoaded() {
    return await this.page.$$eval('img', images =>
      images.every(img => img.complete && img.naturalHeight !== 0)
    );
  }
}