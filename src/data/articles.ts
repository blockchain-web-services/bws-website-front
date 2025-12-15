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
  slug: 'x-bot-2025-12-15',
  product: 'X Bot',
  title: 'X Bot: Advanced Community Analytics for Web3 Projects',
  subtitle: 'Managing crypto communities across multiple platforms requires constant monitoring and analysis. X Bot automates community tracking with real-time analytics, engagement metrics, and KOL performance monitoring, helping Web3 projects identify authentic traction without manual overhead.',
  publishDate: '2025-12-15T10:04:03.666Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates Web3 community analytics across X and Telegram with KOL tracking, engagement metrics, and daily reports using official API integration.'
}
];
