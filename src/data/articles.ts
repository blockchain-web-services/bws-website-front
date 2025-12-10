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
  title: 'X Bot: Automate Community Tracking and KOL Analytics for Crypto Projects',
  subtitle: 'Managing crypto communities and identifying authentic engagement is challenging when bot farms manipulate metrics. X Bot tracks engagement across X and Telegram using official APIs, providing real-time analytics and KOL monitoring to help projects distinguish genuine traction from manufactured hype.',
  publishDate: '2025-12-10T17:57:49.217Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot tracks crypto community engagement across X and Telegram with official APIs. Monitor 100+ KOLs, detect bot farms, and get automated analytics reports.'
},
{
  slug: 'blockchain-badges-2025-12-10',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Digital Credentials with Immutable Verification',
  subtitle: 'Credential fraud undermines trust in educational and professional certifications, costing institutions billions annually. Blockchain Badges provides universities and organizations with tamper-proof digital credentials backed by immutable blockchain proof, enabling instant verification and eliminating forgery.',
  publishDate: '2025-12-10T17:58:04.093Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides tamper-proof digital credentials with blockchain verification. Universities issue bulk credentials with visual designer and instant verification.'
},
{
  slug: 'esg-credits-2025-12-10',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Financial Institutions',
  subtitle: 'Financial institutions face mounting pressure to provide verifiable environmental impact reporting that prevents greenwashing and double-counting of sustainable investments. ESG Credits delivers blockchain-verified environmental data with ICMA framework compliance, enabling banks to integrate cryptographic proof directly into customer-facing applications.',
  publishDate: '2025-12-10T17:58:19.485Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-verified environmental reporting for banks. ICMA framework compliance prevents greenwashing and double-counting of sustainable investments.'
},
{
  slug: 'fan-game-cube-2025-12-10',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenized Sports Field Engagement and NFT Rewards',
  subtitle: 'Sports clubs are searching for innovative revenue streams beyond traditional ticketing and merchandise. Fan Game Cube transforms this landscape by tokenizing field sections as NFTs, enabling fans to own specific coordinates and earn real rewards when match events occur at their locations across football, chess, tennis, and cricket.',
  publishDate: '2025-12-10T17:58:34.406Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports field sections as NFTs. Fans own coordinates and earn rewards when match events occur at their locations across multiple sports.'
}
];
