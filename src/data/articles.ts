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
  slug: 'x-bot-2025-12-10',
  product: 'X Bot',
  title: 'X Bot: Advanced Community Analytics for Crypto Projects and KOL Tracking',
  subtitle: 'Managing community engagement across multiple platforms while verifying authentic growth is challenging for crypto projects. X Bot automates this process with real-time analytics, KOL performance tracking, and bot detection—all using official API integration to help projects identify genuine traction and make confident marketing decisions.',
  publishDate: '2025-12-10T16:20:02.301Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot provides automated community analytics for crypto projects. Track 100+ KOLs, detect bot farms, and monitor real-time engagement across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-12-10',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Digital Credentials with Immutable Verification',
  subtitle: 'Credential fraud costs institutions billions while undermining trust across educational and professional systems. Blockchain Badges provides universities and organizations with a platform to issue tamper-proof certificates backed by immutable blockchain proof—enabling instant verification that simply cannot be forged.',
  publishDate: '2025-12-10T16:20:14.158Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides tamper-proof credential verification. Universities and organizations issue blockchain-backed certificates with instant verification.'
},
{
  slug: 'esg-credits-2025-12-10',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Banking',
  subtitle: 'Financial institutions face mounting pressure to provide verifiable environmental impact reporting while preventing double-counting and ensuring regulatory compliance. ESG Credits delivers blockchain-verified sustainable asset tracking with built-in ICMA framework compliance, enabling banks to integrate cryptographic environmental proof directly into their applications.',
  publishDate: '2025-12-10T16:20:27.240Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-verified environmental impact reporting for banks. Track sustainable assets with ICMA framework compliance and cryptographic proof.'
},
{
  slug: 'fan-game-cube-2025-12-10',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Blockchain-Powered Sports Engagement Through Tokenized Field Coordinates',
  subtitle: 'Sports clubs are searching for innovative revenue streams while fans crave deeper connections with the games they love. Fan Game Cube bridges this gap by tokenizing field sections as NFTs, allowing fans to own specific coordinates and earn points when real match events unfold at their locations—transforming passive viewing into active, blockchain-powered engagement.',
  publishDate: '2025-12-10T16:20:43.905Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports field coordinates as NFTs. Fans own sections and earn points from real match events across football, chess, tennis, and cricket.'
}
];
