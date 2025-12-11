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
  title: 'How X Bot Automates Community Analytics for Web3 Projects',
  subtitle: 'Managing crypto communities across multiple platforms while tracking authentic engagement is challenging. X Bot simplifies this with automated KOL monitoring, bot detection, and real-time analytics across X and Telegram, helping projects measure genuine community growth without manual overhead.',
  publishDate: '2025-12-11T17:42:36.964Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/x-bot-1765474966643.jpg',
    alt: 'X Bot - How X Bot Automates Community Analytics for Web3 Projects',
    loading: 'eager'
  },
  seoDescription: 'X Bot helps crypto projects automate community management across X and Telegram with KOL tracking, bot detection, and real-time engagement analytics.'
},
{
  slug: 'blockchain-badges-2025-12-11',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Digital Credentials for Institutions',
  subtitle: 'Credential fraud undermines trust in educational and professional certification systems. Blockchain Badges enables universities and organizations to issue verifiable digital credentials with immutable blockchain proof, creating tamper-proof certificates that can be instantly verified by anyone.',
  publishDate: '2025-12-11T17:42:46.690Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/blockchain-badges-1765474977485.jpg',
    alt: 'Blockchain Badges - Blockchain Badges: Tamper-Proof Digital Credentials for Institutions',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides tamper-proof digital credentials with blockchain verification for universities and organizations to prevent fraud and enable instant verification.'
},
{
  slug: 'esg-credits-2025-12-11',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Finance',
  subtitle: 'Financial institutions face growing pressure to provide verifiable environmental impact data for sustainable asset reporting. ESG Credits delivers blockchain-based verification for green asset impact reporting with full ICMA framework compliance, enabling banks to document and track environmental performance with cryptographic proof that stakeholders can trust.',
  publishDate: '2025-12-11T17:42:57.510Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-verified environmental impact reporting for banks with ICMA compliance, enabling transparent sustainable asset tracking.'
},
{
  slug: 'fan-game-cube-2025-12-11',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Based Stadium Tokenization for Sports Engagement',
  subtitle: 'Sports clubs are searching for new revenue streams while fans crave deeper connections to live events. Fan Game Cube bridges this gap by tokenizing stadium field sections as NFTs, allowing fans to own specific coordinates and earn rewards when game-changing moments occur at their locations across football, chess, tennis, and cricket.',
  publishDate: '2025-12-11T17:43:10.273Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1765475003404.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: NFT-Based Stadium Tokenization for Sports Engagement',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes stadium sections as NFTs, letting fans earn rewards when game events occur at their coordinates across football, tennis, and cricket.'
}
];
