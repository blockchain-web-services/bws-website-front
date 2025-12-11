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
  title: 'How X Bot Automates Community Tracking Across X and Telegram',
  subtitle: 'Managing crypto communities across multiple platforms requires constant monitoring of engagement, KOL performance, and authentic activity. X Bot automates this entire process with official API integration, real-time analytics, and advanced bot detection—helping projects track community growth without the manual overhead.',
  publishDate: '2025-12-11T18:12:33.784Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/x-bot-1765476762679.jpg',
    alt: 'X Bot - How X Bot Automates Community Tracking Across X and Telegram',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track 100+ KOL accounts, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-12-11',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Digital Credentials with Immutable Verification',
  subtitle: 'Credential fraud undermines trust in educational and professional certifications. Blockchain Badges provides organizations with a platform to issue verifiable digital credentials that include immutable blockchain proof, enabling instant verification and eliminating forgery.',
  publishDate: '2025-12-11T18:12:44.078Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/blockchain-badges-1765476774305.jpg',
    alt: 'Blockchain Badges - Blockchain Badges: Tamper-Proof Digital Credentials with Immutable Verification',
    loading: 'eager'
  },
  seoDescription: 'Learn how Blockchain Badges helps universities and organizations issue verifiable credentials with blockchain proof, enabling instant verification and eliminating forgery.'
},
{
  slug: 'esg-credits-2025-12-11',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Financial Institutions',
  subtitle: 'As regulatory pressure and investor demand for sustainable finance intensifies, financial institutions need verifiable proof of environmental impact for their green asset portfolios. ESG Credits delivers blockchain-based verification aligned with ICMA frameworks, enabling banks to document sustainable asset performance with immutable cryptographic proof.',
  publishDate: '2025-12-11T18:12:55.213Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'Discover how ESG Credits helps banks verify environmental impact with blockchain, providing ICMA-compliant green asset reporting and cryptographic proof for sustainability.'
},
{
  slug: 'fan-game-cube-2025-12-11',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT Stadium Sections That Generate Rewards from Live Game Events',
  subtitle: 'Sports fans crave deeper engagement with live games beyond passive viewing. Fan Game Cube transforms stadiums into interactive digital territories by dividing fields into ownable NFT sections that generate real-time rewards whenever game events unfold at those specific coordinates across football, chess, tennis, and cricket.',
  publishDate: '2025-12-11T18:13:09.471Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Learn how Fan Game Cube lets fans own NFT stadium sections and earn rewards from live game events across football, chess, tennis, and cricket for deeper engagement.'
}
];
