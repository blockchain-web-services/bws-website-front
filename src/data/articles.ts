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
  slug: 'x-bot-2025-11-15',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking Across X and Telegram',
  subtitle: 'Managing crypto community engagement across multiple social platforms requires constant monitoring and manual data collection. X Bot eliminates this overhead by automating engagement tracking, generating daily analytics reports, and providing real-time KOL performance insights for Telegram-based communities.',
  publishDate: '2025-11-15T10:04:16.489Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot automates community management for crypto projects with KOL tracking, real-time analytics, and automated engagement reports across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-11-15',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications Made Simple',
  subtitle: 'Traditional digital credentials lack verifiable proof and portability across platforms. Blockchain Badges provides Web3-native certifications for events, learning achievements, and team recognition, bridging Web2 users into blockchain technology with seamless minting capabilities.',
  publishDate: '2025-11-15T10:04:30.019Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides Web3-native certifications for events, learning platforms, and HR tech. Create verifiable digital badges with simple blockchain minting.'
},
{
  slug: 'esg-credits-2025-11-15',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Sustainability Impact Reporting',
  subtitle: 'Sustainability projects face a critical challenge: proving their impact with transparent, standardized reporting across currencies and regions. ESG Credits solves this through blockchain-based certification for green finance, delivering tokenized sustainability tracking with integrated reporting that investors and advisors can trust.',
  publishDate: '2025-11-15T10:04:41.590Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1763201094413.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Sustainability Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits offers blockchain-verified sustainability reporting for green finance. Tokenize impact, track ESG projects, and generate integrated reports for investors.'
},
{
  slug: 'fan-game-cube-2025-11-15',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Sports Engagement for Clubs and Fans',
  subtitle: 'Sports clubs need new revenue streams. Fans crave deeper engagement with live games. Fan Game Cube bridges this gap by creating NFT-based virtual zones tied to real field positions, rewarding fans for in-game events while generating sustainable income for clubs and leagues.',
  publishDate: '2025-11-15T10:04:54.568Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube creates NFT-based sports engagement. Fans own virtual field zones and earn points from live events while clubs generate new revenue streams.'
}
];
