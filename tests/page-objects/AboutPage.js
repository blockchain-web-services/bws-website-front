
import { BasePage } from './BasePage';

/**
 * Page object for the About page
 */
export class AboutPage extends BasePage {
  pageTitle;
  teamSection;
  missionSection;
  visionSection;

  constructor(page) {
    super(page);
    this.pageTitle = page.locator('h1').first();
    this.teamSection = page.locator('.team-section');
    this.missionSection = page.locator('.mission-section');
    this.visionSection = page.locator('.vision-section');
  }

  async goto() {
    await this.navigateTo('/about');
  }

  async getPageHeading() {
    return await this.pageTitle.textContent() || '';
  }

  async isTeamSectionVisible() {
    return await this.teamSection.isVisible();
  }
}