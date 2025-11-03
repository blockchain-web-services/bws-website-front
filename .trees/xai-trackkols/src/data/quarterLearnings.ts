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
    achieved: [
      'We officially launched Fan Game Cube and ESG Credits solutions'
    ],
    missed: [],
    lessons: [
      'ESG Credits shows strong market potential; however, client acquisition involves longer, consultative sales cycles.',
      'Fan Game Cube sales efforts should be positioned independently from BWS’s long-term strategic vision to maintain focus and reduce complexity in customer discussions.'
    ]
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
    achieved: [
      'Fan Game Cube advanced to the final selection stage with a leading French football club, while engagements with a Premier League club are underway.'
    ],
    missed: [
    ],
    lessons: [
      'Prioritizing large partnerships for Fan Game Cube has limited traction in small and mid-market segments.',
      'Using AI agents for coding and sales workflows is already delivering, but adoption is slower than predicted.'
    ]
  }
  // Additional quarters will be added as they become past quarters
};
