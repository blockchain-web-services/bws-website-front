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
  slug: 'x-bot-2025-10-30',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Boost Web3 Engagement',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and manual tracking. X Bot eliminates this overhead by automating engagement analytics, tracking KOL performance, and delivering daily reports—helping Web3 projects build stronger communities with real-time insights.',
  publishDate: '2025-10-30T10:03:28.822Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-10-30',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Modern Organizations',
  subtitle: 'Traditional certification systems struggle with fraud and verification challenges, requiring time-consuming contact with issuing organizations. Blockchain Badges transform this landscape with Web3-native digital certifications that are instantly verifiable, permanently recorded, and seamlessly integrated into the decentralized ecosystem.',
  publishDate: '2025-10-30T10:03:44.263Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges enables organizations to issue Web3-native digital certifications for events, learning, and achievements with immutable on-chain verification.'
},
{
  slug: 'esg-credits-2025-10-30',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Sustainable Impact Reporting and Verification',
  subtitle: 'Green finance and sustainability reporting struggle with transparency, verification, and standardization across frameworks and regions. ESG Credits addresses these challenges head-on by leveraging blockchain technology to certify impact, tokenize sustainability projects, and deliver investor-grade ESG reporting with immutable verification.',
  publishDate: '2025-10-30T10:03:56.512Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761818649462.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Sustainable Impact Reporting and Verification',
    loading: 'eager'
  },
  seoDescription: 'Explore ESG Credits—blockchain-powered green bond reporting with automated impact alignment, visual framework comparison, and immutable verification for sustainable finance.'
},
{
  slug: 'fan-game-cube-2025-10-30',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube transforms how fans engage with sports by enabling virtual ownership of real field zones. Through NFTs tied to live in-game events, fans earn points based on actual gameplay while clubs unlock new revenue streams—bringing blockchain benefits to mainstream sports audiences without requiring crypto expertise.',
  subtitle: 'Through NFTs tied to live in-game events, fans earn points based on actual gameplay while clubs unlock new revenue streams—bringing blockchain benefits to mainstream sports audiences without requiring crypto expertise.',
  publishDate: '2025-10-30T10:04:09.634Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Discover Fan Game Cube—NFT-powered virtual field ownership for sports fans with live event integration, point earning, and new revenue for clubs across 200+ projects.'
}
];
