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
  slug: 'x-bot-2025-11-29',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Analytics for Crypto Projects',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring and real-time insights. X Bot delivers automated engagement tracking, daily performance reports, and KOL analytics—helping projects amplify community support without manual overhead.',
  publishDate: '2025-11-29T10:04:06.794Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-29',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications and Achievements',
  subtitle: 'Digital certifications need verifiable proof and permanent records. Blockchain Badges provides Web3-native achievement recognition for HR tech, events, and learning platforms—enabling organizations to award tamper-proof credentials that recipients truly own.',
  publishDate: '2025-11-29T10:04:21.204Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps HR tech, events, and learning platforms issue Web3-native digital certifications with permanent verification and true ownership.'
},
{
  slug: 'esg-credits-2025-11-29',
  product: 'ESG Credits',
  title: 'ESG Credits: Certify Sustainability Impact with Tokenized Carbon Credits',
  subtitle: 'Corporate sustainability commitments demand verifiable proof, not just promises. ESG Credits enables organizations to tokenize environmental initiatives, track measurable carbon reduction, and demonstrate genuine green action through the BWS.ESG API—transforming sustainability claims into transparent, blockchain-verified assets.',
  publishDate: '2025-11-29T10:04:32.029Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1764410686387.jpg',
    alt: 'ESG Credits - ESG Credits: Certify Sustainability Impact with Tokenized Carbon Credits',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits helps sustainability startups, NGOs, and corporations tokenize environmental impact with the BWS.ESG API for transparent carbon credit tracking.'
},
{
  slug: 'fan-game-cube-2025-11-29',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Sports Fans Own Virtual Field Zones Tied to Live Events',
  subtitle: 'Sports engagement needs to evolve beyond passive viewing. Fan Game Cube allows fans to own virtual zones of real playing fields through NFTs—earning points when live in-game events occur in their zones—while clubs unlock entirely new revenue streams.',
  publishDate: '2025-11-29T10:04:46.687Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1764410697506.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: Sports Fans Own Virtual Field Zones Tied to Live Events',
    loading: 'eager'
  },
  seoDescription: 'Learn how Fan Game Cube helps sports clubs and leagues create new revenue by letting fans own virtual field zones tied to live in-game events through blockchain NFTs.'
}
];
