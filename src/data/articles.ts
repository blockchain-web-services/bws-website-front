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
  slug: 'x-bot-2025-11-02',
  product: 'X Bot',
  title: 'How X Bot Transforms Community Management for Crypto Projects',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and engagement tracking. X Bot automates this process with real-time analytics, KOL performance monitoring, and daily engagement reports, helping projects build stronger communities without manual overhead.',
  publishDate: '2025-11-02T10:03:29.210Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-11-02',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications Instantly',
  subtitle: 'Digital certifications are evolving beyond traditional formats. Blockchain Badges enables organizations to award Web3-native digital certifications for event participation, learning achievements, and professional accomplishments—bridging familiar Web2 experiences with powerful Web3 verification and true ownership.',
  publishDate: '2025-11-02T10:03:43.236Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges awards Web3-native digital certifications for events, learning, and achievements, helping organizations bridge Web2 and Web3 credentialing.'
},
{
  slug: 'esg-credits-2025-11-02',
  product: 'ESG Credits',
  title: 'ESG Credits Platform: Automate Green Bond Reporting with Blockchain',
  subtitle: 'Green finance demands transparent impact verification and standardized reporting. ESG Credits automates impact alignment, standardizes ESG disclosures, and delivers investor-grade reporting backed by immutable blockchain verification—making green investing frictionless for both issuers and investors.',
  publishDate: '2025-11-02T10:03:54.783Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1762077848084.jpg',
    alt: 'ESG Credits - ESG Credits Platform: Automate Green Bond Reporting with Blockchain',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits automates green bond reporting with blockchain verification, visual framework comparison, and ICMA-based standards for investors and issuers.'
},
{
  slug: 'fan-game-cube-2025-11-02',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenize Sports Fields and Create New Revenue',
  subtitle: 'Sports clubs need innovative revenue streams while fans crave deeper engagement with their favorite teams. Fan Game Cube bridges this gap by letting fans own virtual zones of real fields through NFTs tied to live in-game events—creating immersive fan experiences and unlocking club revenue beyond traditional models.',
  publishDate: '2025-11-02T10:04:08.244Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube lets fans own virtual field zones through NFTs tied to live sports events, creating new engagement and revenue for clubs across multiple sports.'
}
];
