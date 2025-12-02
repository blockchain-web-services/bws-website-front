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
  slug: 'x-bot-2025-12-02',
  product: 'X Bot',
  title: 'X Bot: Advanced Community Analytics for Crypto Projects on X and Telegram',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires accurate engagement tracking and KOL performance monitoring. X Bot delivers real-time analytics, automated leaderboards, and verifiable community metrics through official X API integration, helping projects measure authentic traction without manual overhead.',
  publishDate: '2025-12-02T10:04:11.863Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-12-02',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Organizations',
  subtitle: 'Traditional digital certifications require complex infrastructure and lack verifiable provenance. Blockchain Badges changes this by providing Web3-native certification for event participation, learning achievements, and professional credentials—enabling organizations to mint verifiable badges that recipients truly own.',
  publishDate: '2025-12-02T10:04:25.685Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides Web3-native digital certifications for events, learning, and achievements. Discover how organizations mint verifiable badges easily.'
},
{
  slug: 'esg-credits-2025-12-02',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Based Sustainability Impact Certification Platform',
  subtitle: 'Proving environmental and social impact requires verifiable certification systems that stakeholders can trust. ESG Credits enables organizations to tokenize sustainability projects, certify impact on blockchain, and track green action through the BWS.ESG API—providing transparent, immutable proof for stakeholders and carbon markets alike.',
  publishDate: '2025-12-02T10:04:37.692Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-based sustainability certification. Tokenize projects, track impact, and prove green action with the BWS.ESG API for carbon markets.'
},
{
  slug: 'fan-game-cube-2025-12-02',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Virtual Field Zones for Sports Engagement',
  subtitle: 'Sports clubs face a persistent challenge: how to monetize fan engagement beyond traditional revenue streams like ticket sales and merchandise. Fan Game Cube solves this by enabling fans to own virtual zones of real fields through NFTs tied to live in-game events, creating lucrative new revenue opportunities for clubs while fans earn points from actual gameplay actions.',
  publishDate: '2025-12-02T10:04:52.169Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube lets fans own virtual field zones through NFTs tied to live sports events. New revenue for clubs, point rewards for fans from real gameplay.'
}
];
