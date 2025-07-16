/**
 * Configuração completa para integração com o Ecossistema Base
 * Baseado na documentação oficial: https://docs.base.org
 * @author Felipe Bercio
 */

// Configuração dos programas de funding da Base
export const BASE_FUNDING_PROGRAMS = {
  builderRewards: {
    name: 'Builder Rewards Program',
    description: 'Get rewarded up to 2 ETH weekly through the Builder Rewards Program',
    maxReward: '2 ETH/week',
    platform: 'https://www.builderscore.xyz/',
    requirements: [
      'Deploy contracts on Base',
      'Generate transaction volume',
      'Build innovative features',
      'Contribute to ecosystem growth'
    ],
    eligibility: {
      contractDeployed: true,
      weeklyTxVolume: 1000,
      uniqueUsers: 100,
      codeQuality: 'high'
    },
    applicationStatus: 'ready', // ready, applied, approved, rejected
    estimatedReward: '0.5-2 ETH',
  },

  grants: {
    name: 'Base Builder Grants',
    description: 'Fast, retroactive grants for Base builders (~1-5 ETH)',
    maxReward: '5 ETH',
    platform: 'https://paragraph.com/@grants.base.eth/calling-based-builders',
    requirements: [
      'Build on Base Mainnet',
      'Demonstrate product-market fit',
      'Show user adoption',
      'Contribute to Base ecosystem'
    ],
    eligibility: {
      mainnetDeployment: true,
      monthlyUsers: 500,
      transactionVolume: 10000,
      ecosystemContribution: 'medium'
    },
    applicationStatus: 'ready',
    estimatedReward: '1-5 ETH',
  },

  baseBatches: {
    name: 'Base Batches',
    description: 'Global program for builders creating the next wave of onchain apps',
    maxReward: 'Variable',
    platform: 'https://www.basebatches.xyz/',
    requirements: [
      'Innovative onchain application',
      'Strong team and vision',
      'Scalable business model',
      'Community engagement'
    ],
    eligibility: {
      teamExperience: 'medium',
      productStage: 'mvp',
      marketPotential: 'high',
      technicalInnovation: 'high'
    },
    applicationStatus: 'evaluating',
    estimatedReward: 'Equity + Mentorship',
  },

  retroFunding: {
    name: 'OP Retro Funding',
    description: 'Retroactive funding for contributions to the Base ecosystem',
    maxReward: 'Variable',
    platform: 'https://atlas.optimism.io/',
    requirements: [
      'Significant ecosystem contribution',
      'Open source components',
      'Community impact',
      'Technical excellence'
    ],
    eligibility: {
      openSourceContribution: true,
      communityImpact: 'high',
      technicalContribution: 'high',
      ecosystemGrowth: 'medium'
    },
    applicationStatus: 'planning',
    estimatedReward: '10-100 ETH',
  },
};

// Configuração de distribuição e marketing
export const BASE_DISTRIBUTION_CHANNELS = {
  miniApps: {
    name: 'Base Mini Apps',
    description: 'Mini Apps run directly inside the social feed',
    platform: '/wallet-app/build-with-minikit/quickstart',
    benefits: [
      'Direct access to user feeds',
      'Seamless onboarding',
      'Viral distribution potential',
      'Reduced friction'
    ],
    requirements: {
      mobileOptimized: true,
      fastLoading: true,
      socialIntegration: true,
      walletIntegration: true
    },
    implementation: {
      status: 'planned',
      priority: 'high',
      estimatedUsers: '10k-100k',
      timeline: '2-3 months'
    },
  },

  ecosystemPage: {
    name: 'Base Ecosystem Showcase',
    description: 'Showcase your project to the Base community',
    platform: 'https://www.base.org/ecosystem',
    benefits: [
      'Official Base recognition',
      'Increased visibility',
      'Community discovery',
      'Partnership opportunities'
    ],
    requirements: {
      mainnetDeployment: true,
      activeUsers: 100,
      documentation: 'complete',
      security: 'audited'
    },
    implementation: {
      status: 'ready',
      priority: 'medium',
      estimatedUsers: '1k-10k',
      timeline: '1 week'
    },
  },

  baseActivations: {
    name: 'Base Activations',
    description: 'Tap Base activations and launch events',
    platform: 'Community channels',
    benefits: [
      'Event participation',
      'Community engagement',
      'Network effects',
      'Partnership building'
    ],
    requirements: {
      communityPresence: true,
      eventParticipation: true,
      networkContribution: true,
      brandAlignment: true
    },
    implementation: {
      status: 'ongoing',
      priority: 'medium',
      estimatedUsers: '500-5k',
      timeline: 'continuous'
    },
  },
};

