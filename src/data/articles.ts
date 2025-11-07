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
  slug: 'x-bot-2025-11-07',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Analytics for Crypto',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and accurate engagement tracking. X Bot delivers automated analytics, KOL performance monitoring, and real-time reporting—helping projects build engaged communities without manual overhead while gamifying supporter contributions.',
  publishDate: '2025-11-07T10:04:00.872Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-11-07',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications and Achievements',
  subtitle: 'Traditional digital certifications lack verifiability and portability across platforms. Blockchain Badges delivers Web3-native digital certifications for event participation, learning rewards, and achievement unlocks—creating trust layers for HR tech, events, and educational platforms entering Web3.',
  publishDate: '2025-11-07T10:04:15.532Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges delivers Web3-native certifications for HR, education, and events—enabling verifiable digital badges with permanent on-chain verification.'
},
{
  slug: 'esg-credits-2025-11-07',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Finance and Impact Reporting',
  subtitle: 'Green investing struggles with standardized transparency and verifiable impact tracking. ESG Credits changes this by automating ESG alignment, standardizing disclosures, and delivering investor-grade reporting—all powered by immutable blockchain records that bring unprecedented clarity to sustainable finance.',
  publishDate: '2025-11-07T10:04:26.814Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1762509880128.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Finance and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits automates green finance reporting with blockchain verification, enabling impact tracking, framework comparison, and standardized ESG disclosures.'
},
{
  slug: 'fan-game-cube-2025-11-07',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube transforms how fans engage with sports by tokenizing real playing fields. From chess to football, fans can own virtual zones tied to live in-game events—creating new revenue streams for clubs while delivering immersive experiences that bridge Web2 audiences into blockchain technology.',
  subtitle: 'Fan Game Cube transforms how fans engage with sports by tokenizing real playing fields. From chess to football, fans can own virtual zones tied to live in-game events—creating new revenue streams for clubs while delivering immersive experiences that bridge Web2 audiences into blockchain technology.',
  publishDate: '2025-11-07T10:04:40.188Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports fields for fan ownership, creating new revenue for clubs through NFTs tied to live in-game events and point rewards.'
}
];
