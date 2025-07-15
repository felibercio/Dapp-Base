/**
 * Configuração para Base Appchain - Preparação para escalabilidade
 * @author Felipe Bercio
 */

// Configuração da Base Appchain (quando disponível)
export const APPCHAIN_CONFIG = {
  // Configurações da rede
  network: {
    chainId: null, // Será definido quando a Appchain for criada
    name: 'Capy Pay Appchain',
    symbol: 'CAPY',
    decimals: 18,
    rpcUrl: null, // Será fornecido pela Coinbase
    explorerUrl: null, // Block explorer dedicado
    bridgeUrl: null, // Interface de bridge
  },

  // Critérios para migração
  migrationCriteria: {
    monthlyTransactions: 100000, // 100k transações/mês
    monthlyGasCosts: 5000, // $5k USD/mês em gas
    activeUsers: 10000, // 10k usuários ativos
    dailyVolume: 1000000, // $1M USD/dia
  },

  // Métricas atuais (para monitoramento)
  currentMetrics: {
    monthlyTransactions: 0,
    monthlyGasCosts: 0,
    activeUsers: 0,
    dailyVolume: 0,
    lastUpdated: null,
  },

  // Benefícios esperados
  expectedBenefits: {
    blockTime: 1, // 1 segundo vs 2 segundos na Base
    transactionCost: 0.001, // $0.001 vs $0.01 na Base
    throughput: 1000, // 1000 TPS vs 100 TPS compartilhado
    withdrawalTime: 10, // 10 segundos vs 7 dias
  },

  // Configurações customizadas da Appchain
  customFeatures: {
    gasToken: {
      symbol: 'CAPY',
      name: 'Capy Pay Token',
      totalSupply: 1000000000, // 1 bilhão
      distribution: {
        users: 40, // 40% para usuários
        staking: 30, // 30% para staking
        team: 20, // 20% para equipe
        treasury: 10, // 10% para treasury
      },
    },

    permissions: {
      allowedContracts: [], // Contratos permitidos
      blockedAddresses: [], // Endereços bloqueados
      rateLimits: {
        transactionsPerSecond: 100,
        transactionsPerUser: 1000,
      },
    },

    governance: {
      votingPower: 'CAPY', // Token de governança
      proposalThreshold: 1000000, // 1M CAPY para proposta
      votingPeriod: 7, // 7 dias
      executionDelay: 2, // 2 dias
    },
  },

  // Integração com Base Ecosystem
  baseIntegration: {
    smartWallet: {
      enabled: true,
      sponsorGas: true,
      batchTransactions: true,
    },
    paymaster: {
      enabled: true,
      sponsorThreshold: 1000, // Sponsorizar até $1000/mês por usuário
      allowedOperations: ['pix_to_brla', 'brla_to_pix', 'staking'],
    },
    onchainKit: {
      components: ['transaction', 'wallet', 'identity'],
      customizations: ['capy_theme', 'pix_integration'],
    },
  },

  // Configurações de bridging
  bridging: {
    baseToAppchain: {
      enabled: true,
      minAmount: 1, // 1 BRLA mínimo
      maxAmount: 100000, // 100k BRLA máximo
      fee: 0.001, // 0.1%
      confirmations: 1,
    },
    appchainToBase: {
      enabled: true,
      minAmount: 1,
      maxAmount: 100000,
      fee: 0.001,
      confirmations: 1,
    },
  },

  // Monitoramento e alertas
  monitoring: {
    metrics: [
      'transaction_volume',
      'gas_costs',
      'user_activity',
      'bridge_volume',
      'error_rate',
    ],
    alerts: {
      highGasCosts: 1000, // Alerta se gas > $1000/dia
      lowThroughput: 10, // Alerta se TPS < 10
      bridgeIssues: true,
    },
  },

  // Configurações de desenvolvimento
  development: {
    testnet: {
      enabled: true,
      cost: 1, // $1/mês
      features: ['bridging', 'custom_gas', 'permissions'],
    },
    migration: {
      strategy: 'gradual', // Migração gradual
      phases: [
        'staking_contracts',
        'pix_exchange',
        'user_balances',
        'frontend_integration',
      ],
    },
  },
};

// Função para verificar se deve migrar para Appchain
export const shouldMigrateToAppchain = (currentMetrics) => {
  const criteria = APPCHAIN_CONFIG.migrationCriteria;
  
  return (
    currentMetrics.monthlyTransactions >= criteria.monthlyTransactions &&
    currentMetrics.monthlyGasCosts >= criteria.monthlyGasCosts &&
    currentMetrics.activeUsers >= criteria.activeUsers &&
    currentMetrics.dailyVolume >= criteria.dailyVolume
  );
};

// Função para calcular benefícios da migração
export const calculateMigrationBenefits = (currentMetrics) => {
  const currentCosts = currentMetrics.monthlyGasCosts;
  const appchainCosts = 1000; // $1000/mês fixo
  
  return {
    costSavings: currentCosts - appchainCosts,
    performanceGain: APPCHAIN_CONFIG.expectedBenefits.throughput / 100, // 10x melhoria
    userExperienceScore: 95, // Score de 0-100
    roi: ((currentCosts - appchainCosts) / appchainCosts) * 100,
  };
};

// Função para gerar relatório de migração
export const generateMigrationReport = () => {
  const current = APPCHAIN_CONFIG.currentMetrics;
  const shouldMigrate = shouldMigrateToAppchain(current);
  const benefits = calculateMigrationBenefits(current);
  
  return {
    shouldMigrate,
    benefits,
    timeline: shouldMigrate ? '2-3 meses' : 'Aguardar crescimento',
    nextSteps: shouldMigrate 
      ? ['Aplicar para beta', 'Configurar testnet', 'Migrar contratos']
      : ['Monitorar métricas', 'Otimizar Base Mainnet', 'Crescer user base'],
  };
};

export default APPCHAIN_CONFIG; 