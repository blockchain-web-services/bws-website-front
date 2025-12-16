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
  slug: 'blockchain-badges-2025-12-16',
  product: 'Blockchain Badges',
  title: 'Blockchain Badges: Immutable Digital Credentials with Instant Verification',
  subtitle: 'Universities and enterprises lose billions annually to credential fraud, while manual verification processes drain resources and delay critical hiring decisions. Blockchain Badges transforms this broken system by providing immutable proof of achievements with instant verification, intuitive visual design tools, and bulk issuance capabilities that scale with organizational needs.',
  publishDate: '2025-12-16T10:03:24.725Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/blockchain-badges/blockchain-badges-0.png',
    alt: 'Cover',
    loading: 'eager'
  },
  seoDescription: 'Blockchain Badges delivers immutable digital credentials with instant verification, visual badge design, and bulk issuance for universities and enterprises fighting credential fraud.'
}
];
