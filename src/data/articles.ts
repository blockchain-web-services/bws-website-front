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
  slug: 'fan-game-cube-2025-12-24',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenized Stadium Sections Creating New Sports Revenue Streams',
  subtitle: 'Sports clubs leave massive revenue opportunities untapped because traditional fan engagement stops at merchandise and tickets. Fan Game Cube changes this by tokenizing stadium fields into NFT coordinate zones, allowing fans to own specific locations and earn rewards when real match events occur at their coordinates.',
  publishDate: '2025-12-24T10:03:29.692Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables fans to own tokenized stadium sections as NFTs earning rewards from real match events. Multi-sport platform creating new revenue streams for clubs.'
},
{
  slug: 'esg-credits-2025-12-23',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Financial Institutions',
  subtitle: 'Financial institutions face mounting pressure to prove environmental claims while navigating complex regulatory frameworks and multi-currency portfolios. ESG Credits delivers blockchain-verified environmental impact reporting with ICMA framework compliance through REST API, enabling banks to provide auditable sustainability metrics with immutable tracking and regulatory-grade transparency.',
  publishDate: '2025-12-23T10:03:59.595Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-verified environmental reporting with ICMA compliance for financial institutions requiring regulatory sustainability tracking.'
},
{
  slug: 'fan-game-cube-2025-12-16',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenize Sports Fields into Interactive NFT Zones',
  subtitle: 'Sports clubs face a persistent challenge: monetizing fan engagement beyond traditional merchandise and tickets. Fan Game Cube offers a breakthrough solution by tokenizing stadium fields into NFT zones, where fans own specific coordinates and earn points as real-time match events unfold at their locations—creating entirely new revenue streams.',
  publishDate: '2025-12-16T10:36:57.300Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports fields into interactive NFT zones where fans earn rewards from real-time match events at their owned coordinates.'
},
{
  slug: 'blockchain-badges-2025-12-12',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Issue Tamper-Proof Digital Credentials with Blockchain Verification',
  subtitle: 'Traditional credential verification traps organizations in a cycle of repetitive processes, document uploads, and manual verification calls that waste time and create security vulnerabilities. Blockchain Badges breaks this cycle by issuing tamper-proof digital credentials with immutable blockchain proof—enabling instant verification by anyone, anywhere, without the friction.',
  publishDate: '2025-12-12T10:04:02.390Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges creates verifiable digital credentials with immutable blockchain proof for universities and organizations, eliminating repetitive verification.'
}
];
