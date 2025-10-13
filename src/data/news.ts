export interface NewsLogo {
  src: string;
  alt: string;
  href: string;
  class: string;
}

export interface NewsButton {
  text: string;
  href: string;
  type: 'primary' | 'secondary';
  target?: string;
  hasArrow?: boolean;
}

export interface NewsItem {
  title: string;
  description: string;
  partnershipTitle?: string;
  logos: NewsLogo[];
  buttons: NewsButton[];
  backgroundClass?: string;
}

export const newsItems: NewsItem[] = [
  {
    title: 'Quick Sync',
    description: 'Integration partnership providing decentralized data sharing infrastructure through no-code tools and Web3 APIs, featuring BWS X Bot.',
    partnershipTitle: 'Quick Sync',
    logos: [
      {
        src: '/assets/images/news/partnership-1760348845947-1970799564593537066.jpg',
        alt: 'Quick Sync partnership',
        href: 'https://x.com/BWSCommunity/status/1970799564593537066',
        class: 'image-partnership'
      }
    ],
    buttons: [
      {
        text: 'View Announcement',
        href: 'https://x.com/BWSCommunity/status/1970799564593537066',
        type: 'secondary',
        target: '_blank',
        hasArrow: true
      }
    ]
  },
  {
    title: 'Rouge Studio',
    description: 'Rouge Studio joins BWS ecosystem to enhance community engagement and rewards through X Bot integration in Web3.',
    partnershipTitle: 'Rouge Studio',
    logos: [
      {
        src: '/assets/images/news/partnership-1760348844726-1975576723337982186.jpg',
        alt: 'Rouge Studio partnership',
        href: 'https://x.com/BWSCommunity/status/1975576723337982186',
        class: 'image-partnership'
      }
    ],
    buttons: [
      {
        text: 'View Announcement',
        href: 'https://x.com/BWSCommunity/status/1975576723337982186',
        type: 'secondary',
        target: '_blank',
        hasArrow: true
      }
    ]
  },

  {
    title: 'BFG Invests in BWS',
    description: 'Blockchain Founders Group accelerates BWS to simplify the development of blockchain projects.',
    partnershipTitle: 'Blockchain Founders Group',
    logos: [
      {
        src: '/assets/images/6474d385cfec71cb21a92251/64e738258afae2bb6f4d56bf_logo-blockchain-founders-group-background-transparent-large.svg',
        alt: 'Blockchain Founders Group',
        href: 'https://blockchain-founders.io/news/blockchain-founders-group-accelerates-bws-to-simplify-the-development-of-blockchain-projects',
        class: 'image-bfg'
      }
    ],
    buttons: [
      {
        text: 'Announcement',
        href: 'https://blockchain-founders.io/news/blockchain-founders-group-accelerates-bws-to-simplify-the-development-of-blockchain-projects',
        type: 'secondary',
        target: '_blank',
        hasArrow: true
      },
      {
        text: 'ROADMAP',
        href: '#roadmap',
        type: 'secondary'
      }
    ],
    backgroundClass: 'container-image-announcement-bfg'
  },
  {
    title: '$BWS Token Launch Success!',
    description: 'We are thrilled to announce $BWS Token launch has been an incredible success!',
    partnershipTitle: 'In Partnership With',
    logos: [
      {
        src: '/assets/images/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG.png',
        alt: 'BWS is partnering with PROOF for TOKEN LAUNCH.',
        href: '#',
        class: 'image-proof'
      },
      {
        src: '/assets/images/6474d385cfec71cb21a92251/6707f1c5c0856eff6c22300e_AssureDefi.png',
        alt: 'BWS is partnering with Assure Defi for confident $BWS TOKEN LAUNCH',
        href: 'https://assuredefi.com/projects/blockchain-web-services/',
        class: 'image-assure'
      }
    ],
    buttons: [
      {
        text: 'BUY',
        href: 'https://app.uniswap.org/#/swap?outputCurrency=0xaade1d6701173bd924c9de2d56a00ef4e3d9de4d&chain=mainnet',
        type: 'primary',
        target: '_blank'
      },
      {
        text: 'Tokenomics',
        href: '#tokenomics',
        type: 'secondary'
      }
    ],
    backgroundClass: 'container-image-announcement'
  }
];
