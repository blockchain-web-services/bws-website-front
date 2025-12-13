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
  slug: 'esg-credits-2025-12-13',
  product: 'ESG Credits',
  title: 'ESG Credits: ICMA-Compliant Environmental Impact Reports with Blockchain Verification',
  subtitle: 'Financial institutions struggle to prove the authenticity of their environmental impact while preventing double-counting in sustainability reporting. ESG Credits solves this challenge by generating blockchain-verified environmental impact reports with ICMA framework compliance and immutable storage, delivering transparent and verifiable sustainability data that stakeholders can trust.',
  publishDate: '2025-12-13T10:03:11.530Z',
  tweetId: '',
  featuredImage: {
    src: '/assets/images/marketplace/fallback/esg-credits/01-report.png',
    alt: 'ESG Credits solution',
    loading: 'eager'
  },
  seoDescription: 'ESG Credits provides blockchain-verified environmental impact reporting for financial institutions with ICMA compliance and immutable storage preventing double-counting.'
}
];
