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
  slug: 'x-bot-2025-12-03',
  product: 'X Bot',
  title: 'X Bot: Real-Time Twitter Analytics for Crypto Community Management',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires accurate engagement tracking and KOL performance monitoring. X Bot delivers official Twitter API metrics through Telegram, helping projects measure authentic community traction, automate daily reports, and gamify supporter engagement without manual overhead.',
  publishDate: '2025-12-03T10:03:56.824Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot delivers real-time Twitter analytics for crypto projects through Telegram. Track KOL performance, measure community engagement, and verify authentic traction with official API metrics.'
},
{
  slug: 'blockchain-badges-2025-12-03',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3 Digital Certifications for Organizations and Events',
  subtitle: 'Organizations moving from Web2 to Web3 need simple certification systems that prove achievements without technical complexity. Blockchain Badges enables HR teams, event organizers, and learning platforms to create and award Web3-native digital credentials in minutes, making blockchain technology accessible for real-world use cases.',
  publishDate: '2025-12-03T10:04:09.406Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges delivers Web3 digital certifications for HR teams, events, and learning platforms. Create tamper-proof credentials in minutes without technical knowledge.'
},
{
  slug: 'esg-credits-2025-12-03',
  product: 'ESG Credits',
  title: 'ESG Credits: Tokenized Sustainability Tracking via Blockchain API',
  subtitle: 'Corporate sustainability initiatives struggle with a critical challenge: proving environmental impact with verifiable evidence. ESG Credits solves this through blockchain infrastructure via the BWS.ESG API, empowering sustainability startups, NGOs, and ESG fintechs to certify impact, tokenize projects, and demonstrate green action through transparent, immutable records.',
  publishDate: '2025-12-03T10:04:19.976Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1764756270996.jpg',
    alt: 'ESG Credits - ESG Credits: Tokenized Sustainability Tracking via Blockchain API',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain API for sustainability tracking. Certify impact, tokenize projects, and prove green action for ESG fintechs, NGOs, and carbon markets.'
},
{
  slug: 'fan-game-cube-2025-12-03',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT Sports Gaming for Clubs and Leagues',
  subtitle: 'Sports organizations constantly seek innovative revenue streams that deepen fan engagement beyond traditional ticketing and merchandise. Fan Game Cube bridges this gap by enabling fans to own virtual zones of real playing fields through NFTs tied to live in-game events—creating new revenue opportunities for clubs while gamifying the fan experience through point systems and digital ownership.',
  publishDate: '2025-12-03T10:04:31.104Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1764756282129.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: NFT Sports Gaming for Clubs and Leagues',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables fans to own NFT zones of real playing fields tied to live sports events. New revenue for clubs, leagues, and athlete brands through gamified fan engagement.'
}
];
