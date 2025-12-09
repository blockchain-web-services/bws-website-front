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
  slug: 'x-bot-2025-12-09',
  product: 'X Bot',
  title: 'X Bot: Automated Community Analytics for Web3 Projects and KOLs',
  subtitle: 'Managing crypto community growth across multiple platforms requires verifiable engagement data. X Bot automates KOL tracking and engagement analytics across X and Telegram through official API integration, helping projects identify authentic community growth versus manufactured hype.',
  publishDate: '2025-12-09T17:35:40.680Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates KOL tracking and community analytics for Web3 projects. Monitor 100+ accounts simultaneously with verified engagement metrics across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-12-09',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Credential Verification for Educational Institutions',
  subtitle: 'Credential fraud undermines trust across educational and professional systems worldwide. Blockchain Badges provides universities and organizations with immutable blockchain-backed certificates that enable instant verification while eliminating the possibility of forgery or alteration.',
  publishDate: '2025-12-09T17:35:51.550Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides tamper-proof credential verification for universities and organizations. Issue blockchain-backed certificates with instant verification.'
},
{
  slug: 'esg-credits-2025-12-09',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact for Banking Applications',
  subtitle: 'Financial institutions need verifiable environmental impact data for sustainable asset reporting. ESG Credits delivers blockchain-verified environmental tracking with ICMA framework compliance, enabling banks to integrate cryptographic proof directly into their applications.',
  publishDate: '2025-12-09T17:36:03.283Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/esg-credits/esg-credits-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-verified environmental reporting for banks. ICMA framework compliance with cryptographic proof prevents green investment double-counting.'
},
{
  slug: 'fan-game-cube-2025-12-09',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenized Field Sections Connecting Fans to Real Match Events',
  subtitle: 'Traditional fan engagement offers passive viewing experiences without ownership stakes. Fan Game Cube transforms this dynamic by tokenizing specific field coordinates as NFTs across multiple sports, enabling fans to earn rewards when game events occur at their owned locations.',
  publishDate: '2025-12-09T17:36:15.078Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes field coordinates across football, chess, tennis, and cricket. Fans own NFT sections and earn rewards when match events occur at their locations.'
}
];
