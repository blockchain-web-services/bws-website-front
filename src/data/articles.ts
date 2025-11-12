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
  slug: 'x-bot-2025-11-12',
  product: 'X Bot',
  title: 'X Bot: Automated Community Tracking and KOL Analytics for Web3',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring and manual reporting. X Bot automates engagement tracking, generates daily performance reports, and provides real-time KOL analytics—helping Web3 projects build data-driven communities without the overhead.',
  publishDate: '2025-11-12T10:04:14.287Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates crypto community management with KOL tracking, daily engagement reports, and leaderboard analytics across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-12',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Achievement Recognition',
  subtitle: 'Traditional digital credentials suffer from a critical flaw: they lack verification and portability across platforms. Blockchain Badges solves this by providing Web3-native certifications that are permanently verifiable, easily shareable, and instantly mintable—effectively bridging Web2 credential systems with blockchain technology.',
  publishDate: '2025-11-12T10:04:25.624Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges enables organizations to award Web3-native digital certifications for events, learning, and achievements with permanent on-chain verification.'
},
{
  slug: 'esg-credits-2025-11-12',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Sustainability Reporting for Green Finance',
  subtitle: 'Green bond reporting remains fragmented across frameworks, currencies, and regions—creating friction for investors and issuers alike. ESG Credits transforms this landscape by automating impact alignment, standardizing disclosures, and delivering transparent investor-grade reporting backed by immutable blockchain verification.',
  publishDate: '2025-11-12T10:04:37.642Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1762941890746.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Sustainability Reporting for Green Finance',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits automates green bond reporting with blockchain verification. Compare frameworks, generate investor-grade ESG disclosures, and certify sustainability impact.'
},
{
  slug: 'fan-game-cube-2025-11-12',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Virtual Zones for Sports Engagement',
  subtitle: 'Traditional sports fan engagement lacks ownership and direct connection to live game action. Fan Game Cube transforms this dynamic by letting fans own virtual zones of real fields through NFTs tied to live in-game events—creating new revenue streams for clubs while deepening fan participation in ways never before possible.',
  publishDate: '2025-11-12T10:04:51.026Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables fans to own virtual sports field zones via NFTs. Earn points from live in-game events while clubs unlock new digital revenue.'
}
];
