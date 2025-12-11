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
  slug: 'x-bot-2025-12-11',
  product: 'X Bot',
  title: 'X Bot: Automated Community Analytics for Web3 Projects',
  subtitle: 'Managing crypto communities across X and Telegram while detecting authentic engagement versus bot activity is challenging. X Bot automates community tracking with real-time analytics, KOL monitoring, and verified engagement metrics using official API integration.',
  publishDate: '2025-12-11T19:35:08.986Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/x-bot/x-bot-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'X Bot automates crypto community analytics across X and Telegram with KOL tracking, bot detection, and real-time engagement metrics using official APIs.'
}
];
