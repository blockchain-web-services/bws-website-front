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
  slug: 'x-bot-2025-12-05',
  product: 'X Bot',
  title: 'X Bot: Real-Time Community Analytics for Crypto Projects on X and Telegram',
  subtitle: 'Crypto projects struggle to measure authentic community engagement across platforms. X Bot solves this with automated tracking, KOL analytics, and bot farm detection, delivering verifiable metrics that help projects understand real traction and investors discover genuine communities.',
  publishDate: '2025-12-05T10:04:24.694Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot delivers automated community analytics for crypto projects. Track KOL performance, detect bot farms, and measure authentic engagement across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-12-05',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Digital Credentials with Immutable Verification',
  subtitle: 'Universities and organizations face a critical challenge: creating verifiable credentials that resist forgery and alteration. Blockchain Badges solves this by issuing tamper-proof digital certificates with blockchain certification, enabling institutions to create, manage, and verify credentials that provide permanent proof of authenticity.',
  publishDate: '2025-12-05T10:04:37.095Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges creates tamper-proof digital credentials with blockchain verification. Universities issue verifiable certificates using bulk API for permanent authenticity proof.'
},
{
  slug: 'esg-credits-2025-12-05',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Financial Institutions',
  subtitle: 'Financial institutions need transparent, verifiable environmental impact data integrated into their systems. ESG Credits enables banks to incorporate blockchain-verified green asset reporting directly into banking applications, supporting ICMA frameworks while preventing double-counting of environmental credits.',
  publishDate: '2025-12-05T10:04:55.324Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits delivers blockchain-verified environmental reporting for banks. ICMA-compliant green asset tracking prevents double-counting with transparent impact data.'
},
{
  slug: 'fan-game-cube-2025-12-05',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Based Fan Engagement Platform for Sports Monetization',
  subtitle: 'Sports clubs struggle to monetize fan engagement beyond game day. Fan Game Cube solves this challenge by enabling fans to own digital field sections as NFTs, earning points when real-time game events occur at their locations across football, chess, tennis, and cricket.',
  publishDate: '2025-12-05T10:05:10.229Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube creates sports club revenue through NFT field zones. Fans earn points from real-time game events at owned locations across multiple sports.'
}
];
