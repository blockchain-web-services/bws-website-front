export interface ArticleImage {
  src: string;
  alt: string;
  loading?: string;
  sizes?: string;
  srcset?: string;
}

export interface ArticleMetadata {
  slug: string;                     // URL slug: "x-bot-community-analytics-2025-01-16"
  product: string;                  // "X Bot"
  title: string;                    // "Advanced Community Analytics for Crypto Projects"
  subtitle: string;                 // Article subtitle (40-60 words)
  publishDate: string;              // ISO date: "2025-01-16T10:00:00Z"
  tweetId: string;                  // Source tweet ID
  featuredImage?: ArticleImage;     // Main article image
  seoDescription: string;           // Meta description (150-160 chars)
}

export const articles: ArticleMetadata[] = [
{
  slug: 'x-bot-2025-12-09',
  product: 'X Bot',
  title: 'X Bot: Automated Community Analytics and KOL Tracking for Crypto Projects',
  subtitle: 'Crypto projects face a critical challenge: distinguishing authentic community growth from coordinated bot farms and manufactured hype. X Bot solves this through official X API integration that tracks 100+ KOL accounts simultaneously, delivering automated engagement analytics and bot detection that separates real traction from artificial activity.',
  publishDate: '2025-12-09T10:04:05.546Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot delivers automated community analytics for crypto projects. Track 100+ KOLs simultaneously, detect bot farms, and measure authentic engagement with official X API integration.'
},
{
  slug: 'blockchain-badges-2025-12-09',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Digital Credentials for Universities and Enterprises',
  subtitle: 'Credential fraud undermines trust in educational and professional certification systems worldwide. Forged documents and fake stamps create billion-dollar verification problems that plague institutions and employers alike. Blockchain Badges solves this through cryptographic credential verification with immutable blockchain proof, enabling universities and organizations to issue certificates that cannot be forged, altered, or disputed.',
  publishDate: '2025-12-09T10:04:19.191Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges creates tamper-proof credentials with blockchain verification. Universities issue degrees and certifications that employers can verify instantly, eliminating credential fraud.'
},
{
  slug: 'esg-credits-2025-12-09',
  product: 'ESG Credits',
  title: 'ESG Credits: ICMA-Compliant Blockchain Environmental Reporting for Banking Applications',
  subtitle: 'Financial institutions struggle to track sustainable asset performance while preventing double-counting of green investments across portfolios. ESG Credits solves this with blockchain-verified environmental impact reporting that maintains ICMA framework compliance, enabling banks to integrate cryptographically-proven sustainability metrics directly into customer applications.',
  publishDate: '2025-12-09T10:04:32.141Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits delivers blockchain-verified environmental reporting for banks with ICMA compliance. Track sustainable asset performance and prevent double-counting of green investments.'
},
{
  slug: 'fan-game-cube-2025-12-09',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT Field Tokenization and Event-Based Rewards for Sports',
  subtitle: 'Sports clubs face a persistent challenge: how to monetize fan engagement beyond traditional ticket and merchandise sales. Fan Game Cube addresses this by tokenizing field sections as NFTs, enabling fans to own specific coordinates that earn points when real match events occur at their locations. This blockchain-based approach creates entirely new revenue streams across football, chess, tennis, and cricket.',
  publishDate: '2025-12-09T10:04:41.475Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports field sections as NFTs. Fans own coordinates and earn rewards when game events occur at their locations across multiple sports.'
}
];
