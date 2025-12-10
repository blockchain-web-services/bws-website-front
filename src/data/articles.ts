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
  title: 'X Bot: Automated Community Analytics for Crypto Projects on X and Telegram',
  subtitle: 'Managing crypto communities across multiple platforms while tracking authentic engagement is challenging. X Bot automates this process with official API integration, real-time KOL monitoring, and bot detection—helping projects identify genuine traction versus manufactured hype without manual overhead.',
  publishDate: '2025-12-10T10:03:42.493Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot tracks crypto community engagement across X and Telegram with official API integration. Monitor 100+ KOLs, detect bot farms, and get automated analytics reports.'
},
{
  slug: 'blockchain-badges-2025-12-10',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Credential Verification for Universities and Organizations',
  subtitle: 'Credential fraud costs billions annually and undermines trust in educational and professional qualifications worldwide. Blockchain Badges provides immutable, blockchain-verified credentials that universities and organizations can issue instantly—enabling tamper-proof verification that cannot be forged, altered, or manipulated.',
  publishDate: '2025-12-10T10:03:53.920Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides tamper-proof credential verification for universities. Issue blockchain-verified degrees and certificates with instant verification capability.'
},
{
  slug: 'esg-credits-2025-12-10',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Financial Institutions',
  subtitle: 'Financial institutions face mounting pressure to provide verifiable environmental impact reporting that eliminates double-counting of green investments. ESG Credits delivers blockchain-verified sustainability tracking with ICMA framework compliance, enabling banks to integrate cryptographic proof of environmental impact directly into customer-facing banking applications.',
  publishDate: '2025-12-10T10:04:11.715Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits delivers blockchain-verified environmental reporting for financial institutions. ICMA-compliant sustainability tracking with cryptographic proof for banking apps.'
},
{
  slug: 'fan-game-cube-2025-12-10',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenized Sports Field Sections for Fan Engagement Revenue',
  subtitle: 'Sports clubs are searching for revenue streams beyond traditional ticket and merchandise sales. Fan Game Cube offers a solution: tokenizing field sections as NFTs across football, chess, tennis, and cricket. Fans own specific coordinates and earn rewards when real match events unfold at their locations, creating engagement that drives revenue.',
  publishDate: '2025-12-10T10:04:25.980Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports field sections as NFTs. Fans own coordinates and earn rewards from real match events across football, chess, tennis, and cricket.'
}
];
