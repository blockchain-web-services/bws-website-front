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
  slug: 'x-bot-2025-12-01',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Analytics for Web3',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring and manual tracking. X Bot automates engagement metrics, KOL performance analysis, and daily reporting, helping Web3 projects build data-driven communities without the overhead.',
  publishDate: '2025-12-01T10:04:12.022Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-12-01',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Web2 Organizations',
  subtitle: 'Traditional digital credentials lack verifiability and portability across platforms. Blockchain Badges provides Web3-native certifications that organizations can award for events, learning achievements, and milestones—bridging Web2 recognition systems with blockchain permanence.',
  publishDate: '2025-12-01T10:04:26.241Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps HR tech, events, and learning platforms issue verifiable Web3 credentials without blockchain expertise through simple tools.'
},
{
  slug: 'esg-credits-2025-12-01',
  product: 'ESG Credits',
  title: 'ESG Credits: Tokenize and Certify Sustainability Projects on Blockchain',
  subtitle: 'Sustainability initiatives struggle to prove their environmental and social impact with verifiable evidence. ESG Credits solves this challenge by enabling organizations to certify impact, tokenize sustainability projects, and provide blockchain-verified proof of green action that stakeholders can trust.',
  publishDate: '2025-12-01T10:04:39.383Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1764583494272.jpg',
    alt: 'ESG Credits - ESG Credits: Tokenize and Certify Sustainability Projects on Blockchain',
    loading: 'eager'
  },
  seoDescription: 'Discover how ESG Credits helps sustainability startups, NGOs, and ESG fintechs certify impact and tokenize projects with blockchain-based verification tools.'
},
{
  slug: 'fan-game-cube-2025-12-01',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Based Fan Engagement for Sports and Entertainment',
  subtitle: 'Sports fans crave deeper connections with their teams beyond passive watching. Fan Game Cube transforms this relationship by letting fans own virtual zones of real fields through NFTs tied to live in-game events—creating new revenue streams for clubs while rewarding active fan engagement.',
  publishDate: '2025-12-01T10:04:54.353Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1764583507583.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: NFT-Based Fan Engagement for Sports and Entertainment',
    loading: 'eager'
  },
  seoDescription: 'Learn how Fan Game Cube helps sports clubs and leagues engage fans through NFT-based virtual field ownership tied to live in-game events and rewards.'
}
];
