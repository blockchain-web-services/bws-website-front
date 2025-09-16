
import { BasePage } from './BasePage.js';

/**
 * Page object for Marketplace pages
 */
export class MarketplacePage extends BasePage {
  productTitle;
  productDescription;
  ctaButton;
  featuresSection;
  pricingSection;

  constructor(page) {
    super(page);
    this.productTitle = page.locator('h1').first();
    this.productDescription = page.locator('.product-description');
    this.ctaButton = page.locator('.primary-button');
    this.featuresSection = page.locator('.features-section');
    this.pricingSection = page.locator('.pricing-section');
  }

  async gotoProduct(productSlug) {
    await this.navigateTo(`/marketplace/${productSlug}`);
  }

  async getProductTitle() {
    return await this.productTitle.textContent() || '';
  }

  async isFeaturesVisible() {
    return await this.featuresSection.isVisible();
  }

  async clickCTA() {
    await this.ctaButton.click();
  }
}