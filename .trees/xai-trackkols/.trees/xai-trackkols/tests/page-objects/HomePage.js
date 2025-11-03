
import { BasePage } from './BasePage.js';

/**
 * Page object for the homepage
 */
export class HomePage extends BasePage {
  heroSection;
  partnerLogosSection;
  tokenomicsSection;
  proofLogo;
  assureDefiLogo;
  bfgLogo;
  tokenomicsImage;
  ctaButton;
  videoSection;
  featuresSection;

  constructor(page) {
    super(page);

    // Hero section
    this.heroSection = page.locator('.hero-section');
    this.ctaButton = page.locator('.primary-button-white-2');

    // Partner logos
    this.partnerLogosSection = page.locator('.announcement-flex-logos');
    this.proofLogo = page.locator('img[src*="PROOF-logo"]').first();
    this.assureDefiLogo = page.locator('img[src*="AssureDefi"]').first();
    this.bfgLogo = page.locator('img[src*="blockchain-founders-group"]').first();

    // Tokenomics
    this.tokenomicsSection = page.locator('#tokenomics');
    this.tokenomicsImage = page.locator('img[src*="Tokenomics"]').first();

    // Other sections
    this.videoSection = page.locator('.hero-column-image');
    this.featuresSection = page.locator('.values-white-section');
  }

  /**
   * Navigate to homepage
   */
  async goto() {
    await this.navigateTo('/');
  }

  /**
   * Check if hero section is visible
   */
  async isHeroVisible() {
    return await this.heroSection.isVisible();
  }

  /**
   * Check if all partner logos are visible
   */
  async arePartnerLogosVisible() {
    const proofVisible = await this.proofLogo.isVisible();
    const assureVisible = await this.assureDefiLogo.isVisible();
    const bfgVisible = await this.bfgLogo.isVisible();
    return proofVisible && assureVisible && bfgVisible;
  }

  /**
   * Get partner logos count
   */
  async getPartnerLogosCount() {
    return await this.partnerLogosSection.locator('img').count();
  }

  /**
   * Scroll to tokenomics section
   */
  async scrollToTokenomics() {
    await this.tokenomicsSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000); // Wait for scroll animation
  }

  /**
   * Check if tokenomics image is visible
   */
  async isTokenomicsImageVisible() {
    await this.scrollToTokenomics();
    return await this.tokenomicsImage.isVisible();
  }

  /**
   * Get tokenomics image dimensions
   */
  async getTokenomicsImageDimensions() {
    return await this.tokenomicsImage.evaluate((img) => ({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: img.clientWidth,
      displayHeight: img.clientHeight
    }));
  }

  /**
   * Check AssureDefi logo dimensions
   */
  async checkAssureDefiLogoDimensions() {
    const box = await this.assureDefiLogo.boundingBox();
    return {
      width: box?.width || 0,
      height: box?.height || 0,
      // AssureDefi uses height:120px, width auto-adjusts based on aspect ratio
      isCorrectSize: (box?.height || 0) <= 120
    };
  }

  /**
   * Check PROOF logo dimensions
   */
  async checkProofLogoDimensions() {
    const box = await this.proofLogo.boundingBox();
    return {
      width: box?.width || 0,
      height: box?.height || 0,
      // PROOF uses width:150px, height auto-adjusts based on aspect ratio
      isCorrectSize: (box?.width || 0) <= 150
    };
  }

  /**
   * Check BFG logo dimensions
   */
  async checkBFGLogoDimensions() {
    const box = await this.bfgLogo.boundingBox();
    return {
      width: box?.width || 0,
      height: box?.height || 0,
      isCorrectSize: (box?.width || 0) <= 150
    };
  }

  /**
   * Click CTA button
   */
  async clickCTA() {
    await this.ctaButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Check if video is playing
   */
  async isVideoPlaying() {
    const video = this.page.locator('video').first();
    if (await video.count() === 0) return false;

    return await video.evaluate((vid) =>
      !vid.paused && !vid.ended && vid.readyState > 2
    );
  }

  /**
   * Get all feature cards
   */
  async getFeatureCards() {
    return await this.featuresSection.locator('.values-card-white').count();
  }

  /**
   * Check specific image loading
   */
  async checkImageLoading(imageName) {
    const img = this.page.locator(`img[src*="${imageName}"]`).first();
    if (await img.count() === 0) return false;

    return await img.evaluate((image) =>
      image.complete && image.naturalWidth > 0
    );
  }
}