// Configuração de ferramentas e serviços Base
export const BASE_TOOLS_INTEGRATION = {
  smartWallet: {
    name: 'Smart Wallet',
    description: 'Account abstraction for seamless user experience',
    documentation: '/smart-wallet/quickstart',
    benefits: [
      'Gasless transactions',
      'Social recovery',
      'Batch transactions',
      'Improved UX'
    ],
    implementation: {
      status: 'planned',
      priority: 'high',
      features: ['gas_sponsorship', 'batch_transactions', 'social_recovery'],
      timeline: '1-2 months'
    },
  },

  paymaster: {
    name: 'Paymaster',
    description: 'Sponsor gas costs for users',
    documentation: 'https://docs.cdp.coinbase.com/paymaster/docs/welcome',
    benefits: [
      'Remove gas friction',
      'Improve onboarding',
      'Predictable costs',
      'Better retention'
    ],
    implementation: {
      status: 'partial',
      priority: 'high',
      currentSponsorship: '$500/month',
      targetSponsorship: '$5000/month',
      timeline: 'active'
    },
  },

  onchainKit: {
    name: 'OnchainKit',
    description: 'React components for onchain apps',
    documentation: '/onchainkit/getting-started',
    benefits: [
      'Faster development',
      'Consistent UI',
      'Best practices',
      'Ecosystem integration'
    ],
    implementation: {
      status: 'active',
      priority: 'medium',
      components: ['transaction', 'wallet', 'identity'],
      customizations: ['pix_theme', 'capy_branding'],
      timeline: 'ongoing'
    },
  },

  basenames: {
    name: 'Basenames',
    description: 'Human-readable names for Base addresses',
    documentation: '/basenames',
    benefits: [
      'Improved UX',
      'Brand recognition',
      'Easy sharing',
      'Professional appearance'
    ],
    implementation: {
      status: 'planned',
      priority: 'low',
      targetName: 'capypay.base.eth',
      timeline: '3-6 months'
    },
  },
};

// Métricas e KPIs para programas Base
export const BASE_METRICS_TRACKING = {
  builderScore: {
    currentScore: 0,
    targetScore: 80,
    factors: {
      contractDeployments: 0,
      transactionVolume: 0,
      uniqueUsers: 0,
      codeQuality: 0,
      communityEngagement: 0
    },
    improvements: [
      'Deploy more contracts',
      'Increase transaction volume',
      'Grow user base',
      'Improve code quality',
      'Engage with community'
    ],
  },

  ecosystemContribution: {
    openSourceContributions: 0,
    communityHelp: 0,
    toolsBuilt: 0,
    documentationCreated: 0,
    eventsParticipated: 0,
  },

  userGrowth: {
    monthlyActiveUsers: 0,
    transactionVolume: 0,
    retentionRate: 0,
    conversionRate: 0,
    viralCoefficient: 0,
  },
};

// Roadmap de integração com Base
export const BASE_INTEGRATION_ROADMAP = {
  phase1: {
    name: 'Foundation',
    duration: '1-2 months',
    status: 'completed',
    milestones: [
      '✅ Deploy on Base Mainnet',
      '✅ Integrate RainbowKit',
      '✅ Basic Web3 functionality',
      '✅ Smart contracts audited'
    ],
  },

  phase2: {
    name: 'Ecosystem Integration',
    duration: '2-3 months',
    status: 'in_progress',
    milestones: [
      '🔄 Implement Smart Wallet',
      '🔄 Add Paymaster integration',
      '🔄 Build Mini App version',
      '⏳ Submit to Ecosystem page'
    ],
  },

  phase3: {
    name: 'Growth & Funding',
    duration: '3-6 months',
    status: 'planned',
    milestones: [
      '⏳ Apply for Builder Rewards',
      '⏳ Submit Grant applications',
      '⏳ Join Base Batches program',
      '⏳ Launch community initiatives'
    ],
  },

  phase4: {
    name: 'Scale & Appchain',
    duration: '6-12 months',
    status: 'planned',
    milestones: [
      '⏳ Reach 10k+ users',
      '⏳ Apply for Appchain beta',
      '⏳ Launch governance token',
      '⏳ Build ecosystem partnerships'
    ],
  },
};

// Funções utilitárias
export const checkFundingEligibility = (program) => {
  const programConfig = BASE_FUNDING_PROGRAMS[program];
  if (!programConfig) return false;

  const { eligibility } = programConfig;
  // Implementar lógica de verificação baseada nas métricas atuais
  return true; // Placeholder
};

export const calculateBuilderScore = (metrics) => {
  const weights = {
    contractDeployments: 0.2,
    transactionVolume: 0.3,
    uniqueUsers: 0.3,
    codeQuality: 0.1,
    communityEngagement: 0.1
  };

  let score = 0;
  Object.entries(weights).forEach(([key, weight]) => {
    score += (metrics[key] || 0) * weight;
  });

  return Math.min(score, 100);
};

export const getNextMilestones = () => {
  const phases = Object.values(BASE_INTEGRATION_ROADMAP);
  const currentPhase = phases.find(phase => phase.status === 'in_progress');
  
  if (!currentPhase) return [];
  
  return currentPhase.milestones.filter(milestone => 
    milestone.startsWith('🔄') || milestone.startsWith('⏳')
  );
};

export const generateFundingReport = () => {
  const eligiblePrograms = Object.keys(BASE_FUNDING_PROGRAMS).filter(program => 
    checkFundingEligibility(program)
  );

  const totalPotentialFunding = eligiblePrograms.reduce((total, program) => {
    const maxReward = BASE_FUNDING_PROGRAMS[program].maxReward;
    // Parse ETH values (simplified)
    const ethValue = parseFloat(maxReward.replace(/[^\d.]/g, '')) || 0;
    return total + ethValue;
  }, 0);

  return {
    eligiblePrograms,
    totalPotentialFunding: `${totalPotentialFunding} ETH`,
    nextActions: [
      'Complete Smart Wallet integration',
      'Deploy Mini App version',
      'Increase user base to 1k+',
      'Submit ecosystem applications'
    ],
    timeline: '2-3 months'
  };
};

export default {
  BASE_FUNDING_PROGRAMS,
  BASE_DISTRIBUTION_CHANNELS,
  BASE_TOOLS_INTEGRATION,
  BASE_METRICS_TRACKING,
  BASE_INTEGRATION_ROADMAP,
  checkFundingEligibility,
  calculateBuilderScore,
  getNextMilestones,
  generateFundingReport
}; 