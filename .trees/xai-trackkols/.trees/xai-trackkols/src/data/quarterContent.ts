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
          'Core infrastructure launched with Platform APIs featuring <a href="/marketplace/database-immutable.html">immutable database</a>, <a href="/marketplace/ipfs-upload.html">IPFS upload</a>, and <a href="/marketplace/database-mutable.html">mutable storage</a> solutions enabling developers to integrate blockchain technology through simple API calls.',
          'Won Nordea Bank Hackathon, recognized for innovative blockchain solutions in financial services using <a href="https://docs.bws.ninja/solutions/bws.blockchain.save" target="_blank" rel="noopener noreferrer">BWS.Blockchain.Save</a> API to save ESG figures into blockchain with a single API call.'
        ]
      },
      {
        title: 'Platform Architecture',
        paragraphs: [
          '<a href="https://blockchainbadges.com/" target="_blank" rel="noopener noreferrer">Blockchain Badges</a> became our first marketplace solution validating individual achievements by leveraging blockchain technology for secure and immutable digital certification.',
          '$BWS Token Launch established the platform pillar for growth through API fees and developer community involvement, bringing token utility across all platform services with multi-chain support.'
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
        title: 'Fan Game Cube',
        paragraphs: [
          'Launching innovative platform that tokenizes sports fields into tradeable digital cubes, enabling real-time fan engagement where cube owners earn points and rewards based on in-game actions in their field sections.'
        ]
      },
      {
        title: 'ESG Credits',
        paragraphs: [
          'Launching trusted blockchain platform for financial institutions to track and report environmental impact transparently.'
        ]
      },
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
      {
        title: 'X Bot Launch',
        paragraphs: [
          'Community engagement tool helping crypto projects and Telegram groups monitor and boost their X presence through gamified leaderboards, delivering data-driven insights into member engagement patterns.'
        ]
      },
      {
        title: 'Market Awareness',
        paragraphs: [
          'Launch comprehensive marketing campaigns across multiple channels to drive platform awareness and user acquisition.'
        ]
      }
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
      {
        title: 'Premier League Partnership',
        paragraphs: [
          'First Premier League club partnership implementing tokenized fan zones and blockchain-based fan engagement.'
        ]
      },
      {
        title: 'French Club Partnership',
        paragraphs: [
          'Major French football club partnership bringing Fan Game Cube to top-tier European competition. Joint venture with Matchain delivers user-friendly blockchain infrastructure making Web3 accessible to millions of sports fans.'
        ]
      }
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
        title: 'BWS Market Maker',
        paragraphs: [
          'Launch of in-house automated market making infrastructure ensuring token liquidity and price stability.'
        ]
      },
      {
        title: 'iGaming Platform Alpha',
        paragraphs: [
          'Deploy Maincard.io-powered platform in regulated EMEA & North America markets'
        ]
      },
      {
        title: 'Sportsbook Integration',
        paragraphs: [
          'Fan Game Cube sportsbook edition tailored for betting partnership requirements with licensed operators.'
        ]
      },
      {
        title: 'New AI Blockchain Solution',
        paragraphs: [
          'Develop white-paper and architecture for proprietary AI model tailored to new BWS Marketplace solution in the crypto space.'
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
        title: 'New AI Marketplace Solution',
        paragraphs: [
          'Leverage BWS Crypto AI for actionable token intelligence, driving the strategic launch of an ERC-7621 BWS Marketplace Solution.'
        ]
      },
      {
        title: 'Global Expansion of BWS Marketplace Solutions',
        paragraphs: [
          'Strategic expansion of marketing and sales efforts to reach broader global audiences for our proven marketplace solutions including Fan Game Cube, ESG Credits, Crypto AI, Blockchain Badges, and X Bot, demonstrating BWS as a platform enabling mass market adoption of blockchain technology across multiple industries and regions.'
        ]
      },
      {
        title: 'BWS Developer Grants',
        paragraphs: [
          'Comprehensive revamp of the developer grant program to accelerate growth and fulfill Blockchain Web Services mission. Enhanced funding structure and support systems drive in-crescendo expansion of solutions on our proven marketplace, empowering developers worldwide to build the next generation of blockchain innovations.'
        ]
      }
    ]
  }
};
