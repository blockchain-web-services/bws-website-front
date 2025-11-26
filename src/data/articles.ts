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
  slug: 'x-bot-2025-11-26',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Analytics for Web3',
  subtitle: 'Managing crypto community engagement across X (Twitter) and Telegram is time-consuming and error-prone. X Bot automates the entire process with real-time tracking, daily performance reports, and KOL analytics—helping projects monitor mentions, reward contributors, and build data-driven communities without manual overhead.',
  publishDate: '2025-11-26T10:03:41.858Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates crypto community management with real-time X and Telegram tracking, KOL analytics, automated leaderboards, and daily reports. Setup in one minute.'
},
{
  slug: 'blockchain-badges-2025-11-26',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications for Achievement Recognition',
  subtitle: 'Traditional digital credentials lack verifiability and portability across platforms. Blockchain Badges provides Web3-native digital certifications that organizations can award for event participation, learning achievements, and milestone unlocks—creating tamper-proof records that recipients own forever.',
  publishDate: '2025-11-26T10:03:58.135Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges creates Web3-native digital certifications for events, learning, and HR tech. Issue tamper-proof credentials that recipients own forever.'
},
{
  slug: 'esg-credits-2025-11-26',
  product: 'ESG Credits',
  title: 'ESG Credits: Tokenize and Track Sustainability Impact On-Chain',
  subtitle: 'Proving environmental and social impact remains one of the biggest challenges facing sustainability initiatives today. ESG Credits addresses this by using the BWS.ESG API to certify impact, tokenize sustainability projects, and create verifiable on-chain records—enabling NGOs, startups, and corporate actors to demonstrate green action with unprecedented transparency.',
  publishDate: '2025-11-26T10:04:08.617Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits API certifies sustainability impact on-chain. Tokenize projects, track environmental action, and prove green finance with ICMA-aligned blockchain verification.'
},
{
  slug: 'fan-game-cube-2025-11-26',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT-Powered Virtual Zones for Sports Fan Engagement',
  subtitle: 'Sports fans crave deeper connections to live games, while clubs search for new revenue streams. Fan Game Cube bridges this gap by letting fans own virtual zones of real fields through NFTs—transforming passive viewing into interactive experiences where fans earn points from actual plays as clubs unlock innovative revenue opportunities.',
  publishDate: '2025-11-26T10:04:21.286Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
    alt: 'Fan Game Cube solution',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube NFTs let fans own virtual zones of real sports fields. Earn points from live in-game events while clubs create new revenue streams through blockchain.'
}
];
