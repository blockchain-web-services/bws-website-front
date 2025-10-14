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
  title: 'Advanced Community Engagement Analytics',
  descriptions: [
    'X Bot revolutionizes community management by automatically tracking and analyzing social media engagement across X (Twitter) and Telegram platforms. This comprehensive tool helps crypto projects and community managers monitor Key Opinion Leader (KOL) performance, track mentions, and generate daily reports, eliminating manual tracking while providing real-time insights into community growth and engagement metrics.',
    'The system features automated post syncing between X and Telegram groups, customizable tracking parameters, and gamified community support mechanisms. Projects can easily monitor mentions, measure engagement rates, and reward top contributors through an intuitive interface, while PRO features enable advanced analytics and deeper community insights for enhanced decision-making.'
  ],
  image: {
    src: '/assets/images/marketplace/x-bot-1760436213752.jpg',
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
  title: 'Web3-Native Digital Certification Platform',
  descriptions: [
    'Blockchain Badges transforms how organizations verify and issue digital credentials by creating tamper-proof, blockchain-based certification systems. This innovative solution enables educational institutions, event organizers, and corporate training programs to issue verifiable digital badges that authenticate achievements, participation, and learning milestones with immutable blockchain proof, while maintaining professional credibility.',
    'The platform seamlessly integrates with existing Web2 systems through user-friendly APIs, allowing organizations to issue and manage digital credentials without requiring end-users to understand blockchain technology. Recipients can easily share their verified achievements across platforms, while verifiers can instantly confirm authenticity, creating a trusted ecosystem for digital certification management.'
  ],
  image: {
    src: '/assets/images/marketplace/fallback/blockchain-badges/02-issuers-list.png',
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
  title: 'Blockchain-Powered ESG Reporting Solution',
  descriptions: [
    'The ESG Credits platform revolutionizes sustainability reporting by providing a comprehensive solution for tracking, verifying, and reporting environmental impact on the blockchain. This innovative system enables investors, advisors, and sustainability startups to automate impact alignment, standardize ESG disclosures, and generate transparent, investor-grade reports with immutable proof of environmental initiatives.',
    'The solution features multilingual and cross-currency support, allowing users to manage single investments or complex portfolios across different regions and taxonomies. Its marketplace enables direct comparison of green bond frameworks through visual analytics and structured fact tables, helping stakeholders assess ESG characteristics and align with compatible frameworks efficiently.'
  ],
  image: {
    src: '/assets/images/marketplace/esg-credits-1760436213829.jpg',
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
  title: 'Interactive Sports NFT Platform',
  descriptions: [
    'Fan Game Cube revolutionizes sports engagement by enabling fans to own virtual zones of real playing fields through NFT technology. This innovative platform creates new revenue streams for sports clubs and leagues while offering fans unprecedented ways to connect with their favorite sports, from chess to football, by tokenizing actual game spaces and linking them to live in-game events.',
    'The platform rewards fan participation by allowing NFT holders to earn points based on real game events occurring in their owned zones, such as goals or special plays. This creates an interactive layer of engagement that benefits both clubs seeking new revenue channels and fans looking for deeper ways to connect with their favorite sports, while introducing Web2 users to blockchain technology naturally.'
  ],
  image: {
    src: '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png',
    alt: 'Fan Game Cube solution',
    loading: 'lazy',
    sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
  },
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
