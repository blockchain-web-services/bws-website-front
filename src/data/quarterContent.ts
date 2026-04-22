export interface QuarterSection {
  title: string;
  paragraphs: string[];
}

export interface QuarterContent {
  quarter: number | string;
  year?: number;
  title: string;
  sections: QuarterSection[];
  cssClass: string;
  titleCssClass: string;
}

export interface QuarterContents {
  [key: string]: QuarterContent;
}

export const quarterContents: QuarterContents = {
  'launch': {
    quarter: 'LAUNCH',
    title: 'Foundation',
    cssClass: 'container-head-roadmap',
    titleCssClass: 'text-roadmap-title',
    sections: [
      {
        title: 'Concept Validation',
        paragraphs: [
          'Core infrastructure launched with Platform APIs featuring <a href="/marketplace/database-immutable.html">immutable database</a>, <a href="/marketplace/ipfs-upload.html">IPFS.ninja</a>, and <a href="/marketplace/database-mutable.html">mutable storage</a> solutions enabling developers to integrate decentralized technology through simple API calls.',
          'Won Nordea Bank Hackathon, recognized for innovative blockchain solutions in financial services using <a href="https://docs.bws.ninja/solutions/bws.blockchain.save" target="_blank" rel="noopener noreferrer">BWS.Blockchain.Save</a> API to save ESG figures into blockchain with a single API call.'
        ]
      },
      {
        title: 'Platform Architecture',
        paragraphs: [
          '<a href="https://blockchainbadges.com/" target="_blank" rel="noopener noreferrer">Blockchain Badges</a> became our first marketplace solution validating individual achievements by leveraging blockchain technology for secure and immutable digital certification.',
          '$BWS Token Launch established the platform pillar for growth through API fees funding ongoing product development, bringing token utility across all platform services with multi-chain support.'
        ]
      }
    ]
  },
  '2025-1': {
    quarter: 1,
    year: 2025,
    title: 'Fueling',
    cssClass: 'container-head-roadmap-25-1st',
    titleCssClass: 'text-roadmap-title-2025-q1',
    sections: [
      {
        title: 'Blockchain Badges Success Stories',
        paragraphs: [
          'Showcase early customer success stories highlighting real-world use cases, testimonials, and impact metrics from educational and event sectors.'
        ]
      }
    ]
  },
  '2025-2': {
    quarter: 2,
    year: 2025,
    title: 'Ignition',
    cssClass: 'container-head-roadmap-25-2nd',
    titleCssClass: 'text-roadmap-title-4th',
    sections: [
      {
        title: 'Utility Token',
        paragraphs: [
          'Progressive transition from FIAT to $BWS tokenomics across marketplace solutions, where scaling usage drives organic token demand creating sustainable buy pressure benefiting early holders and supporting long-term chart growth.'
        ]
      },
    ]
  },
  '2025-3': {
    quarter: 3,
    year: 2025,
    title: 'Targeting',
    cssClass: 'container-head-roadmap',
    titleCssClass: 'text-roadmap-title',
    sections: [
      {
        title: 'Turning into an AI-agentic Company',
        paragraphs: [
          'Evolve into an AI-agentic company with intelligent agents streamlining product development workflows and driving sales through automated lead qualification and personalized customer engagement'
        ]
      },
    ]
  },
  '2025-4': {
    quarter: 4,
    year: 2025,
    title: 'Moonshot',
    cssClass: 'container-head-roadmap-4th',
    titleCssClass: 'text-roadmap-title-4th',
    sections: [
      {
        title: 'AI-Native Build Workflow',
        paragraphs: [
          'Consolidated the full product lifecycle — discovery, design, engineering, QA, and marketplace ship — into a single AI-native pipeline operated in-house. This becomes the compounding moat behind every future BWS solution: each shipped solution sharpens the workflow, and each workflow gain speeds the next launch.'
        ]
      }

    ]
  },
  '2026': {
    quarter: '2026',
    title: 'Colony',
    cssClass: 'container-head-roadmap',
    titleCssClass: 'text-roadmap-title',
    sections: [
      {
        title: 'Global Expansion',
        paragraphs: [
          'Scale the BWS solutions factory into a repeatable, quarterly cadence. Every shipped solution sharpens the AI-native build workflow; every workflow gain speeds the next launch. Strategic expansion of marketing and sales efforts takes this compounding engine into broader markets and regions, with the factory — not any single product — as the durable asset.'
        ]
      }
    ]
  }
};
