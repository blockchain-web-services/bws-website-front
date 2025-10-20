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
  slug: 'x-bot-2025-10-20',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Across Social Platforms',
  subtitle: 'Managing crypto community engagement across X (Twitter) and Telegram is time-consuming and complex. X Bot automates mention tracking, generates daily reports with real-time analytics, and helps projects monitor KOL performance—all while gamifying community support to boost organic engagement.',
  publishDate: '2025-10-20T15:11:07.369Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/x-bot-1760973067370.jpg',
    alt: 'X Bot - X Bot: Automate Community Tracking and Engagement Across Social Platforms',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot automates crypto community management with real-time KOL tracking, daily engagement reports, and gamified campaigns across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-10-20',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Education and HR',
  subtitle: 'Traditional digital credentials lack verifiable proof and portability. Blockchain Badges brings Web3-native certification to education, events, and HR tech—making it effortless to create, award, and verify achievement credentials that are permanently recorded on-chain.',
  publishDate: '2025-10-20T15:11:08.086Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/blockchain-badges/01-badges-ui.png',
    alt: 'Blockchain Badges solution',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges brings verifiable Web3 credentials to education and HR, enabling organizations to award permanent, portable achievement badges.'
},
{
  slug: 'esg-credits-2025-10-20',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
  subtitle: 'Green finance lacks standardization and transparent verification. ESG Credits automates impact alignment, standardizes ESG disclosures, and powers investor-grade reporting—all underpinned by immutable blockchain records that bring clarity to sustainable investing.',
  publishDate: '2025-10-20T15:11:08.103Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1760973068103.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits uses blockchain to standardize green bond reporting, automate impact alignment, and provide transparent ESG verification for investors.'
},
{
  slug: 'fan-game-cube-2025-10-20',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Virtual Zones That Transform Sports Engagement',
  subtitle: 'Sports fans want deeper connections with their teams, and clubs need new revenue streams. Fan Game Cube tokenizes real sports fields from chess to football, letting fans own virtual zones tied to live events while creating innovative monetization for clubs and athletes.',
  publishDate: '2025-10-20T15:11:08.364Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Discover how Fan Game Cube tokenizes sports fields, letting fans own virtual zones tied to live events while creating innovative revenue for clubs.'
}
];
