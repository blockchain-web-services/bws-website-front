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
  slug: 'x-bot-2025-11-28',
  product: 'X Bot',
  title: 'X Bot: Automated Community Tracking for Crypto Projects on Twitter and Telegram',
  subtitle: 'Managing community engagement across Twitter and Telegram is time-consuming for crypto projects. X Bot automates this process with real-time mention tracking, KOL analytics, and daily performance reports—helping teams understand their community impact without manual monitoring.',
  publishDate: '2025-11-28T10:04:05.357Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot delivers automated Twitter engagement tracking for crypto projects via Telegram. Monitor KOLs, track mentions, and generate daily community reports.'
},
{
  slug: 'blockchain-badges-2025-11-28',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for HR and Learning Platforms',
  subtitle: 'Traditional digital certificates lack verifiability and portability. Blockchain Badges transforms certifications into Web3-native credentials that can be instantly verified, permanently stored, and owned by recipients—bridging Web2 organizations seamlessly into blockchain technology.',
  publishDate: '2025-11-28T10:04:18.911Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges creates Web3-native digital certifications for HR, events, and learning platforms. Mint verifiable credentials that recipients truly own.'
},
{
  slug: 'esg-credits-2025-11-28',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Impact Certification for Sustainability Projects',
  subtitle: 'Sustainability impact today lacks standardization and verifiability. ESG Credits changes this by using blockchain to certify environmental projects, tokenize measurable impact, and deliver transparent proof of green action—fundamentally transforming how ESG data is tracked and reported.',
  publishDate: '2025-11-28T10:04:29.852Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1764324285057.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Impact Certification for Sustainability Projects',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits uses blockchain to certify sustainability projects and tokenize environmental impact. Built on ICMA framework for transparent ESG reporting.'
},
{
  slug: 'fan-game-cube-2025-11-28',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Virtual Zones Connecting Fans to Live Sports Action',
  subtitle: 'Sports fans crave deeper connections to live games beyond passive watching. Fan Game Cube transforms this desire into reality—letting fans own virtual zones of real fields through NFTs tied to live in-game events, creating unprecedented engagement and new revenue streams for clubs.',
  publishDate: '2025-11-28T10:04:45.295Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1764324300032.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: NFT-Powered Virtual Zones Connecting Fans to Live Sports Action',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube connects fans to live sports through NFT field zones. Own virtual areas, earn points from in-game action, create new revenue for sports clubs.'
}
];
