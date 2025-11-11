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
  slug: 'x-bot-2025-11-11',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Analytics for Web3',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring and accurate analytics. X Bot delivers automated engagement tracking, real-time KOL performance metrics, and daily reports—helping projects understand and reward their most active supporters without manual overhead.',
  publishDate: '2025-11-11T10:04:03.100Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-11',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications and Achievements',
  subtitle: 'Traditional credentials lack verifiability and portability, leaving recipients dependent on issuing organizations. Blockchain Badges transforms this paradigm by bringing Web3-native digital certifications to HR tech, events, and learning platforms—enabling organizations to award tamper-proof achievements that recipients truly own and can verify anywhere.',
  publishDate: '2025-11-11T10:04:15.682Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges brings Web3-native digital certifications to HR tech, events, and learning platforms with tamper-proof, verifiable achievements recipients truly own.'
},
{
  slug: 'esg-credits-2025-11-11',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
  subtitle: 'Green investing demands transparency and standardization. ESG Credits delivers both—automating impact alignment, standardizing ESG disclosures, and powering investor-grade reporting. Every sustainability project and green finance metric is verified through immutable blockchain records.',
  publishDate: '2025-11-11T10:04:28.406Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1762855482542.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits automates impact alignment and ESG reporting for green bonds with blockchain verification, targeting sustainability startups, NGOs, and ESG fintechs.'
},
{
  slug: 'fan-game-cube-2025-11-11',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Let Fans Own Virtual Field Zones with NFT Gaming',
  subtitle: 'Sports engagement is evolving beyond passive viewing. Fan Game Cube transforms fans into active participants by letting them own virtual zones of real fields through NFTs—earning rewards tied to live in-game events while unlocking new revenue streams for clubs.',
  publishDate: '2025-11-11T10:04:42.726Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables NFT-based virtual field ownership tied to live sports events, letting fans earn rewards while clubs create new revenue streams.'
}
];
