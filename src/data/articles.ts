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
  slug: 'x-bot-2025-10-27',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Analytics for Crypto Projects',
  subtitle: 'Managing community engagement across X (Twitter) and Telegram is time-consuming for crypto projects. X Bot delivers automated tracking, real-time analytics, and KOL performance monitoring to help projects build engaged communities without manual overhead.',
  publishDate: '2025-10-27T10:04:24.450Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-10-27',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Learning and Achievement',
  subtitle: 'Traditional digital certifications lack verifiability and portability. Blockchain Badges delivers Web3-native digital credentials that can be awarded for event participation, learning rewards, and achievement unlocks, creating a trust layer for HR tech, events, and learning platforms.',
  publishDate: '2025-10-27T10:04:38.134Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps organizations issue verifiable Web3-native digital credentials for learning, events, and professional achievements without blockchain expertise.'
},
{
  slug: 'esg-credits-2025-10-27',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Finance Reporting and Impact Verification',
  subtitle: 'Green finance lacks standardized impact reporting and verification. ESG Credits automates ESG alignment, standardizes disclosures, and enables transparent investor-grade reporting—all underpinned by immutable blockchain records that certify sustainability impact.',
  publishDate: '2025-10-27T10:04:52.740Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761559509022.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Finance Reporting and Impact Verification',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits enables blockchain-verified sustainability reporting, green bond framework comparison, and automated ESG alignment for global portfolios and carbon markets.'
},
{
  slug: 'fan-game-cube-2025-10-27',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Virtual Field Ownership for Sports Clubs',
  subtitle: 'Sports clubs need new digital revenue streams while deepening fan engagement. Fan Game Cube delivers both by letting fans own virtual zones of real fields through NFTs tied to live in-game events—creating immersive experiences without requiring any crypto knowledge.',
  publishDate: '2025-10-27T10:05:09.072Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Discover how Fan Game Cube uses NFTs to let sports fans own virtual field zones tied to real game events, creating new revenue for clubs and engagement for fans.'
}
];
