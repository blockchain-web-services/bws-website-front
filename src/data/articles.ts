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
  slug: 'x-bot-2025-10-22',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Across X and Telegram',
  subtitle: 'Managing crypto community performance across X (Twitter) and Telegram is time-consuming and difficult to measure. X Bot automates mention tracking, KOL monitoring, and engagement reporting, helping Web3 projects understand their social presence and reward active supporters without manual overhead.',
  publishDate: '2025-10-22T10:03:54.868Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot automates community tracking for crypto projects with KOL monitoring, real-time analytics, and daily reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-10-22',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications for Achievements',
  subtitle: 'Traditional digital badges lack verification and portability, leaving achievements vulnerable to fraud and platform dependency. Blockchain Badges solves this by providing Web3-native digital certifications for events, learning achievements, and participation rewards—enabling HR platforms, educational institutions, and event organizers to issue verifiable credentials that recipients truly own.',
  publishDate: '2025-10-22T10:04:08.750Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges provides Web3-native digital certifications for events, learning, and achievements with verifiable on-chain credentials.'
},
{
  slug: 'esg-credits-2025-10-22',
  product: 'ESG Credits',
  title: 'ESG Credits: Tokenize Sustainability with Blockchain-Verified Impact Reporting',
  subtitle: 'ESG reporting in green finance suffers from inconsistent standards and opaque verification processes. ESG Credits solves this by providing blockchain-verified tools to certify impact, tokenize sustainability projects, and automate investor-grade reporting—helping sustainability startups, NGOs, and ESG fintechs prove their green credentials with unprecedented credibility.',
  publishDate: '2025-10-22T10:04:22.461Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761127480234.jpg',
    alt: 'ESG Credits - ESG Credits: Tokenize Sustainability with Blockchain-Verified Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'Explore how ESG Credits tokenizes sustainability projects with blockchain-verified impact reporting, automated green bond frameworks, and investor-grade ESG transparency.'
},
{
  slug: 'fan-game-cube-2025-10-22',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenize Sports Fields and Create New Fan Experiences',
  subtitle: 'Sports clubs struggle to monetize digital fan engagement beyond traditional merchandise and tickets. Fan Game Cube transforms this landscape by letting fans own virtual zones of real fields through NFTs tied to live in-game events—creating new revenue streams for clubs while delivering unique experiences that connect supporters directly to the action.',
  publishDate: '2025-10-22T10:04:40.312Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Discover how Fan Game Cube tokenizes sports fields with NFTs tied to live events, creating new revenue for clubs and unique engagement for fans worldwide.'
}
];
