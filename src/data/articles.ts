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
  slug: 'x-bot-2025-12-09',
  product: 'X Bot',
  title: 'X Bot: Real-Time Community Analytics for Crypto Projects Across Platforms',
  subtitle: 'Managing community engagement across X and Telegram while distinguishing authentic growth from bot activity is a constant challenge for crypto projects. X Bot automates engagement tracking, monitors 100+ KOL accounts simultaneously, and delivers verified analytics through official API integration, helping teams identify real traction without manual overhead.',
  publishDate: '2025-12-09T17:08:11.115Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot tracks crypto community engagement across X and Telegram with KOL monitoring, bot detection, and automated daily reports using official API integration.'
},
{
  slug: 'blockchain-badges-2025-12-09',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Credential Verification for Universities and Organizations',
  subtitle: 'Credential fraud costs billions annually as fake degrees and forged documents undermine trust in educational and professional certification systems. Blockchain Badges provides universities and organizations with immutable credential verification on blockchain, enabling instant authentication that cannot be forged or altered.',
  publishDate: '2025-12-09T17:08:22.877Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides tamper-proof credential verification with blockchain proof for universities and organizations, enabling instant authentication of degrees.'
},
{
  slug: 'esg-credits-2025-12-09',
  product: 'ESG Credits',
  title: 'ESG Credits: Blockchain-Verified Environmental Impact Reporting for Banking Applications',
  subtitle: 'Financial institutions face mounting pressure to provide reliable environmental impact reporting that prevents double-counting and delivers cryptographic proof of sustainable investments. ESG Credits addresses this challenge with blockchain-verified reporting integrated directly into banking applications, ensuring ICMA framework compliance while enabling transparent tracking of sustainable asset performance.',
  publishDate: '2025-12-09T17:08:34.771Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/esg-credits/esg-credits-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-verified environmental impact reporting for banks with ICMA compliance, preventing double-counting of sustainable investments.'
},
{
  slug: 'fan-game-cube-2025-12-09',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: Tokenized Field Zones Where Fans Earn From Real Match Events',
  subtitle: 'Sports fans crave deeper engagement beyond passive viewing, while clubs search for new revenue streams from digital experiences. Fan Game Cube bridges this gap by tokenizing field sections as NFTs across football, chess, tennis, and cricket—enabling fans to own specific coordinates and earn points whenever game events occur at their locations.',
  publishDate: '2025-12-09T17:08:49.071Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports field sections as NFTs where fans earn points from real match events at owned coordinates across football, chess, tennis, cricket.'
}
];
