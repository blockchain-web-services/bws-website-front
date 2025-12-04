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
  slug: 'x-bot-2025-12-04',
  product: 'X Bot',
  title: 'X Bot: Real-Time Community Analytics for Crypto Projects',
  subtitle: 'Managing crypto community engagement across X and Telegram is complex and time-consuming. X Bot automates this process with official API integration, delivering real-time analytics, KOL tracking, and verified engagement metrics that help projects measure authentic community traction.',
  publishDate: '2025-12-04T10:04:10.714Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot delivers automated community analytics for crypto projects using official X API integration. Track KOL performance, measure engagement, and verify authentic growth.'
},
{
  slug: 'blockchain-badges-2025-12-04',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Verifiable Digital Credentials for Organizations',
  subtitle: 'Organizations need reliable systems for issuing and verifying digital credentials. Blockchain Badges provides a comprehensive platform for creating, managing, and verifying blockchain-based credentials with immutable proof, seamlessly bridging familiar Web2 credential systems with powerful Web3 verification infrastructure.',
  publishDate: '2025-12-04T10:04:25.155Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides organizations with infrastructure to issue, manage, and verify digital credentials using immutable blockchain proof for permanent authentication.'
},
{
  slug: 'esg-credits-2025-12-04',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Green Asset Impact Reporting',
  subtitle: 'Financial institutions face mounting pressure to report green asset impact with verifiable data. ESG Credits delivers blockchain-based verification aligned with ICMA frameworks, enabling organizations to integrate transparent environmental impact reporting seamlessly into their operations.',
  publishDate: '2025-12-04T10:04:39.136Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits delivers blockchain-verified green asset impact reporting with ICMA framework support for financial institutions managing environmental accountability.'
},
{
  slug: 'fan-game-cube-2025-12-04',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Sports Engagement and Monetization',
  subtitle: 'Sports clubs are searching for innovative ways to engage fans and unlock new revenue streams. Fan Game Cube offers a groundbreaking solution—transforming stadium fields into tradeable NFT sections where fans own digital territory and earn real rewards as game events unfold in their locations.',
  publishDate: '2025-12-04T10:04:51.742Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables fans to own digital field sections as NFTs and earn points from live game events, creating new monetization for sports clubs globally.'
}
];
