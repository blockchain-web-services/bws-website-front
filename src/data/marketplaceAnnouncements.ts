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
  title: string;
  descriptions: string[];
  image?: AnnouncementImage;
  video?: AnnouncementVideo;
  link?: AnnouncementLink;
  button: AnnouncementButton;
}

export const currentAnnouncement: MarketplaceAnnouncement = {
  title: 'New Marketplace Solution!',
  descriptions: [
    'Introducing Fan Game Cube, a new solution powered by Blockchain Web Services. This platform allows sports clubs to tokenize their game fields, creating new revenue opportunities while enabling fans to own digital assets linked to real-time match events.',
    'By using NFTs and machine learning, fans can earn rewards based on live events in their chosen sections of the field. Whether for football, chess, cricket, or other sports, Fan Game Cube brings a fresh way for clubs to engage with their fans and generate additional revenue.'
  ],
  image: {
    src: '/assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection.png',
    alt: 'Fan Game Cube 1-click BUY EXPERIENCE.',
    loading: 'lazy',
    sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829.0030517578125px',
    srcset: '/assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection-p-500.png 500w, /assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection-p-800.png 800w, /assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection.png 829w'
  },
  button: {
    text: 'Launch Deck',
    href: 'https://docsend.com/view/ua2j9h99jyytj5sp',
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
};
