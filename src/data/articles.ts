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
  slug: 'x-bot-2025-11-03',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Performance for Crypto Projects',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and accurate engagement metrics. X Bot is a Telegram-based analytics platform that delivers real-time X engagement tracking, automates community monitoring, and gamifies supporter recognition—helping projects build stronger communities without manual overhead.',
  publishDate: '2025-11-03T10:03:51.139Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot is a Telegram analytics platform that automates X (Twitter) tracking for crypto projects. Monitor KOLs, track mentions, and generate daily engagement reports.'
},
{
  slug: 'blockchain-badges-2025-11-03',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications for Learning and Achievements',
  subtitle: 'Traditional digital credentials lack verifiability and portability across platforms. Blockchain Badges provides Web3-native digital certifications for event participation, learning rewards, and achievement recognition—making it effortless to create blockchain-based badges that bring immediate value to products, teams, and communities.',
  publishDate: '2025-11-03T10:04:05.623Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides Web3-native digital certifications for events, learning platforms, and HR tech. Issue verifiable badges for achievements and participation.'
},
{
  slug: 'esg-credits-2025-11-03',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting Solution',
  subtitle: 'Green investing demands transparent impact alignment and standardized ESG disclosures. ESG Credits automates green bond framework management, enables cross-portfolio ESG reporting, and delivers investor-grade transparency—all underpinned by immutable blockchain verification for sustainability projects.',
  publishDate: '2025-11-03T10:04:18.651Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1762164275294.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting Solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-powered green bond frameworks and impact reporting. Automate ESG disclosures, compare frameworks, and verify sustainability projects.'
},
{
  slug: 'fan-game-cube-2025-11-03',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenize Sports Fields and Create New Fan Revenue for Clubs',
  subtitle: 'Sports clubs need new revenue streams while fans seek deeper engagement with their favorite teams. Fan Game Cube bridges this gap by letting fans own virtual zones of real fields through NFTs tied to live in-game events—creating unique fan experiences and new revenue for clubs without requiring any crypto expertise.',
  publishDate: '2025-11-03T10:04:35.441Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube lets fans own NFT zones of real sports fields tied to live events. Sports clubs gain new revenue while fans earn points based on match actions.'
}
];
