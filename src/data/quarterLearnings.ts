export interface QuarterLearning {
  achieved: string[];
  missed: string[];
  lessons: string[];
}

export interface QuarterLearnings {
  [key: string]: QuarterLearning;
}

export const quarterLearnings: QuarterLearnings = {
  '2025-2': {
    achieved: [
      'Launched the X Bot solution, targeting the crypto market segment.',
      'Blockchain Badges continues to grow its base of key early customers and adopters.'
    ],
    missed: [
    ],
    lessons: [
      'Scaling will require an AI Agent–driven model capable of supporting marketplace-level growth (dev and sales).'
    ]
  },
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
      'Opened the solution scope beyond blockchain-native products to include market-demand-first solutions, each architected to carry a blockchain dimension when it deepens the customer outcome.'
    ],
    missed: [],
    lessons: [
      'The defensible advantage is the workflow, not any individual solution — every shipped solution that sharpens the pipeline compounds the next launch.',
      'Framing blockchain as an added-value dimension (rather than a gate) expands the addressable market without weakening the positioning for blockchain-native customers.'
    ]
  }
  // Additional quarters will be added as they become past quarters
};
