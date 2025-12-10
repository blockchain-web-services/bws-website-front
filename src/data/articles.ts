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
  slug: 'x-bot-2025-12-10',
  product: 'X Bot',
  title: 'X Bot: Automate Community Analytics and KOL Tracking for Web3',
  subtitle: 'Managing crypto community engagement across multiple platforms while identifying authentic growth from bot farms is nearly impossible manually. X Bot automates KOL tracking, engagement scoring, and bot detection across X and Telegram using official API integration, delivering daily analytics reports that separate real traction from manufactured hype.',
  publishDate: '2025-12-10T17:09:31.080Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot automates community management for Web3 projects with KOL tracking, engagement analytics, and bot detection across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-12-10',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Digital Credentials with Immutable Verification',
  subtitle: 'Credential fraud costs organizations billions annually as fake degrees and forged certificates undermine trust in educational and professional systems. Blockchain Badges provides universities and companies with tamper-proof digital credentials backed by immutable blockchain proof, enabling instant verification that cannot be faked or altered.',
  publishDate: '2025-12-10T17:09:43.301Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges provides tamper-proof digital credentials with blockchain verification for universities and organizations to prevent fraud.'
},
{
  slug: 'esg-credits-2025-12-10',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Banking',
  subtitle: 'Financial institutions face a critical challenge: environmental impact reporting that lacks cryptographic proof and enables double-counting of green investments. ESG Credits solves this with blockchain-verified environmental impact reporting and ICMA framework compliance, enabling banks to integrate immutable sustainable asset tracking directly into their applications.',
  publishDate: '2025-12-10T17:09:55.406Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'Explore how ESG Credits delivers blockchain-verified environmental impact reporting with ICMA compliance for financial institutions and banking applications.'
},
{
  slug: 'fan-game-cube-2025-12-10',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenized Sports Field Ownership and Match-Based Rewards',
  subtitle: 'Sports clubs struggle to monetize fan engagement beyond traditional ticket and merchandise sales. Fan Game Cube transforms this landscape by tokenizing sports field sections as NFTs across football, chess, tennis, and cricket. Fans own specific coordinates and earn rewards when real match events occur at their locations, unlocking new revenue streams through blockchain-powered fan engagement.',
  publishDate: '2025-12-10T17:10:08.502Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how Fan Game Cube tokenizes sports field sections as NFTs where fans earn rewards from real match events across football, chess, tennis, and cricket.'
}
];
