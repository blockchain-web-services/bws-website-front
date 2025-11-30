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
  slug: 'x-bot-2025-11-30',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Analytics for Web3 Projects',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring and analytics. X Bot delivers automated engagement tracking, real-time KOL performance metrics, and daily reports—helping Web3 projects build engaged communities without the manual overhead.',
  publishDate: '2025-11-30T10:03:28.046Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-30',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications and Achievement NFTs',
  subtitle: 'Traditional digital certificates lack verifiability and portability, leaving recipients with credentials they can\'t truly own or easily verify. Blockchain Badges transforms credentialing with Web3-native digital certifications for event participation, learning rewards, and achievement unlocks that recipients truly own and can verify on-chain.',
  publishDate: '2025-11-30T10:03:40.360Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges delivers Web3-native digital certifications for HR tech, events, and learning platforms. Issue verifiable badges for achievements that recipients truly own.'
},
{
  slug: 'esg-credits-2025-11-30',
  product: 'ESG Credits',
  title: 'ESG Credits: Certify and Tokenize Sustainability Impact with Blockchain',
  subtitle: 'Proving sustainability impact lacks transparency and standardization. ESG Credits uses the BWS.ESG API to mint, track, and certify green action on blockchain, helping sustainability startups, NGOs, and ESG fintechs demonstrate verifiable environmental contributions.',
  publishDate: '2025-11-30T10:03:52.490Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits certifies and tokenizes sustainability projects using blockchain. Built on ICMA framework, it helps NGOs, fintechs, and corporates prove environmental impact.'
},
{
  slug: 'fan-game-cube-2025-11-30',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Let Sports Fans Own Virtual Zones of Real Fields',
  subtitle: 'Sports fan engagement has long been one-way and transactional. Fan Game Cube transforms this dynamic with NFTs tied to virtual zones of real fields, enabling fans to earn points from live in-game events while clubs unlock new revenue streams through digital ownership.',
  publishDate: '2025-11-30T10:04:04.030Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables sports fans to own virtual field zones tied to live events. Fans earn points, clubs earn revenue through innovative NFT-based engagement.'
}
];
