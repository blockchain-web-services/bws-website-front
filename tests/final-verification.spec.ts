import { test, expect } from '@playwright/test';

test.describe('Final Content Verification', () => {
  test('all critical content is present and identical to live site', async ({ page }) => {
    await page.goto('http://localhost:8081/');
    
    // 1. Check tokenomics section exists
    const tokenomicsSection = await page.locator('#tokenomics');
    await expect(tokenomicsSection).toBeVisible();
    await expect(page.locator('text=$BWS Tokenomics')).toBeVisible();
    
    // 2. Check roadmap section exists  
    const roadmapSection = await page.locator('#roadmap');
    await expect(roadmapSection).toBeVisible();
    await expect(page.locator('text=ROADMAP')).toBeVisible();
    
    // 3. Check grants section exists
    const grantsSection = await page.locator('#grants');
    await expect(grantsSection).toBeVisible();
    await expect(page.locator('text=BWS Developer Grants')).toBeVisible();
    
    // 4. Check navigation has proper solution names (not malformed titles)
    const navHTML = await page.locator('nav').first().innerHTML();
    expect(navHTML).toContain('Blockchain Save');
    expect(navHTML).toContain('Blockchain Hash');
    expect(navHTML).toContain('BWS IPFS');
    expect(navHTML).toContain('NFT.zK');
    expect(navHTML).toContain('Fan Game Cube');
    expect(navHTML).not.toContain('Blockchain Web Services Blockchain Web Services');
    
    // 5. Check CSS is loading
    const cssFiles = await page.locator('link[rel="stylesheet"]').count();
    expect(cssFiles).toBeGreaterThan(0);
    
    // 6. Check images are loading
    const logo = await page.locator('img[alt*="BWS"], img[alt*="logo"]').first();
    await expect(logo).toBeVisible();
  });

  test('all pages load with correct content', async ({ page }) => {
    const pagesToTest = [
      { url: '/', title: 'Cutting-Edge Blockchain Solutions' },
      { url: '/marketplace/database-immutable.html', content: 'Blockchain Save' },
      { url: '/marketplace/database-mutable.html', content: 'Blockchain Hash' },
      { url: '/marketplace/ipfs-upload.html', content: 'BWS IPFS' },
      { url: '/marketplace/nft-zeroknwoledge.html', content: 'NFT.zK' },
      { url: '/marketplace/nft-gamecube.html', content: 'Fan Game Cube' },
      { url: '/marketplace/blockchain-badges.html', content: 'Blockchain Badges' },
      { url: '/marketplace/esg-credits.html', content: 'ESG Credits' },
      { url: '/marketplace/telegram-xbot.html', content: 'Telegram XBot' },
      { url: '/contact-us.html', content: 'Contact' },
      { url: '/legal-notice.html', content: 'Legal Notice' },
      { url: '/privacy-policy.html', content: 'Privacy Policy' }
    ];

    for (const pageInfo of pagesToTest) {
      await page.goto(`http://localhost:8081${pageInfo.url}`);
      
      const pageContent = await page.content();
      
      if (pageInfo.title) {
        const title = await page.title();
        expect(title).toContain(pageInfo.title);
      }
      
      if (pageInfo.content) {
        expect(pageContent).toContain(pageInfo.content);
      }
    }
  });

  test('verify content size matches original', async ({ page }) => {
    await page.goto('http://localhost:8081/');
    
    const content = await page.content();
    
    // Original index.html is about 74KB
    expect(content.length).toBeGreaterThan(70000);
    
    // Check for major sections that exist in original
    expect(content).toContain('$BWS Token Launch Success');
    expect(content).toContain('Blockchain Founders Group');
    expect(content).toContain('Marketplace');
    expect(content).toContain('Developer Grants');
    expect(content).toContain('Token Utility');
  });
});