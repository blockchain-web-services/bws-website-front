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
  slug: 'x-bot-2025-10-21',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Performance Monitoring',
  subtitle: 'Performance on X shapes visibility, investor trust, and narrative momentum for crypto projects. X Bot automates community engagement tracking across X and Telegram, delivering real-time insights and daily reports to help projects monitor mentions, reward supporters, and amplify their social presence without manual overhead.',
  publishDate: '2025-10-21T10:03:48.479Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates community management for crypto projects with real-time KOL tracking, daily analytics reports, and cross-platform monitoring across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-10-21',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications and Achievements',
  subtitle: 'Blockchain Badges bridges the gap between Web2 organizations and Web3 capabilities by enabling verifiable digital certifications. Whether you\'re recognizing event participation, rewarding learning milestones, or unlocking achievements, this solution makes it effortless to create blockchain-based badges that deliver immediate, measurable value to your products, teams, and communities.',
  publishDate: '2025-10-21T10:04:02.623Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges enables Web3-native digital certifications for HR tech, events, and learning platforms. Create verifiable blockchain credentials in minutes.'
},
{
  slug: 'esg-credits-2025-10-21',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
  subtitle: 'Green investing demands transparent, verifiable impact reporting. ESG Credits automates ESG alignment, standardizes impact disclosures, and powers investor-grade reporting underpinned by immutable blockchain records—bringing clarity and efficiency to sustainable finance through technology.',
  publishDate: '2025-10-21T10:04:16.611Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1761041069966.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond Framework and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits delivers blockchain-powered green bond framework compliance and automated ESG reporting for sustainable finance, with visual comparison tools and immutable verification.'
},
{
  slug: 'fan-game-cube-2025-10-21',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Virtual Zones for Sports Clubs Revenue',
  subtitle: 'Sports clubs are seeking new revenue streams while fans crave deeper engagement with their favorite teams. Fan Game Cube (also called NFT Game Cube) bridges this gap by letting fans own virtual zones of real fields through NFTs tied to live in-game events. The result: transformative fan experiences and untapped revenue opportunities for clubs, leagues, and athlete brands.',
  publishDate: '2025-10-21T10:04:30.046Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports fields as NFTs, letting fans own virtual zones tied to live events. Creates new revenue for clubs and engaging experiences for supporters.'
}
];
