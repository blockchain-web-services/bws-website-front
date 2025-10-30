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
  slug: 'x-bot-2025-10-29',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Analytics for Web3',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring and manual reporting. X Bot automates engagement tracking, delivers daily analytics, and helps projects monitor KOL performance in real-time—all without the overhead.',
  publishDate: '2025-10-29T10:04:10.566Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-10-29',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications for Your Organization',
  subtitle: 'Traditional digital credentials lack verifiability and portability, leaving recipients with certificates they can\'t truly prove they own. Blockchain Badges transforms organizational credentialing by creating Web3-native digital credentials for events, learning achievements, and participation rewards that recipients genuinely own and control.',
  publishDate: '2025-10-29T10:04:23.123Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps organizations award Web3-native digital certifications for events, learning, and achievements with verifiable on-chain credentials.'
},
{
  slug: 'esg-credits-2025-10-29',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
  subtitle: 'Green investing lacks standardized reporting and transparent verification. ESG Credits automates impact alignment, standardizes ESG disclosures, and delivers investor-grade reporting with immutable blockchain records—making sustainable finance transparent and trustworthy.',
  publishDate: '2025-10-29T10:04:35.450Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761732288325.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits automates green bond frameworks and impact reporting with blockchain verification for transparent, investor-grade ESG disclosures.'
},
{
  slug: 'fan-game-cube-2025-10-29',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Based Sports Fan Engagement and Revenue Generation',
  subtitle: 'Sports clubs are searching for new ways to monetize digital experiences and deepen fan connections. Fan Game Cube bridges this gap by letting fans own virtual zones of real playing fields through NFTs—creating interactive experiences tied to live game action while unlocking fresh revenue streams for teams.',
  publishDate: '2025-10-29T10:04:48.510Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Discover how Fan Game Cube creates NFT-based sports fan engagement, letting fans own virtual field zones tied to live events while generating new club revenue.'
}
];
