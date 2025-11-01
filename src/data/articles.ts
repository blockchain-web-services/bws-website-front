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
  slug: 'x-bot-2025-11-01',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Analytics for Crypto',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and engagement tracking. X Bot automates this process with real-time analytics, KOL performance monitoring, and daily engagement reports, helping projects build stronger communities without manual overhead.',
  publishDate: '2025-11-01T10:03:58.025Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management with real-time X (Twitter) tracking, KOL monitoring, and daily engagement analytics.'
},
{
  slug: 'blockchain-badges-2025-11-01',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications and Achievements',
  subtitle: 'Traditional digital certificates lack verifiability and permanent ownership. Blockchain Badges transforms how organizations award achievements by creating Web3-native certifications for events, learning milestones, and accomplishments that recipients truly own.',
  publishDate: '2025-11-01T10:04:11.516Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps organizations award Web3-native digital certifications for events, learning, and achievements with simple blockchain integration.'
},
{
  slug: 'esg-credits-2025-11-01',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
  subtitle: 'Green finance lacks standardized transparency and verifiable impact reporting. ESG Credits automates ESG alignment, standardizes disclosures, and powers investor-grade reporting for green bonds—all underpinned by immutable blockchain verification.',
  publishDate: '2025-11-01T10:04:22.420Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761991475791.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits automates green bond frameworks with blockchain verification, visual comparison tools, and scalable impact reporting for sustainable finance.'
},
{
  slug: 'fan-game-cube-2025-11-01',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Sports Field Tokenization for Clubs',
  subtitle: 'Sports clubs are searching for new revenue streams while fans crave deeper engagement. Fan Game Cube bridges this gap by letting fans own virtual zones of real fields through NFTs tied to live in-game events—creating interactive experiences that reward fans and generate revenue for clubs.',
  publishDate: '2025-11-01T10:04:35.943Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Discover how Fan Game Cube tokenizes sports fields with NFTs tied to live game events, creating fan engagement and new revenue for clubs, leagues, and athletes.'
}
];
