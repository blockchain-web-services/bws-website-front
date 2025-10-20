# Visual Snapshots - BWS Website

This document contains visual snapshots of all pages across different viewport sizes to facilitate mobile CSS review and responsive design improvements.

## Overview

- **Total Pages**: 26
- **Viewports per Page**: 4 (Desktop, iPhone SE, iPhone 12 Pro, Pixel 5)
- **Total Snapshots**: 104 (101 currently available)
- **Last Updated**: 2025-10-20 (from GitHub Actions Run #18663268326)

> **Note**: Homepage mobile snapshots (index - iphone-se, iphone-12-pro, pixel-5) are currently unavailable due to GPU limitations in CI environment. All other snapshots (101/104) have been successfully generated.

## Viewport Sizes

| Viewport | Width | Height | Purpose |
|----------|-------|--------|---------|
| Desktop | 1920px | 1080px | Standard desktop view |
| iPhone SE | 375px | 667px | Small mobile (compact testing) |
| iPhone 12 Pro | 390px | 844px | Standard modern mobile |
| Pixel 5 | 393px | 851px | Android mobile reference |

## How to Use This Document

1. **Visual Comparison**: Compare desktop vs mobile layouts side-by-side
2. **Mobile CSS Issues**: Identify spacing, overflow, or layout problems on mobile
3. **Responsive Testing**: Verify elements adapt correctly across viewport sizes
4. **Documentation**: Reference visuals when discussing design or layout issues

## Regenerating Snapshots

```bash
# Local generation
npm run snapshot

# Update all snapshots
npm run snapshot:update

# Automatic via GitHub Actions
# Snapshots auto-update on push to main
```

---

## Main Pages

### Homepage (/)
[Source: src/pages/index.astro](../src/pages/index.astro) | [Live](https://www.bws.ninja/)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/main/index/desktop.png) | ![iPhone SE](screenshots/main/index/iphone-se.png) | ![iPhone 12 Pro](screenshots/main/index/iphone-12-pro.png) | ![Pixel 5](screenshots/main/index/pixel-5.png) |

---

### About
[Source: src/pages/about.astro](../src/pages/about.astro) | [Live](https://www.bws.ninja/about)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/main/about/desktop.png) | ![iPhone SE](screenshots/main/about/iphone-se.png) | ![iPhone 12 Pro](screenshots/main/about/iphone-12-pro.png) | ![Pixel 5](screenshots/main/about/pixel-5.png) |

---

### Contact Us
[Source: src/pages/contact-us.astro](../src/pages/contact-us.astro) | [Live](https://www.bws.ninja/contact-us)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/main/contact-us/desktop.png) | ![iPhone SE](screenshots/main/contact-us/iphone-se.png) | ![iPhone 12 Pro](screenshots/main/contact-us/iphone-12-pro.png) | ![Pixel 5](screenshots/main/contact-us/pixel-5.png) |

---

### Industries
[Source: src/pages/industries.astro](../src/pages/industries.astro) | [Live](https://www.bws.ninja/industries)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/main/industries/desktop.png) | ![iPhone SE](screenshots/main/industries/iphone-se.png) | ![iPhone 12 Pro](screenshots/main/industries/iphone-12-pro.png) | ![Pixel 5](screenshots/main/industries/pixel-5.png) |

---

### Resources
[Source: src/pages/resources.astro](../src/pages/resources.astro) | [Live](https://www.bws.ninja/resources)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/main/resources/desktop.png) | ![iPhone SE](screenshots/main/resources/iphone-se.png) | ![iPhone 12 Pro](screenshots/main/resources/iphone-12-pro.png) | ![Pixel 5](screenshots/main/resources/pixel-5.png) |

---

### White Paper
[Source: src/pages/white-paper.astro](../src/pages/white-paper.astro) | [Live](https://www.bws.ninja/white-paper)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/main/white-paper/desktop.png) | ![iPhone SE](screenshots/main/white-paper/iphone-se.png) | ![iPhone 12 Pro](screenshots/main/white-paper/iphone-12-pro.png) | ![Pixel 5](screenshots/main/white-paper/pixel-5.png) |

---

### Legal Notice
[Source: src/pages/legal-notice.astro](../src/pages/legal-notice.astro) | [Live](https://www.bws.ninja/legal-notice)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/main/legal-notice/desktop.png) | ![iPhone SE](screenshots/main/legal-notice/iphone-se.png) | ![iPhone 12 Pro](screenshots/main/legal-notice/iphone-12-pro.png) | ![Pixel 5](screenshots/main/legal-notice/pixel-5.png) |

---

### Privacy Policy
[Source: src/pages/privacy-policy.astro](../src/pages/privacy-policy.astro) | [Live](https://www.bws.ninja/privacy-policy)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/main/privacy-policy/desktop.png) | ![iPhone SE](screenshots/main/privacy-policy/iphone-se.png) | ![iPhone 12 Pro](screenshots/main/privacy-policy/iphone-12-pro.png) | ![Pixel 5](screenshots/main/privacy-policy/pixel-5.png) |

---

## Industry Content Pages

### Content Creation
[Source: src/pages/industry-content/content-creation.astro](../src/pages/industry-content/content-creation.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/industry-content/content-creation/desktop.png) | ![iPhone SE](screenshots/industry-content/content-creation/iphone-se.png) | ![iPhone 12 Pro](screenshots/industry-content/content-creation/iphone-12-pro.png) | ![Pixel 5](screenshots/industry-content/content-creation/pixel-5.png) |

---

### ESG
[Source: src/pages/industry-content/esg.astro](../src/pages/industry-content/esg.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/industry-content/esg/desktop.png) | ![iPhone SE](screenshots/industry-content/esg/iphone-se.png) | ![iPhone 12 Pro](screenshots/industry-content/esg/iphone-12-pro.png) | ![Pixel 5](screenshots/industry-content/esg/pixel-5.png) |

---

### Financial Services
[Source: src/pages/industry-content/financial-services.astro](../src/pages/industry-content/financial-services.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/industry-content/financial-services/desktop.png) | ![iPhone SE](screenshots/industry-content/financial-services/iphone-se.png) | ![iPhone 12 Pro](screenshots/industry-content/financial-services/iphone-12-pro.png) | ![Pixel 5](screenshots/industry-content/financial-services/pixel-5.png) |

---

### Legal
[Source: src/pages/industry-content/legal.astro](../src/pages/industry-content/legal.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/industry-content/legal/desktop.png) | ![iPhone SE](screenshots/industry-content/legal/iphone-se.png) | ![iPhone 12 Pro](screenshots/industry-content/legal/iphone-12-pro.png) | ![Pixel 5](screenshots/industry-content/legal/pixel-5.png) |

---

### Retail
[Source: src/pages/industry-content/retail.astro](../src/pages/industry-content/retail.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/industry-content/retail/desktop.png) | ![iPhone SE](screenshots/industry-content/retail/iphone-se.png) | ![iPhone 12 Pro](screenshots/industry-content/retail/iphone-12-pro.png) | ![Pixel 5](screenshots/industry-content/retail/pixel-5.png) |

---

### Supply Chain
[Source: src/pages/industry-content/supply-chain.astro](../src/pages/industry-content/supply-chain.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/industry-content/supply-chain/desktop.png) | ![iPhone SE](screenshots/industry-content/supply-chain/iphone-se.png) | ![iPhone 12 Pro](screenshots/industry-content/supply-chain/iphone-12-pro.png) | ![Pixel 5](screenshots/industry-content/supply-chain/pixel-5.png) |

---

## Marketplace Pages

### Blockchain Badges
[Source: src/pages/marketplace/blockchain-badges.astro](../src/pages/marketplace/blockchain-badges.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/marketplace/blockchain-badges/desktop.png) | ![iPhone SE](screenshots/marketplace/blockchain-badges/iphone-se.png) | ![iPhone 12 Pro](screenshots/marketplace/blockchain-badges/iphone-12-pro.png) | ![Pixel 5](screenshots/marketplace/blockchain-badges/pixel-5.png) |

---

### Database Immutable
[Source: src/pages/marketplace/database-immutable.astro](../src/pages/marketplace/database-immutable.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/marketplace/database-immutable/desktop.png) | ![iPhone SE](screenshots/marketplace/database-immutable/iphone-se.png) | ![iPhone 12 Pro](screenshots/marketplace/database-immutable/iphone-12-pro.png) | ![Pixel 5](screenshots/marketplace/database-immutable/pixel-5.png) |

---

### Database Mutable
[Source: src/pages/marketplace/database-mutable.astro](../src/pages/marketplace/database-mutable.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/marketplace/database-mutable/desktop.png) | ![iPhone SE](screenshots/marketplace/database-mutable/iphone-se.png) | ![iPhone 12 Pro](screenshots/marketplace/database-mutable/iphone-12-pro.png) | ![Pixel 5](screenshots/marketplace/database-mutable/pixel-5.png) |

---

### ESG Credits
[Source: src/pages/marketplace/esg-credits.astro](../src/pages/marketplace/esg-credits.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/marketplace/esg-credits/desktop.png) | ![iPhone SE](screenshots/marketplace/esg-credits/iphone-se.png) | ![iPhone 12 Pro](screenshots/marketplace/esg-credits/iphone-12-pro.png) | ![Pixel 5](screenshots/marketplace/esg-credits/pixel-5.png) |

---

### IPFS Upload
[Source: src/pages/marketplace/ipfs-upload.astro](../src/pages/marketplace/ipfs-upload.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/marketplace/ipfs-upload/desktop.png) | ![iPhone SE](screenshots/marketplace/ipfs-upload/iphone-se.png) | ![iPhone 12 Pro](screenshots/marketplace/ipfs-upload/iphone-12-pro.png) | ![Pixel 5](screenshots/marketplace/ipfs-upload/pixel-5.png) |

---

### NFT GameCube
[Source: src/pages/marketplace/nft-gamecube.astro](../src/pages/marketplace/nft-gamecube.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/marketplace/nft-gamecube/desktop.png) | ![iPhone SE](screenshots/marketplace/nft-gamecube/iphone-se.png) | ![iPhone 12 Pro](screenshots/marketplace/nft-gamecube/iphone-12-pro.png) | ![Pixel 5](screenshots/marketplace/nft-gamecube/pixel-5.png) |

---

### NFT Zero Knowledge
[Source: src/pages/marketplace/nft-zeroknwoledge.astro](../src/pages/marketplace/nft-zeroknwoledge.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/marketplace/nft-zeroknowledge/desktop.png) | ![iPhone SE](screenshots/marketplace/nft-zeroknowledge/iphone-se.png) | ![iPhone 12 Pro](screenshots/marketplace/nft-zeroknowledge/iphone-12-pro.png) | ![Pixel 5](screenshots/marketplace/nft-zeroknowledge/pixel-5.png) |

---

### Telegram XBot
[Source: src/pages/marketplace/telegram-xbot.astro](../src/pages/marketplace/telegram-xbot.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/marketplace/telegram-xbot/desktop.png) | ![iPhone SE](screenshots/marketplace/telegram-xbot/iphone-se.png) | ![iPhone 12 Pro](screenshots/marketplace/telegram-xbot/iphone-12-pro.png) | ![Pixel 5](screenshots/marketplace/telegram-xbot/pixel-5.png) |

---

## Article Pages

### X Bot Article
[Source: src/pages/articles/x-bot-2025-10-20.astro](../src/pages/articles/x-bot-2025-10-20.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/articles/article-x-bot/desktop.png) | ![iPhone SE](screenshots/articles/article-x-bot/iphone-se.png) | ![iPhone 12 Pro](screenshots/articles/article-x-bot/iphone-12-pro.png) | ![Pixel 5](screenshots/articles/article-x-bot/pixel-5.png) |

---

### Blockchain Badges Article
[Source: src/pages/articles/blockchain-badges-2025-10-20.astro](../src/pages/articles/blockchain-badges-2025-10-20.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/articles/article-blockchain-badges/desktop.png) | ![iPhone SE](screenshots/articles/article-blockchain-badges/iphone-se.png) | ![iPhone 12 Pro](screenshots/articles/article-blockchain-badges/iphone-12-pro.png) | ![Pixel 5](screenshots/articles/article-blockchain-badges/pixel-5.png) |

---

### ESG Credits Article
[Source: src/pages/articles/esg-credits-2025-10-20.astro](../src/pages/articles/esg-credits-2025-10-20.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/articles/article-esg-credits/desktop.png) | ![iPhone SE](screenshots/articles/article-esg-credits/iphone-se.png) | ![iPhone 12 Pro](screenshots/articles/article-esg-credits/iphone-12-pro.png) | ![Pixel 5](screenshots/articles/article-esg-credits/pixel-5.png) |

---

### Fan Game Cube Article
[Source: src/pages/articles/fan-game-cube-2025-10-20.astro](../src/pages/articles/fan-game-cube-2025-10-20.astro)

| Desktop (1920×1080) | iPhone SE (375×667) | iPhone 12 Pro (390×844) | Pixel 5 (393×851) |
|---------------------|---------------------|-------------------------|-------------------|
| ![Desktop](screenshots/articles/article-fan-game-cube/desktop.png) | ![iPhone SE](screenshots/articles/article-fan-game-cube/iphone-se.png) | ![iPhone 12 Pro](screenshots/articles/article-fan-game-cube/iphone-12-pro.png) | ![Pixel 5](screenshots/articles/article-fan-game-cube/pixel-5.png) |

---

## Notes for Mobile CSS Review

### Common Mobile Issues to Check
- Header/navigation responsiveness
- Text overflow or truncation
- Image scaling and aspect ratios
- Button and link touch targets (minimum 44×44px)
- Form input sizing and spacing
- Footer layout and link accessibility
- Horizontal scrolling (should not occur)
- Excessive whitespace or cramped layouts

### Testing Checklist
- [ ] Navigation menu works on all mobile viewports
- [ ] All images load and scale appropriately
- [ ] Text is readable without horizontal scrolling
- [ ] CTAs and buttons are easily tappable
- [ ] Forms are usable on small screens
- [ ] No content is cut off or hidden
- [ ] Spacing is consistent across viewports
- [ ] Tables and data grids are responsive

### Updating Snapshots
Snapshots are automatically regenerated when changes are pushed to the main branch. To manually regenerate:

```bash
cd tests
npm run test:snapshot
```

The GitHub Action workflow will commit updated screenshots back to the repository automatically.
