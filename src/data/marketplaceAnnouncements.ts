export interface AnnouncementImage {
  src: string;
  alt: string;
  loading?: string;
  sizes?: string;
  srcset?: string;
}

export interface AnnouncementVideo {
  embedUrl: string;
  title: string;
  width: string;
  height: string;
  paddingTop: string;
}

export interface AnnouncementLink {
  text: string;
  href: string;
  target?: string;
  additionalText?: string;
  highlightedText?: string;
}

export interface AnnouncementButton {
  text: string;
  href: string;
  target?: string;
  hasArrow?: boolean;
}

export interface MarketplaceAnnouncement {
  product: string;                    // MANDATORY
  title: string;                      // MANDATORY
  descriptions: string[];              // MANDATORY (array with 1+ descriptions)
  image?: AnnouncementImage;          // OPTIONAL (single image)
  images?: AnnouncementImage[];       // OPTIONAL (multiple images)
  video?: AnnouncementVideo;          // OPTIONAL
  link?: AnnouncementLink;            // OPTIONAL
  button?: AnnouncementButton;        // OPTIONAL (single button)
  buttons?: AnnouncementButton[];     // OPTIONAL (multiple buttons)
}

export const marketplaceAnnouncements: MarketplaceAnnouncement[] = [
{
  product: 'X Bot',
  title: 'Community Engagement Analytics Bot',
  descriptions: [
    'Automated tool that tracks and reports X (Twitter) engagement metrics while syncing posts directly to Telegram groups',
    'Enables projects to monitor KOL performance, gain real-time insights, and gamify community support through automated daily reports'
  ],
  image: {
    src: '/assets/images/marketplace/x-bot-1760381154720.jpg',
    alt: 'X Bot solution',
    loading: 'lazy',
    sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
  },
  button: {
    text: 'Learn More',
    href: '/marketplace/telegram-xbot.html',
    target: '_blank',
    hasArrow: true
  }
},
{
  product: 'Blockchain Badges',
  title: 'Web3 Digital Certifications',
  descriptions: [
    'Creates blockchain-based badges for verifying achievements, event participation, and learning milestones',
    'Enables Web2 companies to seamlessly issue tamper-proof digital credentials without requiring end users to understand blockchain technology'
  ],
  image: {
    src: '/assets/images/marketplace/fallback/blockchain-badges/01-badges-ui.png',
    alt: 'Blockchain Badges solution',
    loading: 'lazy',
    sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
  },
  button: {
    text: 'Learn More',
    href: '/marketplace/blockchain-badges.html',
    target: '_blank',
    hasArrow: true
  }
},
{
  product: 'ESG Credits',
  title: 'Green Finance Verification Platform',
  descriptions: [
    'Automates ESG impact alignment and standardizes sustainability disclosures for green bonds and environmental projects',
    'Provides multilingual, cross-currency support for generating investor-grade ESG reports backed by immutable blockchain records'
  ],
  image: {
    src: '/assets/images/marketplace/esg-credits-1760381155205.jpg',
    alt: 'ESG Credits solution',
    loading: 'lazy',
    sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
  },
  button: {
    text: 'Learn More',
    href: '/marketplace/esg-credits.html',
    target: '_blank',
    hasArrow: true
  }
},
{
  product: 'Fan Game Cube',
  title: 'Sports Fan Engagement NFTs',
  descriptions: [
    'Enables fans to own virtual zones of real sports fields through NFTs tied to live in-game events',
    'Creates new revenue streams for sports clubs while offering fans points-based rewards for engagement'
  ],
  button: {
    text: 'View Details',
    href: '/marketplace/nft-gamecube.html',
    target: '_blank',
    hasArrow: true
  },
  video: {
    embedUrl: 'https://player.vimeo.com/video/976431707?h=d5bdb51e8a',
    title: 'Fan Game Cube @ TikTok',
    width: '940',
    height: '1671',
    paddingTop: '177.76595744680853%'
  },
  link: {
    text: 'NFT Game Cube launch event campaign on TikTok',
    href: 'https://www.tiktok.com/@iamandrewhenderson',
    target: '_blank',
    highlightedText: '@iamandrewhenderson'
  }
}
];
