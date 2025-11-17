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
  slug: 'x-bot-2025-11-17',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Analytics for Web3',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring and manual tracking. X Bot automates this process with real-time analytics, KOL performance tracking, and automated daily reports—helping Web3 projects build engaged communities without the overwhelming overhead.',
  publishDate: '2025-11-17T10:04:00.033Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates Web3 community management with real-time KOL tracking, automated leaderboards, and daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-17',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications and Achievement Recognition',
  subtitle: 'Traditional certification systems lack transparency and portability, leaving recipients with credentials they can\'t truly own or verify across platforms. Blockchain Badges transforms this landscape with Web3-native digital certifications for event participation, learning rewards, and achievement unlocks—making it effortless to create verifiable credentials that recipients actually control.',
  publishDate: '2025-11-17T10:04:12.603Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides Web3-native digital certifications for event participation, learning rewards, and achievements with verifiable, portable credentials.'
},
{
  slug: 'esg-credits-2025-11-17',
  product: 'ESG Credits',
  title: 'ESG Credits: Certify and Tokenize Sustainability Impact with Blockchain Verification',
  subtitle: 'Proving environmental and social impact demands transparent verification that stakeholders can trust. ESG Credits enables organizations to certify sustainability projects, tokenize measurable impact, and track green action through blockchain-based reporting that meets evolving green finance standards.',
  publishDate: '2025-11-17T10:04:24.746Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-based sustainability certification and tokenization for environmental projects with ICMA framework compliance and API integration.'
},
{
  slug: 'fan-game-cube-2025-11-17',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Let Sports Fans Own Virtual Zones with NFT-Based Engagement',
  subtitle: 'Sports fans crave deeper connections with their teams beyond passive viewing. Fan Game Cube transforms this relationship by letting fans own virtual zones of real fields through NFTs tied to live in-game events—creating new revenue streams for clubs while rewarding genuine fan engagement.',
  publishDate: '2025-11-17T10:04:38.119Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables virtual field ownership through NFTs tied to live sports events, creating interactive fan engagement and new revenue for clubs.'
}
];
