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

export interface SolutionGraphic {
  icon: string;                  // Font Awesome class, e.g. "fa-solid fa-dove"
  gradient: [string, string];    // Two hex colors for a linear gradient (135deg)
  iconColor?: string;            // Defaults to #fff
  pattern?: 'dots' | 'mesh';     // Optional abstract overlay; default 'dots'
  alt: string;                   // Accessible description of the card graphic
}

export interface Solution {
  title: string;
  author: string;
  description: string;
  image?: SolutionImage;         // Raster image (original variant)
  graphic?: SolutionGraphic;     // CSS-only icon + gradient variant
  url: string;
  networks: SolutionNetwork[];
  category: string; // For filtering: Methodology, CRM, Socials, Credentials
  featured?: boolean;            // Renders as a full-width pillar above the standard grid
  licensePills?: string[];       // Optional license-track badges (e.g. "Free for Solos", "Licensed for Business")
}

export const solutions: Solution[] = [
  {
    title: 'OpenAgile.AI',
    author: 'BWS · Open Source',
    description: 'Engineering Discipline for AI-Assisted Development. Specs before prompts, validation before generation, traceability by default. Free for solos, licensed for business.',
    image: {
      src: '/assets/images/marketplace/openagile/hero-card.png',
      alt: 'OpenAgile.AI — engineering discipline for AI-assisted development'
    },
    url: '/marketplace/openagile.html',
    networks: [],
    category: 'Methodology',
    featured: true,
    licensePills: ['Free for Solos', 'Licensed for Business']
  },
  {
    title: 'Zellbox',
    author: 'zellbox.com',
    description: 'The CRM for appointment-driven SMBs — manage customers, bookings, and automated WhatsApp reminders from one shared inbox and calendar. Start free, no card required.',
    image: {
      src: '/assets/images/marketplace/zellbox/hero-card.png',
      alt: 'Zellbox — WhatsApp Business + Google Calendar CRM for appointment-driven SMBs'
    },
    url: '/marketplace/zellbox.html',
    networks: [],
    category: 'CRM'
  },
  {
    title: 'WallaWhats',
    author: 'wallawhats.com',
    description: 'Real-time WhatsApp alerts when your favorite X/Twitter accounts post — no app required.',
    image: {
      src: '/assets/images/marketplace/wallawhats/hero-card.png',
      alt: 'WallaWhats — real-time WhatsApp alerts for X/Twitter posts'
    },
    url: '/marketplace/wallawhats.html',
    networks: [],
    category: 'Socials'
  },
  {
    title: 'Badges.ninja',
    author: 'BWS',
    description: 'Digital badges people can trust. Visual designer, REST API, bulk awarding, and independent verification — Open Badge v2.0 compliant with a free tier.',
    image: {
      src: '/assets/images/marketplace/badges/hero-card.png',
      alt: 'Badges.ninja — verifiable Open Badges and digital credentials'
    },
    url: '/marketplace/badges.html',
    networks: [],
    category: 'Credentials'
  },
  {
    title: 'Telegram XBot',
    author: 'BWS',
    description: 'A Telegram bot that helps community groups boost engagement on X (formerly Twitter).',
    image: {
      src: '/assets/images/marketplace/telegram-xbot/hero-card.png',
      alt: 'Telegram XBot — track KOL performance and prove ROI on X (Twitter)'
    },
    url: '/marketplace/telegram-xbot.html',
    networks: [],
    category: 'Socials'
  }
];
