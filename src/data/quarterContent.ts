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
