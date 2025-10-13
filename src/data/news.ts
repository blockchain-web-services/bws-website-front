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
    description: 'Partnership integrating $BWS X Bot with Quick Sync\'s decentralized infrastructure, no-code tools, and Web3 APIs',
    partnershipTitle: 'Quick Sync',
    logos: [
      {
        src: '/assets/images/6474d385cfec71cb21a92251/651c58eabcaaed235a87df6d_logo_plus_BWS.svg',
        alt: 'BWS Logo',
        href: 'https://www.bws.ninja',
        class: 'image-partnership image-partnership-bws'
      },
      {
        src: 'https://pbs.twimg.com/profile_images/1918924015781003265/KrrYxgY-_400x400.jpg',
        alt: 'Quick Sync Logo',
        href: 'https://x.com/Quick_Sync',
        class: 'image-partnership image-partnership-partner'
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
    ],
    backgroundClass: 'container-image-partnership-1970799564593537066'
  },
  {
    title: 'Rouge Studio',
    description: 'Rouge Studio joins BWS ecosystem to enhance community engagement and rewards tracking through Web3 integration',
    partnershipTitle: 'Rouge Studio',
    logos: [
      {
        src: '/assets/images/6474d385cfec71cb21a92251/651c58eabcaaed235a87df6d_logo_plus_BWS.svg',
        alt: 'BWS Logo',
        href: 'https://www.bws.ninja',
        class: 'image-partnership image-partnership-bws'
      },
      {
        src: 'https://pbs.twimg.com/profile_images/1778008019856732160/VJvFD1V8_400x400.jpg',
        alt: 'Rouge Studio Logo',
        href: 'https://x.com/RougeStudio_',
        class: 'image-partnership image-partnership-partner'
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
    ],
    backgroundClass: 'container-image-partnership-1975576723337982186'
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
