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
  slug: 'x-bot-2025-10-28',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Performance for Crypto Projects',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and analytics. X Bot delivers automated tracking, real-time engagement metrics, and daily performance reports—helping projects amplify visibility and reward contributors without the manual overhead.',
  publishDate: '2025-10-28T10:04:22.923Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-10-28',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications at Scale',
  subtitle: 'Digital credentials need verifiable proof and permanent records. Blockchain Badges makes it effortless to create blockchain-based certifications for events, learning achievements, and participation rewards, bringing Web2 organizations seamlessly into Web3.',
  publishDate: '2025-10-28T10:04:35.151Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps organizations issue tamper-proof digital certifications for events, learning, and achievements using blockchain verification.'
},
{
  slug: 'esg-credits-2025-10-28',
  product: 'ESG Credits',
  title: 'ESG Credits: Certify Impact and Tokenize Sustainability Projects On-Chain',
  subtitle: 'Green finance demands transparent, verifiable impact reporting. ESG Credits automates ESG alignment, standardizes disclosures, and powers investor-grade reporting with immutable blockchain records—making sustainable investing frictionless for advisors and issuers alike.',
  publishDate: '2025-10-28T10:04:48.352Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761645903922.jpg',
    alt: 'ESG Credits - ESG Credits: Certify Impact and Tokenize Sustainability Projects On-Chain',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits automates green bond impact reporting, standardizes ESG disclosures, and enables blockchain-verified sustainability tracking for investors.'
},
{
  slug: 'fan-game-cube-2025-10-28',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Let Fans Own Virtual Zones of Real Sports Fields',
  subtitle: 'Sports clubs need new revenue streams and deeper fan engagement. Fan Game Cube enables fans to own virtual zones tied to live in-game events, creating tokenized experiences where fans earn points and clubs unlock sustainable revenue—all without crypto complexity.',
  publishDate: '2025-10-28T10:05:04.129Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1761645917966.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: Let Fans Own Virtual Zones of Real Sports Fields',
    loading: 'eager'
  },
  seoDescription: 'Explore how Fan Game Cube lets fans own virtual field zones through NFTs tied to live sports events, creating new revenue streams for clubs and teams.'
}
];
