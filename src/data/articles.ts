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
  slug: 'x-bot-2025-11-10',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Performance Analytics',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and manual effort. X Bot eliminates this burden with automated mention tracking, real-time engagement analytics, and comprehensive leaderboard systems that help projects reward their most active supporters.',
  publishDate: '2025-11-10T10:04:31.897Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot automates crypto community management with real-time KOL tracking, engagement analytics, and leaderboard systems across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-10',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Organizations',
  subtitle: 'Traditional digital credentials lack verifiability and portability across platforms. Blockchain Badges solves this by creating immutable, web3-native certifications for event participation, learning achievements, and organizational recognition that recipients truly own.',
  publishDate: '2025-11-10T10:04:47.324Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges creates Web3-native digital certifications for organizations, enabling verifiable credentials for events, learning, and achievements.'
},
{
  slug: 'esg-credits-2025-11-10',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Finance and Impact Reporting',
  subtitle: 'Green investing struggles with inconsistent impact tracking and opaque verification systems. ESG Credits solves this by automating ESG alignment, standardizing disclosures, and delivering investor-grade reporting—all built on immutable blockchain foundations that bring unprecedented clarity to sustainable finance.',
  publishDate: '2025-11-10T10:04:58.377Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1762769120669.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Finance and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'Explore ESG Credits\' blockchain-powered green finance solution that automates impact alignment, standardizes ESG disclosures, and enables transparent investor-grade reporting.'
},
{
  slug: 'fan-game-cube-2025-11-10',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Sports Fan Engagement Platform',
  subtitle: 'Sports fans crave deeper engagement beyond passive viewing. Fan Game Cube transforms this relationship by letting fans own virtual zones of real fields through NFTs tied to live in-game events—creating new revenue streams for clubs while actively rewarding fan participation.',
  publishDate: '2025-11-10T10:05:20.761Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Discover Fan Game Cube\'s NFT-powered sports platform where fans own virtual field zones tied to live events, earning rewards while clubs unlock new revenue streams.'
}
];
