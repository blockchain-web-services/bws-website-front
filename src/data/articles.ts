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
  slug: 'x-bot-2025-10-25',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Monitoring for Web3 Projects',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and manual tracking. X Bot automates this process with real-time engagement analytics, KOL performance tracking, and automated reporting, helping projects build engaged communities without the operational overhead.',
  publishDate: '2025-10-25T10:03:28.797Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates community management for crypto projects with real-time KOL tracking, engagement analytics, and daily reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-10-25',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications for Learning and Achievement',
  subtitle: 'Traditional digital credentials lack verifiable proof of authenticity and ownership. Blockchain Badges provides Web3-native digital certifications for event participation, learning achievements, and professional accomplishments, creating tamper-proof credentials that recipients truly own.',
  publishDate: '2025-10-25T10:03:40.477Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges delivers Web3-native digital certifications for events, learning, and achievements. Simple badge creation with blockchain verification for HR tech and education.'
},
{
  slug: 'esg-credits-2025-10-25',
  product: 'ESG Credits',
  title: 'ESG Credits: Automate ESG Reporting and Green Bond Framework Management',
  subtitle: 'Green finance reporting remains fragmented, manual, and difficult to verify across currencies and taxonomies. ESG Credits automates impact alignment, standardizes ESG disclosures, and powers transparent investor-grade reporting with immutable blockchain verification for sustainability projects.',
  publishDate: '2025-10-25T10:03:53.205Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761386648095.jpg',
    alt: 'ESG Credits - ESG Credits: Automate ESG Reporting and Green Bond Framework Management',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits automates ESG reporting and green bond framework management with blockchain verification. Built for sustainability projects, carbon markets, and ESG fintechs.'
},
{
  slug: 'fan-game-cube-2025-10-25',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Virtual Field Ownership for Sports Clubs',
  subtitle: 'Sports clubs need new ways to engage digital-native fans and create sustainable revenue streams. Fan Game Cube bridges this gap by letting fans own virtual zones of real fields through NFTs—turning every goal, play, and match action into immersive experiences that reward fans while generating income for clubs.',
  publishDate: '2025-10-25T10:04:08.222Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube lets sports fans own virtual field zones via NFTs tied to live events. Creates new revenue for clubs while engaging fans across chess, football, and more.'
}
];
