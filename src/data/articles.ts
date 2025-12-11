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
  slug: 'x-bot-2025-12-11',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Analytics for Web3',
  subtitle: 'Managing crypto communities across X and Telegram while tracking genuine engagement is nearly impossible manually. X Bot automates community monitoring with real-time analytics, KOL tracking, and bot detection through official API integration, helping projects identify authentic growth without the manual overhead.',
  publishDate: '2025-12-11T18:05:58.309Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/x-bot-1765476368179.jpg',
    alt: 'X Bot - X Bot: Automate Community Tracking and KOL Analytics for Web3',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates community management for Web3 projects with real-time analytics, KOL tracking across 100+ accounts, and bot detection using official X and Telegram APIs.'
},
{
  slug: 'blockchain-badges-2025-12-11',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Issue Tamper-Proof Digital Credentials with Blockchain Verification',
  subtitle: 'Credential fraud costs institutions billions annually, eroding trust in educational systems worldwide. Blockchain Badges solves this crisis by enabling organizations to issue verifiable digital credentials with immutable blockchain proof—providing instant verification that cannot be forged, altered, or disputed.',
  publishDate: '2025-12-11T18:06:09.467Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/blockchain-badges-1765476380390.jpg',
    alt: 'Blockchain Badges - Blockchain Badges: Issue Tamper-Proof Digital Credentials with Blockchain Verification',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges issues tamper-proof digital credentials with blockchain verification. Organizations create verifiable certificates that cannot be forged or altered.'
},
{
  slug: 'esg-credits-2025-12-11',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Financial Institutions',
  subtitle: 'As sustainable investing grows, financial institutions face mounting pressure to verify environmental impact claims. ESG Credits delivers blockchain-based verification for green asset reporting with ICMA framework compliance, enabling banks to document environmental performance with tamper-proof cryptographic proof that stakeholders can trust.',
  publishDate: '2025-12-11T18:06:21.208Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-verified environmental impact reporting for banks with ICMA compliance, tracking sustainable asset performance with cryptographic proof.'
},
{
  slug: 'fan-game-cube-2025-12-11',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenize Sports Fields as NFTs with Event-Based Rewards',
  subtitle: 'Sports fans crave deeper engagement beyond passive viewing, yet clubs struggle to monetize digital fan experiences. Fan Game Cube bridges this gap by dividing stadium fields into NFT sections that fans can own, generating real-time rewards whenever game events occur at those specific coordinates.',
  publishDate: '2025-12-11T18:06:35.086Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1765476409838.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: Tokenize Sports Fields as NFTs with Event-Based Rewards',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports fields as NFTs where fans own coordinates and earn rewards from real game events, creating new engagement for football, chess, tennis, and cricket.'
}
];
