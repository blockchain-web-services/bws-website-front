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
  slug: 'x-bot-2026-02-26',
  product: 'X Bot',
  title: 'X Bot: Advanced KOL Performance Tracking and Community Analytics Platform',
  subtitle: 'Managing crypto community engagement across X and Telegram requires real-time data and bot detection capabilities. X Bot delivers automated KOL monitoring, authentic engagement metrics, and daily performance reports through official X API integration, helping Web3 projects identify genuine influence and community growth.',
  publishDate: '2026-02-26T10:15:43.210Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot delivers automated KOL tracking and community analytics for crypto projects. Real-time engagement monitoring, bot detection, and daily performance reports via X API.'
},
{
  slug: 'blockchain-badges-2026-02-23',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Cryptographic Verification for Digital Credentials',
  subtitle: 'Traditional credential verification requires contacting issuers—a process that creates delays and opens the door to fraud. Blockchain Badges eliminates these vulnerabilities by storing digital credentials on-chain with cryptographic verification, enabling instant authentication of certificates, training completions, and memberships without ever contacting the issuer.',
  publishDate: '2026-02-23T10:17:37.831Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Discover how Blockchain Badges uses cryptographic verification to store credentials on-chain, enabling instant authentication of certificates without contacting issuers.'
},
{
  slug: 'x-bot-2026-02-22',
  product: 'X Bot',
  title: 'X Bot: Track Real KOL Performance and Community Engagement Across Platforms',
  subtitle: 'Managing crypto community engagement across X and Telegram while filtering authentic influence from bot activity presents a significant challenge. X Bot solves this by automating mention tracking, KOL performance monitoring, and engagement analytics through official API integration—helping projects identify and measure genuine community growth.',
  publishDate: '2026-02-22T10:04:07.073Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot tracks KOL performance and community engagement across X and Telegram. Filter bot farms, monitor authentic influence metrics, and automate reporting.'
},
{
  slug: 'blockchain-badges-2026-01-26',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Digital Credentials with Instant Verification',
  subtitle: 'Credential fraud undermines trust in professional certifications and academic achievements. Blockchain Badges solves this critical problem by storing digital credentials on-chain with cryptographic verification, enabling organizations to issue tamper-proof certificates that can be instantly verified without ever contacting the original issuers.',
  publishDate: '2026-01-26T10:04:40.851Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides tamper-proof digital credentials with instant blockchain verification, eliminating credential fraud for organizations.'
},
{
  slug: 'x-bot-2026-01-25',
  product: 'X Bot',
  title: 'X Bot: Real-Time Community Analytics for Crypto Projects on X and Telegram',
  subtitle: 'Tracking community engagement across multiple platforms is challenging for crypto projects. X Bot automates mention tracking, KOL performance monitoring, and engagement analytics across X and Telegram, filtering bot activity to reveal authentic community metrics through official API integration.',
  publishDate: '2026-01-25T10:03:15.885Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot tracks crypto community mentions across X and Telegram with automated KOL analytics, bot detection, and real-time engagement dashboards using official APIs.'
},
{
  slug: 'blockchain-badges-2026-01-22',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Tamper-Proof Digital Credentials with Instant Verification',
  subtitle: 'Credential fraud costs institutions billions annually while manual verification consumes significant resources. Blockchain Badges provides cryptographically verified digital credentials stored on-chain, enabling instant verification without contacting issuers while preventing credential tampering and fraud.',
  publishDate: '2026-01-22T10:05:17.592Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges provides tamper-proof digital credentials with blockchain verification. Institutions issue certificates with instant verification, preventing fraud at scale.'
},
{
  slug: 'x-bot-2026-01-21',
  product: 'X Bot',
  title: 'X Bot: Track KOL Performance and Community Engagement in Real-Time',
  subtitle: 'Managing crypto community engagement across X and Telegram requires accurate performance tracking. X Bot delivers automated KOL monitoring with bot detection, real-time analytics, and daily reporting through official X API integration—helping projects identify authentic influence without manual overhead.',
  publishDate: '2026-01-21T10:04:30.303Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot helps crypto projects automate community management, track authentic KOL performance, filter bot farms, and generate daily engagement reports across X and Telegram.'
},
{
  slug: 'blockchain-badges-2025-12-26',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Issue Tamper-Proof Digital Credentials at Scale',
  subtitle: 'Credential fraud costs organizations billions annually while traditional verification systems remain slow and unreliable. Blockchain Badges creates immutable digital credentials with cross-platform verification, enabling institutions to issue tamper-proof certificates that can be instantly verified on the blockchain.',
  publishDate: '2025-12-26T10:03:46.470Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges creates tamper-proof digital credentials with blockchain verification. Educational institutions issue verifiable certificates at scale.'
},
{
  slug: 'x-bot-2025-12-25',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and KOL Performance Analysis',
  subtitle: 'Managing crypto communities across X and Telegram requires constant monitoring of engagement metrics, KOL performance, and authentic activity. X Bot automates this entire process with official X API integration, bot detection systems, and daily performance reports delivered directly to your Telegram group.',
  publishDate: '2025-12-25T10:03:42.296Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates crypto community management with official X API integration, bot detection, KOL tracking, and daily Telegram reports for multi-platform analytics.'
},
{
  slug: 'blockchain-badges-2025-12-12',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Issue Tamper-Proof Digital Credentials with Blockchain Verification',
  subtitle: 'Traditional credential verification traps organizations in a cycle of repetitive processes, document uploads, and manual verification calls that waste time and create security vulnerabilities. Blockchain Badges breaks this cycle by issuing tamper-proof digital credentials with immutable blockchain proof—enabling instant verification by anyone, anywhere, without the friction.',
  publishDate: '2025-12-12T10:04:02.390Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges creates verifiable digital credentials with immutable blockchain proof for universities and organizations, eliminating repetitive verification.'
}
];
