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
  slug: 'x-bot-2025-12-08',
  product: 'X Bot',
  title: 'X Bot: Automated Community Analytics and KOL Tracking for Web3',
  subtitle: 'Managing crypto communities across multiple platforms requires distinguishing authentic engagement from bot activity. X Bot automates this challenge through official X API integration, tracking 100+ KOL accounts simultaneously while detecting inauthentic patterns—helping projects measure real community growth without the manual monitoring overhead.',
  publishDate: '2025-12-08T10:03:53.530Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot tracks crypto community engagement across 100+ KOL accounts with official X API integration, bot farm detection, and automated daily reports.'
},
{
  slug: 'blockchain-badges-2025-12-08',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Digital Credentials with Cryptographic Verification',
  subtitle: 'Credential fraud costs billions annually, undermining trust in educational and professional certifications. Blockchain Badges enables universities and companies to issue tamper-proof certificates with immutable blockchain proof, providing instant verification while preventing forgery through cryptographic storage that eliminates manual authentication overhead.',
  publishDate: '2025-12-08T10:04:02.882Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges issues tamper-proof credentials with blockchain verification, visual designer, and bulk issuance API for universities and companies.'
},
{
  slug: 'esg-credits-2025-12-08',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Banking Apps',
  subtitle: 'Financial institutions face mounting pressure to verify environmental impact claims while preventing double-counting of green investments. ESG Credits delivers blockchain-verified environmental impact reporting that integrates directly into banking applications, enabling ICMA framework compliance and empowering customers to track sustainable asset performance with cryptographic proof.',
  publishDate: '2025-12-08T10:04:13.655Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits delivers blockchain-verified environmental impact reporting for banks with ICMA compliance and double-counting prevention for green assets.'
},
{
  slug: 'fan-game-cube-2025-12-08',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Based Sports Engagement with Tokenized Field Zones',
  subtitle: 'When the final whistle blows, fan engagement traditionally ends—and so does the revenue opportunity. Fan Game Cube changes this by tokenizing field sections as NFTs, allowing fans to own specific coordinates and earn points when real game events occur at their locations. This creates continuous revenue streams across football, chess, tennis, and cricket.',
  publishDate: '2025-12-08T10:04:24.022Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes field zones as NFTs where fans earn points from real match events, creating new revenue streams for sports clubs.'
}
];
