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
  slug: 'x-bot-2025-10-26',
  product: 'X Bot',
  title: 'X Bot: Automated Community Tracking and Engagement Analytics for Crypto Projects',
  subtitle: 'Managing crypto community engagement across X and Telegram manually is time-consuming and inefficient. X Bot automates mention tracking, delivers real-time analytics, and helps projects monitor KOL performance with daily reports—all configured in under one minute.',
  publishDate: '2025-10-26T10:03:37.711Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates crypto community tracking across X and Telegram with real-time analytics, KOL monitoring, and daily engagement reports. Setup takes one minute.'
},
{
  slug: 'blockchain-badges-2025-10-26',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Learning and Achievement Recognition',
  subtitle: 'Traditional digital certification systems struggle with verification and portability across platforms. Blockchain Badges solves this with Web3-native digital certifications for events, learning platforms, and achievement recognition—seamlessly bridging Web2 customers into Web3 with active badge minting already underway.',
  publishDate: '2025-10-26T10:03:53.457Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides Web3-native digital certifications for events, learning platforms, and HR tech. Active badge minting brings Web2 customers into Web3.'
},
{
  slug: 'esg-credits-2025-10-26',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Finance and Impact Reporting Solution',
  subtitle: 'Green finance struggles with transparency and fragmented impact reporting. ESG Credits solves this by certifying sustainability impact, tokenizing green projects, and automating ESG disclosures—all backed by blockchain verification that makes green investing frictionless for advisors and investors alike.',
  publishDate: '2025-10-26T10:04:08.014Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761473063139.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Finance and Impact Reporting Solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits delivers blockchain-powered green finance reporting with automated disclosures, visual framework comparison, and ICMA-aligned impact certification for investors.'
},
{
  slug: 'fan-game-cube-2025-10-26',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Based Sports Field Tokenization Creating New Fan Experiences',
  subtitle: 'Sports clubs need new revenue streams while fans crave deeper engagement. Fan Game Cube bridges this gap by letting fans own virtual zones of real sports fields through NFTs tied to live in-game events—creating unprecedented experiences for fans and sustainable revenue for clubs.',
  publishDate: '2025-10-26T10:04:23.301Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1761473077494.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: NFT-Based Sports Field Tokenization Creating New Fan Experiences',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube lets fans own virtual sports field zones via NFTs tied to live game events. Earn points when plays happen in your zones—new revenue for clubs.'
}
];
