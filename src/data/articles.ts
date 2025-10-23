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
  slug: 'x-bot-2025-10-23',
  product: 'X Bot',
  title: 'How X Bot Automates Community Tracking and KOL Performance for Web3 Projects',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring and engagement tracking. X Bot automates this process with real-time mention tracking, KOL performance analytics, and daily automated reports—helping Web3 projects build stronger communities without the manual overhead.',
  publishDate: '2025-10-23T10:04:11.516Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates community tracking for crypto projects. Monitor X mentions, track KOL performance, and generate daily engagement reports across Telegram groups with one-minute setup.'
},
{
  slug: 'blockchain-badges-2025-10-23',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Education and Events',
  subtitle: 'Traditional digital credentials lack verification and portability. Blockchain Badges provides Web3-native digital certifications for educational achievements, event participation, and professional accomplishments, making it effortless to create verifiable on-chain credentials that recipients truly own.',
  publishDate: '2025-10-23T10:04:23.137Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides Web3-native digital certifications for education, events, and professional achievements. Issue verifiable on-chain credentials that recipients own permanently.'
},
{
  slug: 'esg-credits-2025-10-23',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
  subtitle: 'Green finance demands transparent, standardized ESG reporting that investors can trust. ESG Credits delivers exactly that—automating impact alignment, standardizing disclosures, and powering investor-grade reporting through immutable blockchain records that make green investing both frictionless and verifiable.',
  publishDate: '2025-10-23T10:04:36.671Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761213891218.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-powered green bond frameworks and impact reporting. Automate ESG disclosures, compare frameworks, and verify sustainability with immutable records.'
},
{
  slug: 'fan-game-cube-2025-10-23',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Based Virtual Field Ownership for Sports Clubs',
  subtitle: 'Sports fans crave deeper engagement with their favorite teams and athletes. Fan Game Cube transforms this desire into reality by letting fans own virtual zones of real playing fields through NFTs tied to live in-game events—creating immersive fan experiences and new revenue streams for clubs without requiring any crypto expertise.',
  publishDate: '2025-10-23T10:04:51.401Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables virtual field ownership through NFTs tied to live sports events. Create new fan engagement and revenue for clubs without requiring crypto expertise.'
}
];
