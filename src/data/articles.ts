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
  slug: 'x-bot-2025-11-13',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking Across X and Telegram Platforms',
  subtitle: 'Managing crypto community engagement across X and Telegram requires constant monitoring and manual tracking. X Bot automates this entire process with real-time analytics, KOL performance tracking, and automated leaderboards, helping projects build engaged communities without the operational overhead.',
  publishDate: '2025-11-13T10:03:42.612Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates community tracking across X and Telegram with KOL analytics, automated leaderboards, and daily reports. One-minute setup for crypto projects.'
},
{
  slug: 'blockchain-badges-2025-11-13',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Modern Organizations',
  subtitle: 'Traditional digital credentials lack verifiability and portability across platforms. Blockchain Badges delivers Web3-native digital certifications that organizations can award for event participation, learning achievements, and milestone recognition—creating permanent, verifiable records on the blockchain.',
  publishDate: '2025-11-13T10:03:57.084Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides Web3-native digital certifications for events, learning, and achievements. Create verifiable credentials in minutes for any organization.'
},
{
  slug: 'esg-credits-2025-11-13',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Finance and Impact Reporting',
  subtitle: 'Green finance lacks standardized, transparent impact verification across currencies and regions. ESG Credits provides blockchain-powered tools that certify sustainability projects, tokenize impact, and automate investor-grade ESG reporting—making green investing frictionless and verifiable.',
  publishDate: '2025-11-13T10:04:10.641Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1763028264468.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Finance and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-powered green finance tools for certifying sustainability projects, tokenizing impact, and automating investor-grade ESG reporting.'
},
{
  slug: 'fan-game-cube-2025-11-13',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Sports Engagement and Revenue Innovation',
  subtitle: 'Sports clubs struggle to monetize digital fan engagement beyond traditional merchandise and tickets. Fan Game Cube solves this by letting fans own virtual zones of real sports fields through NFTs tied to live in-game events—creating new revenue streams while deepening fan connections through gamified ownership.',
  publishDate: '2025-11-13T10:04:24.600Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables fans to own virtual sports field zones via NFTs tied to live events. Create new revenue streams for clubs while gamifying fan engagement.'
}
];
