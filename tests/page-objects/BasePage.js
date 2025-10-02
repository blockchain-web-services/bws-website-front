import { expect } from '@playwright/test';

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
    // In CI environments, networkidle can timeout - use domcontentloaded first
    await this.page.waitForLoadState('domcontentloaded');

    // Try networkidle but with shorter timeout and fallback
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (e) {
      // If networkidle times out, wait for load state instead
      await this.page.waitForLoadState('load');
    }
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
    const menuLink = this.navigationMenu.locator(`a:has-text("${menuItem}")`).first();

    // Ensure menu is visible and interactable (important for dropdowns)
    await menuLink.waitFor({ state: 'visible', timeout: 10000 });

    // For dropdown menus, hover first to make items visible
    const parentDropdown = this.page.locator('.nav-link-dropdown:has-text("' + menuItem + '")').first();
    const hasDropdown = await parentDropdown.count() > 0;

    if (hasDropdown) {
      // Hover over dropdown to reveal menu items
      await parentDropdown.hover();
      await this.page.waitForTimeout(500); // Wait for animation
    }

    // Click the menu item
    await menuLink.click({ timeout: 15000 });
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