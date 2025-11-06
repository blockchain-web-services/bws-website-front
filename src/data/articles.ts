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
  slug: 'x-bot-2025-11-06',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Analytics for Web3',
  subtitle: 'Managing crypto community engagement across X (Twitter) and Telegram requires constant monitoring and manual tracking. X Bot eliminates this overhead by automatically tracking mentions, generating daily reports, and providing real-time analytics that help projects measure KOL performance and reward active contributors.',
  publishDate: '2025-11-06T10:03:40.665Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-06',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Learning and Achievement',
  subtitle: 'Traditional digital certifications lack verifiability and portability across platforms. Blockchain Badges solves this by creating Web3-native digital certifications that can be awarded for event participation, learning achievements, and milestone accomplishments with immutable proof of authenticity.',
  publishDate: '2025-11-06T10:03:54.970Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges enables organizations to issue Web3-native digital certifications for events, learning platforms, and achievement systems.'
},
{
  slug: 'esg-credits-2025-11-06',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Impact Reporting for Green Finance',
  subtitle: 'Green finance struggles with standardized verification and transparent impact tracking. ESG Credits transforms this landscape by tokenizing sustainability projects and delivering automated, investor-grade ESG disclosures—all backed by blockchain verification for green bonds and sustainable investments.',
  publishDate: '2025-11-06T10:04:07.496Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1762423462307.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Impact Reporting for Green Finance',
    loading: 'eager'
  },
  seoDescription: 'Explore how ESG Credits brings blockchain verification to green finance with automated impact reporting, green bond frameworks, and standardized ESG disclosures.'
},
{
  slug: 'fan-game-cube-2025-11-06',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Virtual Zones for Sports Fans and Clubs',
  subtitle: 'Sports clubs are searching for innovative revenue streams while fans crave deeper connections with their favorite teams. Fan Game Cube (also called NFT Game Cube) bridges this gap by enabling fans to own virtual zones of real fields through NFTs tied to live in-game events, creating unprecedented experiences and revenue opportunities for everyone involved.',
  publishDate: '2025-11-06T10:04:22.411Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Discover how Fan Game Cube lets sports fans own virtual field zones through NFTs tied to live events, creating new revenue for clubs and athlete brands.'
}
];
