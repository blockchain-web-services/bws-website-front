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
  slug: 'x-bot-2025-11-27',
  product: 'X Bot',
  title: 'X Bot: Automate Community Engagement Tracking for Crypto Projects',
  subtitle: 'Managing community engagement across X (Twitter) and Telegram is challenging for crypto projects. X Bot delivers real-time analytics, automated leaderboards, and KOL performance tracking—helping teams monitor mentions, reward contributors, and build engaged communities without manual overhead.',
  publishDate: '2025-11-27T10:04:01.129Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-11-27',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3-Native Digital Certifications Seamlessly',
  subtitle: 'Traditional digital certificates lack verifiability and portability, creating challenges for organizations and recipients alike. Blockchain Badges solves this with Web3-native digital certifications for event participation, learning rewards, and achievement unlocks—bridging Web2 organizations into blockchain technology with plug-and-play simplicity.',
  publishDate: '2025-11-27T10:04:14.862Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps HR tech, events, and learning platforms issue Web3-native digital certifications with blockchain verification and portability.'
},
{
  slug: 'esg-credits-2025-11-27',
  product: 'ESG Credits',
  title: 'ESG Credits: Certify and Tokenize Sustainability Impact On-Chain',
  subtitle: 'Proving environmental impact and sustainability efforts lacks transparency and standardization. ESG Credits solves this by certifying impact and tokenizing sustainability projects using blockchain, enabling organizations to mint, track, and prove green action with the BWS.ESG API.',
  publishDate: '2025-11-27T10:04:29.256Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1764237883299.jpg',
    alt: 'ESG Credits - ESG Credits: Certify and Tokenize Sustainability Impact On-Chain',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits helps sustainability organizations certify impact and tokenize green projects with blockchain verification using the BWS.ESG API framework.'
},
{
  slug: 'fan-game-cube-2025-11-27',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Sports Fans Own Virtual Field Zones as NFTs',
  subtitle: 'Traditional sports fan engagement remains transactional and passive, leaving untapped potential on the table. Fan Game Cube (also called NFT Game Cube) changes this dynamic by letting fans own virtual zones of real playing fields through NFTs—zones that come alive during matches, rewarding holders when live in-game events unfold in their territory while creating powerful new revenue streams for clubs.',
  publishDate: '2025-11-27T10:04:43.730Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1764237905659.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: Sports Fans Own Virtual Field Zones as NFTs',
    loading: 'eager'
  },
  seoDescription: 'Discover how Fan Game Cube enables sports fans to own virtual field zones as NFTs, earning rewards from live in-game events while clubs generate new revenue streams.'
}
];
