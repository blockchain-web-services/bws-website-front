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
  slug: 'x-bot-2025-11-05',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Analytics for Web3',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and manual tracking. X Bot eliminates this overhead by delivering automated analytics, real-time mention tracking, and engagement scoring directly in your Telegram group—helping projects build data-driven communities without the busywork.',
  publishDate: '2025-11-05T10:03:46.565Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-05',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Learning and Events',
  subtitle: 'Traditional digital credentials lack verifiability and portability across platforms. Blockchain Badges solves this by issuing Web3-native certifications that are tamper-proof, instantly verifiable, and owned by recipients—transforming how organizations recognize achievement, participation, and learning outcomes.',
  publishDate: '2025-11-05T10:04:00.048Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges enables organizations to issue Web3-native certifications for learning, events, and achievements with verifiable, tamper-proof credentials.'
},
{
  slug: 'esg-credits-2025-11-05',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
  subtitle: 'Green investing lacks standardized, transparent impact reporting that investors can trust. ESG Credits automates ESG disclosure, enables framework comparison, and provides immutable on-chain certification—making sustainable finance frictionless, verifiable, and investor-grade while targeting Europe\'s 60M TAM in yearly fees.',
  publishDate: '2025-11-05T10:04:15.002Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1762337069954.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'Explore how ESG Credits delivers blockchain-powered green bond frameworks, automated impact reporting, and transparent ESG disclosure for sustainable investors.'
},
{
  slug: 'fan-game-cube-2025-11-05',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Based Sports Field Tokenization for Clubs and Fans',
  subtitle: 'Sports clubs need new revenue streams while fans crave deeper engagement beyond traditional merchandise. Fan Game Cube (also called NFT Game Cube) bridges this gap by tokenizing real sports fields into virtual zones tied to live events. Fans can own field sections and earn points from in-game actions, while clubs unlock untapped revenue—all without requiring crypto knowledge.',
  publishDate: '2025-11-05T10:04:30.061Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Discover how Fan Game Cube enables sports clubs to tokenize fields as NFTs, letting fans own zones, earn from live events, and creating new revenue opportunities.'
}
];
