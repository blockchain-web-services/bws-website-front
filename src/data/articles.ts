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
  slug: 'x-bot-2025-11-18',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Analytics for Web3',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring and manual tracking. X Bot automates engagement metrics, delivers daily performance reports, and helps projects track KOL activity and reward contributors without overhead.',
  publishDate: '2025-11-18T10:03:50.265Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates community management for crypto projects with real-time engagement tracking, KOL analytics, and daily reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-18',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Verifiable Digital Certifications on Web3 Infrastructure',
  subtitle: 'Traditional digital certificates lack verifiability and portability across platforms. Blockchain Badges provides Web3-native digital certifications for events, learning achievements, and participation rewards that users truly own and can verify instantly.',
  publishDate: '2025-11-18T10:04:06.567Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides verifiable Web3 certifications for events, learning platforms, and HR tech with instant blockchain verification and user ownership.'
},
{
  slug: 'esg-credits-2025-11-18',
  product: 'ESG Credits',
  title: 'ESG Credits: Tokenize and Track Sustainability Impact on Blockchain',
  subtitle: 'Proving environmental and social impact demands transparent, verifiable tracking systems. ESG Credits certifies sustainability projects on blockchain infrastructure, enabling organizations to mint, track, and prove green action with immutable precision through the BWS.ESG API.',
  publishDate: '2025-11-18T10:04:19.468Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits tokenizes sustainability projects with blockchain verification, helping ESG fintechs, NGOs, and carbon markets track and prove environmental impact.'
},
{
  slug: 'fan-game-cube-2025-11-18',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Let Sports Fans Own Virtual Zones of Real Fields',
  subtitle: 'Sports fans crave deeper connections with their favorite teams beyond passive watching. Fan Game Cube bridges this gap by enabling fans to own virtual zones of real playing fields through NFTs tied to live in-game events, creating unprecedented engagement and revenue opportunities.',
  publishDate: '2025-11-18T10:04:32.854Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube lets sports fans own virtual field zones via NFTs tied to live gameplay, creating new engagement and revenue for clubs, leagues, and athlete brands.'
}
];
