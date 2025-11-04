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
  slug: 'x-bot-2025-11-04',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement for Crypto Projects',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and engagement tracking. X Bot automates this process with real-time analytics, KOL performance monitoring, and daily engagement reports, helping projects build stronger communities without manual overhead.',
  publishDate: '2025-11-04T10:03:41.204Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-11-04',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Recognition and Achievement',
  subtitle: 'Digital certifications need verifiable, permanent records that recipients can own and share. Blockchain Badges delivers Web3-native certification for event participation, learning achievements, and professional recognition—bridging Web2 platforms seamlessly into blockchain technology.',
  publishDate: '2025-11-04T10:03:52.883Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges delivers Web3-native digital certifications for events, education, and professional recognition with permanent blockchain verification.'
},
{
  slug: 'esg-credits-2025-11-04',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
  subtitle: 'Green investing demands transparent, standardized ESG disclosures and verifiable impact reporting. ESG Credits delivers exactly that—automating impact alignment, standardizing reporting, and powering investor-grade ESG analysis through immutable blockchain records for sustainability projects.',
  publishDate: '2025-11-04T10:04:07.177Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1762250660934.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits delivers blockchain-powered green bond frameworks, automated ESG reporting, and verifiable sustainability impact for investors and organizations.'
},
{
  slug: 'fan-game-cube-2025-11-04',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Based Virtual Zones Tied to Real Sports Events',
  subtitle: 'Sports clubs are searching for innovative ways to engage fans and generate revenue beyond traditional channels. Fan Game Cube offers a breakthrough solution: letting fans own virtual zones of real fields through NFTs tied to live in-game events, creating unprecedented experiences for supporters and new revenue streams for clubs.',
  publishDate: '2025-11-04T10:04:21.032Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1762250675795.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: NFT-Based Virtual Zones Tied to Real Sports Events',
    loading: 'eager'
  },
  seoDescription: 'Explore how Fan Game Cube lets fans own virtual zones of real sports fields through NFTs tied to live events, creating new engagement and revenue for clubs.'
}
];
