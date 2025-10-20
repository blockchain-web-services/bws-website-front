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
  title: 'X Bot: Automate Community Tracking and Engagement for Crypto Projects',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring and engagement tracking. X Bot automates this process with real-time KOL performance tracking, daily analytics reports, and gamified community support, helping projects amplify visibility and build momentum without manual overhead.',
  publishDate: '2025-10-20T18:59:48.830Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-10-20',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Education and Events',
  subtitle: 'Traditional digital credentials lack verifiability and portability across platforms. Blockchain Badges transforms how organizations award certifications by providing Web3-native digital badges for event participation, learning achievements, and professional recognition on immutable infrastructure.',
  publishDate: '2025-10-20T19:00:00.867Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Explore Blockchain Badges for Web3-native digital certifications. Issue verifiable event participation, learning achievements, and professional credentials on blockchain.'
},
{
  slug: 'esg-credits-2025-10-20',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Frameworks and Impact Reporting',
  subtitle: 'Green finance demands transparent, verifiable impact tracking across diverse regulatory frameworks. ESG Credits automates ESG compliance, standardizes green bond disclosures, and delivers investor-grade reporting—all underpinned by immutable blockchain records that bring accountability to sustainability projects and portfolios.',
  publishDate: '2025-10-20T19:00:13.760Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1760986826974.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Frameworks and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'Discover ESG Credits for blockchain-powered green bond frameworks, automated ESG compliance, and investor-grade impact reporting with immutable sustainability tracking.'
},
{
  slug: 'fan-game-cube-2025-10-20',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenized Sports Fields Creating New Fan Experiences',
  subtitle: 'Sports fans crave deeper engagement with their favorite teams and athletes. Fan Game Cube transforms this desire into reality by letting fans own virtual zones of real sports fields through NFTs tied to live in-game events—creating new revenue streams for clubs while delivering unprecedented fan experiences.',
  publishDate: '2025-10-20T19:00:27.359Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Discover Fan Game Cube: tokenized sports field NFTs tied to live events, creating new fan experiences and revenue for clubs across chess, football, and more sports.'
}
];
