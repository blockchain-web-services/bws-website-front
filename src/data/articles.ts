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
  slug: 'x-bot-2025-11-08',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Analytics for Web3',
  subtitle: 'Managing crypto community engagement across X and Telegram requires constant monitoring and manual tracking. X Bot automates this process with real-time analytics, KOL performance tracking, and automated daily reports, helping Web3 projects build and reward engaged communities without manual overhead.',
  publishDate: '2025-11-08T10:04:08.667Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-11-08',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for HR and Events',
  subtitle: 'Traditional digital certificates lack verifiability and portability across platforms. Blockchain Badges provides Web3-native digital certifications for event participation, learning achievements, and professional credentials—making it effortless for Web2 companies to create their first blockchain-based badge.',
  publishDate: '2025-11-08T10:04:22.570Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides Web3-native digital certifications for HR tech, events, and learning platforms. Create blockchain-verified badges in minutes.'
},
{
  slug: 'esg-credits-2025-11-08',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
  subtitle: 'Green investing faces critical challenges with ESG disclosure standardization and impact verification. ESG Credits solves this by automating impact alignment and standardizing ESG disclosures while powering transparent investor-grade reporting—all underpinned by immutable blockchain verification for sustainability projects.',
  publishDate: '2025-11-08T10:04:38.829Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1762596304226.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits automates green bond impact reporting with blockchain verification. Compare frameworks, generate investor-grade reports, and certify sustainability projects.'
},
{
  slug: 'fan-game-cube-2025-11-08',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Sports Field Tokenization and Fan Engagement',
  subtitle: 'Sports clubs and athletes are searching for new ways to engage fans and create digital revenue streams. Fan Game Cube offers a solution: fans can own virtual zones of real sports fields through NFTs that respond to live in-game events, creating interactive experiences that reward fans with points while generating fresh revenue for clubs.',
  publishDate: '2025-11-08T10:05:04.362Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1762596323088.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: NFT-Powered Sports Field Tokenization and Fan Engagement',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports fields, letting fans own zones through NFTs tied to live game events. New revenue for clubs, interactive experiences for fans.'
}
];
