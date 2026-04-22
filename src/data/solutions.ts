export interface SolutionNetwork {
  name: string;
  color: string;
}

export interface SolutionImage {
  src: string;
  alt: string;
  sizes?: string;
  srcset?: string;
}

export interface Solution {
  title: string;
  author: string;
  description: string;
  image: SolutionImage;
  url: string;
  networks: SolutionNetwork[];
  category: string; // For filtering: Database, NFT, Credentials, Socials
}

export const solutions: Solution[] = [
  {
    title: 'Blockchain Save',
    author: 'BWS',
    description: 'Easily and affordably store data with tamper-proof integrity and a Certificate of Trust for enhanced transparency.',
    image: {
      src: '/assets/images/6474d385cfec71cb21a9229a/65061f550fd7be777e64f36f_Save_400x300.jpg',
      alt: 'Blockchain Save — store data with tamper-proof integrity and a Certificate of Trust'
    },
    url: '/marketplace/database-immutable.html',
    networks: [
      { name: 'Polygon', color: '#af89ee' },
      { name: 'Matchain', color: 'hsla(20, 100.00%, 54.02%, 1.00)' }
    ],
    category: 'Database'
  },
  {
    title: 'Blockchain Hash',
    author: 'BWS',
    description: 'A single API call to anchor data immutably — no wallets, no gas fees to manage.',
    image: {
      src: '/assets/images/6474d385cfec71cb21a9229a/65061ebf5608b7584d9def34_Hash_400x300.jpg',
      alt: 'Blockchain Hash — anchor data immutably with a single API call'
    },
    url: '/marketplace/database-mutable.html',
    networks: [
      { name: 'Polygon', color: '#af89ee' },
      { name: 'Matchain', color: 'hsla(20, 100.00%, 54.02%, 1.00)' }
    ],
    category: 'Database'
  },
  {
    title: 'IPFS.ninja',
    author: 'BWS',
    description: 'The simplest IPFS pinning service and upload API. Pin any file, serve it through your own dedicated gateway, and scale from a free tier to production with signed upload tokens and analytics.',
    image: {
      src: '/assets/images/6474d385cfec71cb21a9229a/655b1a1220eb4c16ccfcab4b_BWS.IPFS.Upload_400x300.jpg',
      alt: 'IPFS.ninja — simple IPFS pinning service, upload API, and dedicated gateways'
    },
    url: '/marketplace/ipfs-upload.html',
    networks: [
      { name: 'IPFS', color: 'hsla(314, 90.64%, 38.40%, 1.00)' }
    ],
    category: 'NFT'
  },
  {
    title: 'NFT.zK',
    author: 'BWS',
    description: 'A straightforward API enabling artists, companies, and individuals to create NFTs effortlessly, without Web3 knowledge.',
    image: {
      src: '/assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628.jpg',
      alt: 'NFT.zK solution - Create NFTs effortlessly without Web3 knowledge',
      sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 939.9851684570312px',
      srcset: '/assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628-p-500.jpg 500w, /assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628-p-800.jpg 800w, /assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628-p-1080.jpg 1080w, /assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628.jpg 1200w'
    },
    url: '/marketplace/nft-zeroknwoledge.html',
    networks: [
      { name: 'Polygon', color: '#af89ee' },
      { name: 'Matchain', color: 'hsla(20, 100.00%, 54.02%, 1.00)' }
    ],
    category: 'NFT'
  },
  {
    title: 'Blockchain Badges',
    author: 'BWS',
    description: 'Blockchain Badges elevate your credentialing system with secure, immutable, instantly verifiable digital recognition.',
    image: {
      src: '/assets/images/6474d385cfec71cb21a9229a/65061830bf101fe685a48e2f_NFT-Marketplace_400x300.jpg',
      alt: 'Blockchain Badges — secure, verifiable digital recognition'
    },
    url: '/marketplace/blockchain-badges.html',
    networks: [
      { name: 'Polygon', color: '#af89ee' },
      { name: 'Matchain', color: 'hsla(20, 100.00%, 54.02%, 1.00)' }
    ],
    category: 'Credentials'
  },
  {
    title: 'Telegram XBot',
    author: 'BWS',
    description: 'A Telegram bot that helps community groups boost engagement on X (formerly Twitter).',
    image: {
      src: '/assets/images/6474d385cfec71cb21a9229a/6806a0111f7e6589d65385a6_Telegram-X-Bot.png',
      alt: 'Telegram XBot solution - Boost community engagement on X (Twitter)'
    },
    url: '/marketplace/telegram-xbot.html',
    networks: [],
    category: 'Socials'
  }
];
