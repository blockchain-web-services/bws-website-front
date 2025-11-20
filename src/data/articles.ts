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
  slug: 'x-bot-2025-11-20',
  product: 'X Bot',
  title: 'X Bot: Automated Community Tracking and Analytics for Crypto Projects',
  subtitle: 'Managing crypto community engagement across X (Twitter) and Telegram is time-intensive and often inaccurate. X Bot automates tracking, delivers real-time analytics, monitors KOL performance, and generates daily reports—helping projects understand engagement without manual overhead.',
  publishDate: '2025-11-20T10:03:48.273Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot delivers automated community analytics for crypto projects. Track X and Telegram engagement, monitor KOL performance, and generate daily reports in real-time.'
},
{
  slug: 'blockchain-badges-2025-11-20',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Events and Learning',
  subtitle: 'Traditional digital certifications lack verifiable proof and true ownership. Blockchain Badges transforms this by enabling organizations to award Web3-native credentials for event participation, learning achievements, and milestone unlocks—bringing transparency and permanent ownership to digital recognition.',
  publishDate: '2025-11-20T10:04:03.486Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges delivers Web3-native certifications for events and learning platforms. Award verifiable credentials with on-chain proof through simple badge creation.'
},
{
  slug: 'esg-credits-2025-11-20',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Impact Reporting for Sustainability Projects',
  subtitle: 'Sustainability projects struggle with credible impact verification and transparent reporting. ESG Credits transforms this challenge by tokenizing environmental initiatives, certifying measurable impact, and providing blockchain-based proof—empowering sustainability startups, NGOs, and ESG fintechs to demonstrate authentic green action with unprecedented transparency.',
  publishDate: '2025-11-20T10:04:18.732Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1763633073249.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Verified Impact Reporting for Sustainability Projects',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits delivers blockchain-verified sustainability reporting. Tokenize environmental projects, certify impact, and provide transparent proof through the BWS.ESG API.'
},
{
  slug: 'fan-game-cube-2025-11-20',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT Sports Gaming Where Fans Own Virtual Field Zones',
  subtitle: 'Sports fans crave deeper engagement beyond passive watching. Fan Game Cube transforms this relationship by letting fans purchase NFTs representing virtual zones of real playing fields, earning points when in-game events occur in their zones—creating new revenue streams for clubs while forging authentic fan connections.',
  publishDate: '2025-11-20T10:04:33.473Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1763633086115.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: NFT Sports Gaming Where Fans Own Virtual Field Zones',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube enables fans to own NFT zones of real sports fields. Earn points from live in-game events while clubs generate new revenue from blockchain gaming.'
}
];
