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
