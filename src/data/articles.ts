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
  slug: 'fan-game-cube-2025-12-14',
  product: 'Fan Game Cube',
  title: 'Fan Game Cube: NFT Zones That Turn Sports Fields Into Revenue',
  subtitle: 'Sports clubs leave millions in untapped revenue because fan monetization remains limited to merchandise and tickets. Fan Game Cube transforms this landscape by tokenizing sports fields into NFT zones, where fans earn points as real-time match events—goals, passes, and strategic moves—occur at their owned coordinates, unlocking new revenue streams for clubs across multiple sports.',
  publishDate: '2025-12-14T10:03:08.133Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/docs/fan-game-cube/fan-game-cube-0.png',
    alt: 'Product screenshot',
    loading: 'eager'
  },
  seoDescription: 'Fan Game Cube tokenizes sports fields into NFT zones where fans earn rewards from real-time match events, creating new revenue for sports clubs.'
}
];
