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
  slug: 'x-bot-2025-10-20',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Engagement on X and Telegram',
  subtitle: 'Managing crypto community performance across X and Telegram requires constant monitoring and manual effort. X Bot automates mention tracking, generates daily reports with real-time analytics, and helps projects monitor KOL performance while gamifying community support—all powered by the $BWS ecosystem.',
  publishDate: '2025-10-20T10:17:39.479Z',
  tweetId: '1975576723337982186',
  featuredImage: {
    src: '/assets/images/articles/x-bot-1760955459479.jpg',
    alt: 'X Bot - X Bot: Automate Community Tracking and Engagement on X and Telegram',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot automates crypto community management with real-time tracking, KOL monitoring, and daily engagement reports across X and Telegram platforms.'
},
{
  slug: 'blockchain-badges-2025-10-20',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Award Web3 Digital Certifications for Learning and Events',
  subtitle: 'Traditional digital certifications lack verifiability and portability across platforms. Blockchain Badges enables organizations to award Web3-native digital certifications for event participation, learning achievements, and accomplishment recognition—bringing Web2 businesses seamlessly into Web3 with ready-to-use infrastructure.',
  publishDate: '2025-10-20T10:17:41.176Z',
  tweetId: '1924366298617729264',
  featuredImage: {
    src: '/assets/images/articles/blockchain-badges-1760955461177.jpg',
    alt: 'Blockchain Badges - Blockchain Badges: Award Web3 Digital Certifications for Learning and Events',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges helps organizations issue verifiable Web3 digital certifications for events, learning achievements, and employee recognition.'
},
{
  slug: 'esg-credits-2025-10-20',
  product: 'ESG Credits',
  title: 'ESG Credits: Automate Green Finance Impact Reporting with Blockchain',
  subtitle: 'Green investing requires transparent, verifiable impact reporting that meets investor standards. ESG Credits automates impact alignment, standardizes ESG disclosures, and powers investor-grade reporting—all underpinned by immutable blockchain records that transform how sustainability projects are certified, tracked, and proven.',
  publishDate: '2025-10-20T10:17:41.226Z',
  tweetId: '1919379287087444072',
  featuredImage: {
    src: '/assets/images/articles/esg-credits-1760955461226.jpg',
    alt: 'ESG Credits - ESG Credits: Automate Green Finance Impact Reporting with Blockchain',
    loading: 'eager'
  },
  seoDescription: 'Learn how ESG Credits automates green finance impact reporting with blockchain-verified ESG disclosures, framework comparison, and investor-grade documentation.'
},
{
  slug: 'fan-game-cube-2025-10-20',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenize Sports Fields and Create New Fan Revenue',
  subtitle: 'Sports clubs need innovative revenue streams that engage fans digitally. Fan Game Cube lets fans own virtual zones of real fields through NFTs tied to live in-game events like goals and plays, creating new fan experiences and revenue opportunities for clubs—without requiring crypto knowledge.',
  publishDate: '2025-10-20T10:17:41.640Z',
  tweetId: '1924366298617729264',
  featuredImage: {
    src: '/assets/images/articles/fan-game-cube-1760955461640.jpg',
    alt: 'Fan Game Cube - Fan Game Cube: Tokenize Sports Fields and Create New Fan Revenue',
    loading: 'eager'
  },
  seoDescription: 'Explore Fan Game Cube, the NFT solution that lets sports fans own virtual field zones tied to live events, creating new engagement and revenue for clubs.'
}
];
