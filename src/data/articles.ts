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
  slug: 'x-bot-2025-10-24',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Boost Web3 Engagement',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring and manual tracking. X Bot delivers automated engagement analytics, real-time KOL performance tracking, and daily community reports, helping Web3 projects build momentum without the overhead.',
  publishDate: '2025-10-24T10:04:27.090Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot delivers automated X (Twitter) engagement tracking for crypto projects. Monitor KOLs, track mentions, generate daily reports, and gamify community support.'
},
{
  slug: 'blockchain-badges-2025-10-24',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3 Digital Certifications That Matter',
  subtitle: 'Traditional digital certificates lack verification and portability, leaving recipients with credentials they don\'t truly own. Blockchain Badges changes this by providing Web3-native digital certifications for events, learning achievements, and participation rewards—making it effortless to create verified credentials that recipients can control and carry anywhere.',
  publishDate: '2025-10-24T10:04:41.448Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Create blockchain-verified digital badges for events, learning achievements, and participation rewards. Web2-friendly solution with Web3 verification and ownership.'
},
{
  slug: 'esg-credits-2025-10-24',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Finance Reporting and Verification',
  subtitle: 'Green finance lacks standardized reporting and transparent verification. ESG Credits automates impact alignment, standardizes ESG disclosures, and powers investor-grade reporting - all underpinned by immutable blockchain records that transform how sustainability projects are tracked and certified.',
  publishDate: '2025-10-24T10:04:56.657Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761300312987.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Finance Reporting and Verification',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-verified green bond reporting and sustainability certification. Automate impact alignment with standardized ESG disclosures.'
},
{
  slug: 'fan-game-cube-2025-10-24',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Let Sports Fans Own Virtual Zones of Real Fields',
  subtitle: 'Sports fans crave deeper engagement beyond passive watching. Fan Game Cube delivers by enabling fans to own virtual zones of real fields through NFTs—each tied to live in-game events like goals and plays—creating immersive experiences for fans while unlocking new revenue streams for clubs.',
  publishDate: '2025-10-24T10:05:13.100Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables sports fans to own virtual field zones tied to real game events. Web2-friendly NFT solution creating new engagement and club revenue.'
}
];
