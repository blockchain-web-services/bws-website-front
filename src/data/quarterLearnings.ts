export interface QuarterLearning {
  achieved: string[];
  missed: string[];
  lessons: string[];
}

export interface QuarterLearnings {
  [key: string]: QuarterLearning;
}

export const quarterLearnings: QuarterLearnings = {
  '2025-1': {
    achieved: [],
    missed: [],
    lessons: []
  },
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
  }
  // Additional quarters will be added as they become past quarters
};
