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
  slug: 'x-bot-2025-11-22',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Analytics for Web3',
  subtitle: 'Managing crypto community engagement across X and Telegram is time-consuming and error-prone. X Bot delivers automated tracking, real-time KOL analytics, and daily performance reports—helping Web3 projects monitor mentions, reward contributors, and build engaged communities without the manual overhead.',
  publishDate: '2025-11-22T10:03:20.812Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-11-22',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications Easily',
  subtitle: 'Traditional digital certificates lack verifiability and portability across platforms. Blockchain Badges delivers Web3-native certifications for event participation, learning achievements, and professional milestones—making it effortless for organizations to create their first blockchain-based credentials.',
  publishDate: '2025-11-22T10:03:33.449Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps HR tech, events, and learning platforms award verifiable Web3 certifications for participation and achievements.'
},
{
  slug: 'esg-credits-2025-11-22',
  product: 'ESG Credits',
  title: 'ESG Credits: Tokenize Sustainability Projects and Certify Impact',
  subtitle: 'Sustainability projects struggle to prove their environmental and social impact with credible verification. ESG Credits solves this challenge with blockchain-based certification, allowing organizations to tokenize sustainability initiatives, track green actions transparently, and demonstrate ESG compliance through the BWS.ESG API.',
  publishDate: '2025-11-22T10:03:44.096Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1763805839111.jpg',
    alt: 'ESG Credits - ESG Credits: Tokenize Sustainability Projects and Certify Impact',
    loading: 'eager'
  },
  seoDescription: 'Discover how ESG Credits helps sustainability startups and ESG fintechs tokenize impact projects, track green actions, and certify compliance on-chain.'
},
{
  slug: 'fan-game-cube-2025-11-22',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFTs Tied to Live Sports Events and Player Action',
  subtitle: 'Sports fans crave deeper engagement with the games they watch, while clubs search for innovative revenue streams. Fan Game Cube bridges this gap by letting fans own virtual zones of real fields through NFTs—turning every goal and play into earning opportunities for supporters and fresh revenue for clubs.',
  publishDate: '2025-11-22T10:03:59.166Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1763805851335.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: NFTs Tied to Live Sports Events and Player Action',
    loading: 'eager'
  },
  seoDescription: 'Learn how Fan Game Cube enables fans to own virtual sports field zones via NFTs tied to live events, creating earning opportunities and club revenue.'
}
];
