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
  slug: 'x-bot-2025-10-18',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Boost Web3 Engagement',
  subtitle: 'Managing crypto community performance across X and Telegram requires constant monitoring and manual tracking. X Bot automates this process with real-time analytics, KOL performance tracking, and daily engagement reports, helping Web3 projects build momentum without the overhead.',
  publishDate: '2025-10-18T08:31:11.799Z',
  tweetId: '1972574130726641683',
  featuredImage: {
    src: '/assets/images/articles/x-bot-1760776271800.jpg',
    alt: 'X Bot - X Bot: Automate Community Tracking and Boost Web3 Engagement',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot automates crypto community management with real-time KOL tracking, daily engagement reports, and seamless Telegram integration for Web3 projects.'
},
{
  slug: 'blockchain-badges-2025-10-18',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Web3-Native Digital Certifications Made Simple',
  subtitle: 'Traditional digital credentials lack verification, portability, and blockchain security. Blockchain Badges creates Web3-native certifications for events, learning platforms, and achievement systems, making it effortless to issue verifiable credentials that recipients truly own.',
  publishDate: '2025-10-18T08:31:13.343Z',
  tweetId: '1924366298617729264',
  featuredImage: {
    src: '/assets/images/articles/blockchain-badges-1760776273343.jpg',
    alt: 'Blockchain Badges - Blockchain Badges: Web3-Native Digital Certifications Made Simple',
    loading: 'eager'
  },
  seoDescription: 'Discover Blockchain Badges: Web3-native digital certifications for events, education, and achievements. Issue verifiable credentials with blockchain security.'
},
{
  slug: 'esg-credits-2025-10-18',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Powered Green Bond and Impact Reporting',
  subtitle: 'Green finance requires transparent, verifiable impact reporting that investors can trust. ESG Credits automates ESG alignment, standardizes disclosures, and powers investor-grade reports with blockchain verification, making sustainable investment frictionless and auditable.',
  publishDate: '2025-10-18T08:31:13.648Z',
  tweetId: '1919379287087444072',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1760776273648.jpg',
    alt: 'ESG Credits - ESG Credits: Blockchain-Powered Green Bond and Impact Reporting',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits delivers blockchain-verified sustainability reporting aligned with ICMA frameworks. Automate green bond disclosures with transparent, investor-grade impact tracking.'
},
{
  slug: 'fan-game-cube-2025-10-18',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenized Sports Fields Create New Revenue Streams',
  subtitle: 'Sports clubs need innovative revenue sources while fans seek deeper engagement with their favorite teams. Fan Game Cube lets fans own virtual zones of real fields through NFTs tied to live events, creating new fan experiences and club revenue without requiring crypto knowledge.',
  publishDate: '2025-10-18T08:31:14.775Z',
  tweetId: '1924366298617729264',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1760776274775.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: Tokenized Sports Fields Create New Revenue Streams',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports fields for fan ownership through NFTs tied to live events. New revenue for clubs, engaging experiences for fans, no crypto expertise needed.'
}
];
