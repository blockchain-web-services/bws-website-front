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
  title: 'How X Bot Automates Community Analytics for Crypto Projects',
  subtitle: 'Managing community engagement across X and Telegram while identifying authentic growth from bot activity is challenging for crypto projects. X Bot provides automated KOL tracking, real-time engagement metrics, and bot detection through official API integration, helping teams make data-driven decisions without manual overhead.',
  publishDate: '2025-12-11T16:44:34.187Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/x-bot-1765471484300.jpg',
    alt: 'X Bot - How X Bot Automates Community Analytics for Crypto Projects',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates community analytics for crypto projects with KOL tracking, bot detection, and real-time engagement metrics across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-12-11',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Digital Credentials for Organizations',
  subtitle: 'Credential fraud undermines trust in educational and professional certifications. Blockchain Badges enables organizations to issue verifiable digital credentials with immutable blockchain proof, providing instant verification that cannot be forged or altered.',
  publishDate: '2025-12-11T16:44:44.373Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/blockchain-badges-1765471495445.jpg',
    alt: 'Blockchain Badges - Blockchain Badges: Tamper-Proof Digital Credentials for Organizations',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges delivers tamper-proof digital credentials with blockchain verification for universities and organizations to combat credential fraud.'
},
{
  slug: 'esg-credits-2025-12-11',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Financial Institutions',
  subtitle: 'Financial institutions need verifiable environmental impact data for sustainable asset reporting. ESG Credits provides blockchain-based verification aligned with ICMA frameworks, enabling banks to document green asset performance with cryptographic proof.',
  publishDate: '2025-12-11T16:44:55.497Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-verified environmental impact reporting for banks with ICMA framework compliance and cryptographic proof.'
},
{
  slug: 'fan-game-cube-2025-12-11',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Based Sports Engagement Platform for Clubs',
  subtitle: 'Sports clubs are constantly seeking new revenue streams through digital fan engagement. Fan Game Cube offers an innovative solution by tokenizing stadium field sections as NFTs, enabling fans to own digital territory and earn rewards whenever game events occur at their coordinates.',
  publishDate: '2025-12-11T16:45:06.366Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables sports clubs to tokenize field sections as NFTs, rewarding fans when game events occur at their owned coordinates.'
}
];
