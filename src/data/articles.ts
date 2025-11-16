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
  slug: 'x-bot-2025-11-16',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement Across Telegram and X',
  subtitle: 'Managing crypto communities across multiple platforms requires constant monitoring and manual tracking. X Bot automates this process with real-time analytics, KOL performance tracking, and automated engagement reports, helping Web3 projects build stronger communities without the operational overhead.',
  publishDate: '2025-11-16T10:03:12.383Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-16',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications for Events and Learning',
  subtitle: 'Traditional digital credentials lack verifiability and portability across platforms. Blockchain Badges provides Web3-native certifications for event participation, learning achievements, and professional milestones, creating tamper-proof credentials that recipients truly own.',
  publishDate: '2025-11-16T10:03:25.209Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps organizations award verifiable Web3 certifications for events, learning platforms, and HR tech with easy Web2 to Web3 onboarding.'
},
{
  slug: 'esg-credits-2025-11-16',
  product: 'ESG Credits',
  title: 'ESG Credits: Tokenize Sustainability Impact with Blockchain-Verified Reporting',
  subtitle: 'Traditional ESG reporting suffers from a critical transparency problem—lacking standardization across global markets and verifiable proof of impact. ESG Credits solves this through blockchain verification, enabling organizations to tokenize sustainability projects, track green initiatives in real-time, and prove environmental action with immutable, auditable records.',
  publishDate: '2025-11-16T10:03:35.655Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1763287434481.jpg',
    alt: 'ESG Credits - ESG Credits: Tokenize Sustainability Impact with Blockchain-Verified Reporting',
    loading: 'eager'
  },
  seoDescription: 'Discover how ESG Credits enables blockchain-verified sustainability reporting with ICMA framework compliance, multilingual support, and tokenized impact tracking.'
},
{
  slug: 'fan-game-cube-2025-11-16',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Let Sports Fans Own Virtual Zones and Earn from Live Events',
  subtitle: 'Sports fans crave deeper engagement beyond passive viewing. Fan Game Cube bridges this gap by enabling fans to own virtual zones of real sports fields through NFTs tied to live in-game events—creating new revenue streams for clubs while rewarding active fan participation.',
  publishDate: '2025-11-16T10:03:54.676Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Learn how Fan Game Cube lets sports fans own virtual field zones via NFTs, earn from live match events, and helps clubs create new revenue streams.'
}
];
