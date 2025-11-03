import { BasePage } from './BasePage.js';

/**
 * Page object for the About page
 */
export class AboutPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = page.locator('h1').first();
    this.contentSection = page.locator('.main-content');
  }

  async goto() {
    await this.navigateTo('/about.html');
  }

  async getPageTitleText() {
    return await this.pageTitle.textContent() || '';
  }
}
