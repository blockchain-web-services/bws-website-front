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
  slug: 'x-bot-2025-11-14',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking Across X and Telegram Platforms',
  subtitle: 'Managing crypto community engagement across multiple social platforms requires constant monitoring and manual effort. X Bot eliminates this overhead by automatically tracking mentions, generating daily performance reports, and providing real-time KOL analytics—helping Web3 projects build engaged communities without the manual burden.',
  publishDate: '2025-11-14T10:03:34.489Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot tracks community engagement across X and Telegram platforms with automated leaderboards, KOL analytics, and daily performance reports for crypto projects.'
},
{
  slug: 'blockchain-badges-2025-11-14',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications with Ease',
  subtitle: 'Traditional digital certification systems lack verifiable proof and portability across platforms. Blockchain Badges brings Web3-native credentialing to event organizers, learning platforms, and HR departments, enabling effortless creation of blockchain-based certificates that participants truly own and can verify independently.',
  publishDate: '2025-11-14T10:03:46.944Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges delivers Web3-native digital certifications for events, learning platforms, and HR tech with effortless blockchain credential creation.'
},
{
  slug: 'esg-credits-2025-11-14',
  product: 'ESG Credits',
  title: 'ESG Credits: Certify and Tokenize Sustainability Projects On-Chain',
  subtitle: 'Green finance struggles with standardized impact verification and transparent reporting across diverse investment portfolios. ESG Credits solves this by automating impact alignment for green bonds, standardizing ESG disclosures, and powering investor-grade reporting through immutable blockchain records—making sustainable investing both frictionless and verifiable.',
  publishDate: '2025-11-14T10:03:56.318Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1763114649481.jpg',
    alt: 'ESG Credits - ESG Credits: Certify and Tokenize Sustainability Projects On-Chain',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits automates green bond framework alignment and ESG reporting with immutable blockchain verification for sustainability projects and carbon markets.'
},
{
  slug: 'fan-game-cube-2025-11-14',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Virtual Field Ownership for Sports Fans',
  subtitle: 'Sports fans crave deeper engagement beyond passive viewing, while clubs search for innovative revenue streams. Fan Game Cube bridges this gap by creating NFT-based virtual zones tied to real field locations, enabling fans to own digital territory and earn rewards based on live in-game events like goals and plays.',
  publishDate: '2025-11-14T10:04:09.944Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube lets fans own virtual field zones via NFTs, earning rewards from live in-game events. New revenue model for sports clubs and deeper fan engagement.'
}
];
