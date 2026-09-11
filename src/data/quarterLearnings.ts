export interface QuarterLearning {
  achieved: string[];
  missed: string[];
  lessons: string[];
}

export interface QuarterLearnings {
  [key: string]: QuarterLearning;
}

export const quarterLearnings: QuarterLearnings = {
  '2025-3': {
    achieved: [],
    missed: [],
    lessons: [
      'Using AI agents for coding and sales workflows is already delivering, but adoption is slower than predicted.'
    ]
  },
  '2025-4': {
    achieved: [
      'Consolidated the full product lifecycle — discovery, design, engineering, QA, and marketplace ship — into a single AI-native build workflow operated in-house.',
      'Shifted the marketplace model: every new solution is now built, owned, and operated internally, removing reliance on external developer pipelines.',
      'Opened the solution scope to market-demand-first products, each selected and architected around the outcome it delivers for the customer.'
    ],
    missed: [],
    lessons: [
      'The defensible advantage is the workflow, not any individual solution — every shipped solution that sharpens the pipeline compounds the next launch.',
      'Leading with the customer outcome rather than the underlying technology expands the addressable market without weakening the positioning for technical buyers.'
    ]
  }
  // Additional quarters will be added as they become past quarters
};
