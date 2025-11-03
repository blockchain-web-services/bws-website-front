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
  slug: 'x-bot-2025-10-31',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement for Web3 Projects',
  subtitle: 'Managing crypto communities across X (Twitter) and Telegram requires constant monitoring and manual effort. X Bot eliminates this overhead by automating post tracking, delivering real-time analytics, and generating comprehensive engagement reports—helping Web3 projects build thriving communities without the constant grind.',
  publishDate: '2025-10-31T10:04:03.318Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-10-31',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications and Achievements',
  subtitle: 'Traditional digital certifications lack verifiability and portability across platforms. Blockchain Badges delivers Web3-native digital certifications for event participation, learning rewards, and achievement unlocks, making it effortless to create blockchain-based credentials that bring immediate value.',
  publishDate: '2025-10-31T10:04:20.878Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges delivers Web3-native digital certifications for HR tech, events, and learning platforms with verifiable blockchain-backed credentials.'
},
{
  slug: 'esg-credits-2025-10-31',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
  subtitle: 'Green finance struggles with fragmented ESG disclosure and opaque impact tracking. ESG Credits transforms green bond reporting through automated impact alignment, standardized disclosures, and investor-grade reporting—all underpinned by immutable blockchain verification.',
  publishDate: '2025-10-31T10:04:32.586Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761905086180.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits transforms green finance with blockchain-backed impact reporting, automated ESG alignment, and portfolio-scale sustainability tracking.'
},
{
  slug: 'fan-game-cube-2025-10-31',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenize Sports Fields and Create New Fan Experiences',
  subtitle: 'Sports fans crave deeper engagement while clubs search for innovative revenue streams. Fan Game Cube (also called NFT Game Cube) bridges this gap by letting fans own virtual zones of real fields through NFTs—transforming live in-game events into fresh experiences that benefit both fans and clubs.',
  publishDate: '2025-10-31T10:04:46.337Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Discover how Fan Game Cube tokenizes sports fields, letting fans own virtual zones tied to live in-game events while generating new revenue for clubs.'
}
];
