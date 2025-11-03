
import { BasePage } from './BasePage.js';

/**
 * Page object for the Industries page
 */
export class IndustriesPage extends BasePage {
  industryCards;
  industryDropdown;
  contentCreationCard;
  esgCard;
  financialServicesCard;
  legalCard;
  retailCard;
  supplyChainCard;

  constructor(page) {
    super(page);
    this.industryCards = page.locator('.top-menu-industry-card');
    this.industryDropdown = page.locator('.industries-top-menu-collections-list');
    this.contentCreationCard = page.locator('[href*="content-creation"]');
    this.esgCard = page.locator('[href*="esg"]');
    this.financialServicesCard = page.locator('[href*="financial-services"]');
    this.legalCard = page.locator('[href*="legal"]');
    this.retailCard = page.locator('[href*="retail"]');
    this.supplyChainCard = page.locator('[href*="supply-chain"]');
  }

  async goto() {
    await this.navigateTo('/industries');
  }

  async hoverOverSolutions() {
    await this.page.locator('text=Solutions').first().hover();
    await this.page.waitForTimeout(1000);
  }

  async getIndustryCardsCount() {
    await this.hoverOverSolutions();
    return await this.industryCards.count();
  }

  async checkIndustryCardBackgrounds() {
    await this.hoverOverSolutions();
    const count = await this.industryCards.count();
    const results = [];

    for (let i = 0; i < count; i++) {
      const card = this.industryCards.nth(i);
      const style = await card.getAttribute('style');
      results.push(!!style && style.includes('background-image'));
    }

    return results;
  }

  async navigateToIndustry(industry) {
    await this.page.locator(`[href*="${industry}"]`).click();
    await this.waitForPageLoad();
  }
}