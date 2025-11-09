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
  slug: 'x-bot-2025-11-09',
  product: 'X Bot',
  title: 'How X Bot Automates Community Tracking for Crypto Projects',
  subtitle: 'Managing crypto community engagement across X (Twitter) and Telegram requires constant monitoring and manual reporting. X Bot eliminates this overhead by automatically tracking mentions, generating daily analytics reports, and monitoring KOL performance—helping projects build engaged communities without the manual work.',
  publishDate: '2025-11-09T10:04:04.166Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot automates community management for crypto projects with real-time KOL tracking, daily analytics reports, and automated mention monitoring.'
},
{
  slug: 'blockchain-badges-2025-11-09',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Real Organizations',
  subtitle: 'Traditional digital certificates lack verifiability and permanence. Blockchain Badges solves this by providing Web3-native digital certifications for event participation, learning rewards, and achievement unlocks—making it effortless for Web2 organizations to experience blockchain value.',
  publishDate: '2025-11-09T10:04:19.303Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps HR tech, events, and learning platforms issue Web3-native digital certifications with simple creation and permanent verification.'
},
{
  slug: 'esg-credits-2025-11-09',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Impact Reporting for Green Finance',
  subtitle: 'Green finance struggles with a critical challenge: the absence of standardized, transparent impact reporting that investors can genuinely trust. ESG Credits solves this by automating impact alignment, standardizing ESG disclosures, and delivering investor-grade reporting—all verified through immutable blockchain technology for sustainability projects and green bonds.',
  publishDate: '2025-11-09T10:04:35.223Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1762682688751.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Impact Reporting for Green Finance',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits automates impact reporting for green finance with blockchain-verified sustainability tracking, green bond comparison, and ICMA-compatible reporting.'
},
{
  slug: 'fan-game-cube-2025-11-09',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: How Sports Clubs Create New Revenue Through Tokenized Fields',
  subtitle: 'Sports clubs have long struggled to monetize fan engagement beyond traditional ticket sales and merchandise. Fan Game Cube (NFT Game Cube) changes this by letting fans own virtual zones of real fields with NFTs tied to live in-game events—unlocking powerful new fan experiences and untapped revenue streams for clubs, leagues, and athlete brands.',
  publishDate: '2025-11-09T10:04:48.860Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1762682705132.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: How Sports Clubs Create New Revenue Through Tokenized Fields',
    loading: 'eager'
  },
  seoDescription: 'Discover how Fan Game Cube helps sports clubs tokenize fields, letting fans own zones tied to live events while generating new revenue streams across multiple sports.'
}
];
