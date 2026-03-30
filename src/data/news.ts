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
    title: 'Rouge Studio',
    description: '<span class="partner-name">Rouge Studio</span> integrates BWS X Bot to enhance community engagement, performance tracking, and rewards in Web3.',
    partnershipTitle: 'Rouge Studio',
    logos: [
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
    title: 'Agentify',
    description: 'Building autonomous AI agents using BWS X Bot for tracking verified social intelligence and Web3 automation.',
    partnershipTitle: 'Agentify',
    logos: [
      {
        src: 'https://pbs.twimg.com/profile_images/1923463043671027712/f4bA_sep_400x400.jpg',
        alt: 'Agentify Logo',
        href: 'https://x.com/agentifyxyz',
        class: 'image-partnership image-partnership-partner'
      }
    ],
    buttons: [
      {
        text: 'View Announcement',
        href: 'https://x.com/BWSCommunity/status/1983622185538257272',
        type: 'secondary',
        target: '_blank',
        hasArrow: true
      }
    ],
    backgroundClass: 'container-image-partnership-1983622185538257272'
  },
  {
    title: 'RATI AI',
    description: '<span class="partner-name">RATI AI</span> integrates BWS platform to build an AI-driven ecosystem merging consciousness, memecoins, and art.',
    partnershipTitle: 'RATI AI',
    logos: [
      {
        src: 'https://pbs.twimg.com/profile_images/1932550989745369089/PMFUBdvU_400x400.jpg',
        alt: 'RATI AI Logo',
        href: 'https://x.com/rati_ai',
        class: 'image-partnership image-partnership-partner'
      }
    ],
    buttons: [
      {
        text: 'View Announcement',
        href: 'https://x.com/BWSCommunity/status/1990835882102857755',
        type: 'secondary',
        target: '_blank',
        hasArrow: true
      }
    ],
    backgroundClass: 'container-image-partnership-1990835882102857755'
  },
  {
    title: 'Orbler',
    description: '<span class="partner-name">Orbler</span> integrates BWS solutions to make Web3 accessible through fandom and creativity-driven blockchain pathways.',
    partnershipTitle: 'Orbler',
    logos: [
      {
        src: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
        alt: 'Orbler Logo',
        href: 'https://x.com/orbler',
        class: 'image-partnership image-partnership-partner'
      }
    ],
    buttons: [
      {
        text: 'View Announcement',
        href: 'https://x.com/BWSCommunity/status/1991912746615775572',
        type: 'secondary',
        target: '_blank',
        hasArrow: true
      }
    ],
    backgroundClass: 'container-image-partnership-1991912746615775572'
  },
  {
    title: 'Agentify',
    description: '<span class="partner-name">Agentify</span> building autonomous AI agents with MCP for on-chain DeFi actions, now integrating BWS X Bot for verified social intelligence tracking.',
    partnershipTitle: 'Agentify',
    logos: [
      {
        src: 'https://pbs.twimg.com/profile_images/1923463043671027712/f4bA_sep_400x400.jpg',
        alt: 'Agentify Logo',
        href: 'https://x.com/agentifyxyz',
        class: 'image-partnership image-partnership-partner'
      }
    ],
    buttons: [
      {
        text: 'View Announcement',
        href: 'https://x.com/BWSCommunity/status/1983622185538257272',
        type: 'secondary',
        target: '_blank',
        hasArrow: true
      }
    ],
    backgroundClass: 'container-image-partnership-1983622185538257272'
  },
  {
    title: 'Quick Sync',
    description: '<span class="partner-name">Quick Sync</span> leverages BWS infrastructure and Web3 APIs to enable data sharing through their platform and integrates BWS X Bot',
    partnershipTitle: 'Quick Sync',
    logos: [
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
    description: '<span class="partner-name">Rouge Studio</span> integrates BWS X Bot technology to enhance Web3 community engagement and performance tracking',
    partnershipTitle: 'Rouge Studio',
    logos: [
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
  },
  {
    title: 'BFG Invests in BWS',
    description: '<span class="partner-name">Blockchain Founders Group</span> accelerates BWS to simplify the development of blockchain projects.',
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
  }
];
