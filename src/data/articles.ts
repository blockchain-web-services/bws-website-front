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
  slug: 'x-bot-2025-11-21',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Analytics for Web3',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and manual effort. X Bot automates this process with real-time tracking, automated leaderboards, and KOL analytics, helping Web3 projects monitor engagement and reward contributors without overhead.',
  publishDate: '2025-11-21T10:04:05.532Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-21',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Learning and Events',
  subtitle: 'Traditional digital certificates lack verification and portability, leaving organizations vulnerable to fraud and users without true ownership. Blockchain Badges transforms this landscape by bringing Web3-native digital certifications to HR tech, events, and learning platforms—making it effortless to create blockchain-based badges that prove achievements with instant trust.',
  publishDate: '2025-11-21T10:04:19.358Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps organizations issue Web3-native digital certifications for events, learning, and achievements with instant on-chain verification.'
},
{
  slug: 'esg-credits-2025-11-21',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Impact Reporting for Green Finance',
  subtitle: 'Sustainability projects struggle with verification and transparency in reporting environmental impact. ESG Credits solves this by certifying impact through blockchain, tokenizing sustainability projects and enabling organizations to mint, track, and prove green action with the BWS.ESG API.',
  publishDate: '2025-11-21T10:04:33.083Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1763719486478.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Impact Reporting for Green Finance',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits uses blockchain to certify sustainability projects, enabling transparent impact reporting for green finance with the BWS.ESG API framework.'
},
{
  slug: 'fan-game-cube-2025-11-21',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Let Fans Own Virtual Zones of Real Sports Fields',
  subtitle: 'Sports clubs need new revenue streams and deeper fan engagement. Fan Game Cube bridges this gap by enabling fans to own virtual zones of real fields through NFTs tied to live in-game events—creating new revenue for clubs while fans earn points from goals and plays happening in their zones.',
  publishDate: '2025-11-21T10:04:46.544Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1763719503029.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: Let Fans Own Virtual Zones of Real Sports Fields',
    loading: 'eager'
  },
  seoDescription: 'Discover how Fan Game Cube enables fans to own NFT-based virtual field zones tied to real sports events, creating new revenue for clubs and engagement for fans.'
}
];
