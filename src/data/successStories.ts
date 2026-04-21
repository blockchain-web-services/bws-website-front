export interface SuccessStoryImage {
  src: string;
  alt: string;
  loading?: string;
  sizes?: string;
}

export interface SuccessStoryButton {
  text: string;
  href: string;  // Links to article, marketplace page, or X post
  target?: string;
  hasArrow?: boolean;
}

export interface SuccessStory {
  product: string;                    // "X Bot"
  title: string;                      // Short carousel title (3-5 words)
  description: string;                // Single short description (30-50 words)
  image?: SuccessStoryImage;
  button?: SuccessStoryButton;        // DEPRECATED: Single button (for backward compatibility)
  buttons?: SuccessStoryButton[];     // NEW: Multiple buttons (View Post + Learn More/Read Story)
  tweetUrl?: string;                  // NEW: Source X post URL (for deduplication)
  tweetId?: string;                   // NEW: Tweet ID (for deduplication key)
  articleSlug?: string;               // Reference to article (optional)
  publishDate?: string;               // ISO date (optional)
}


export const successStories: SuccessStory[] = [
{
  product: 'Blockchain Badges',
  title: 'DeFi Talents Partnership Launch',
  description: 'BWS partners with DeFi Talents, a leading Web3 talent development program, to pilot verifiable badge issuance for educational credentials. Key capabilities:<ul><li>Testing phase for blockchain-certified digital credentials</li><li>Verifiable badges for hundreds of Web3 students</li><li>Immutable achievement recognition across platforms</li></ul>This partnership validates student accomplishments in the growing Web3 ecosystem.',
  image: {
    src: '/assets/images/success-stories/blockchain-badges-1894436368530428316.jpg',
    alt: 'Blockchain Badges - DeFi Talents Partnership Launch',
    loading: 'lazy',
    sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
  },
  buttons: [
    {
      text: 'View Post',
      href: 'https://x.com/BWSCommunity/status/1894436368530428316',
      target: '_blank',
      hasArrow: true
    },
    {
      text: 'Learn More',
      href: '/marketplace/blockchain-badges.html',
      hasArrow: true
    },
  ],
  tweetUrl: 'https://x.com/BWSCommunity/status/1894436368530428316',
  tweetId: '1894436368530428316'
},
{
  product: 'Blockchain Badges',
  title: 'KoiKoi Sustainable Fashion Badge',
  description: 'BWS partners with KoiKoi, a global leader in sustainable fashion, to launch the KoiKoi Organic Badge—a blockchain-verified credential system. Key innovations:<ul><li>Digital token of authenticity for organic fashion products</li><li>Immutable verification of ethical sourcing and sustainability claims</li><li>Tamper-proof credentials recognizable across platforms</li></ul>This solution enables transparent validation of sustainable fashion credentials for consumers and industry partners.',
  image: {
    src: '/assets/images/success-stories/blockchain-badges-1883112146369651124.jpg',
    alt: 'Blockchain Badges - KoiKoi Sustainable Fashion Badge',
    loading: 'lazy',
    sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
  },
  buttons: [
    {
      text: 'View Post',
      href: 'https://x.com/BWSCommunity/status/1883112146369651124',
      target: '_blank',
      hasArrow: true
    },
    {
      text: 'Learn More',
      href: '/marketplace/blockchain-badges.html',
      hasArrow: true
    },
  ],
  tweetUrl: 'https://x.com/BWSCommunity/status/1883112146369651124',
  tweetId: '1883112146369651124'
},
{
  product: 'Blockchain Badges',
  title: 'Flostate Blockchain Badge Partnership',
  description: 'Flostate, a leading South African organization, partners with BWS to transform customer experience using blockchain badges. Key capabilities include:<ul><li>Verifiable digital credentials with blockchain certification</li><li>Seamless issuance and management of tamper-proof badges</li><li>Cross-platform achievement recognition and verification</li></ul>This partnership enables Flostate to deliver transparent, immutable credential validation for their customers.',
  image: {
    src: '/assets/images/success-stories/blockchain-badges-1881416481377861689.jpg',
    alt: 'Blockchain Badges - Flostate Blockchain Badge Partnership',
    loading: 'lazy',
    sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
  },
  buttons: [
    {
      text: 'View Post',
      href: 'https://x.com/BWSCommunity/status/1881416481377861689',
      target: '_blank',
      hasArrow: true
    },
    {
      text: 'Learn More',
      href: '/marketplace/blockchain-badges.html',
      hasArrow: true
    },
  ],
  tweetUrl: 'https://x.com/BWSCommunity/status/1881416481377861689',
  tweetId: '1881416481377861689'
}
];
