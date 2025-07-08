/**
 * Constantes de configuração da aplicação
 */

// Configuração da rede Base
export const BASE_NETWORK = {
  chainId: 8453,
  name: 'Base',
  symbol: 'ETH',
  decimals: 18,
  rpcUrl: process.env.REACT_APP_BASE_RPC_URL || 'https://mainnet.base.org',
  explorerUrl: process.env.REACT_APP_BASE_EXPLORER_URL || 'https://basescan.org',
  testnet: {
    chainId: 84531,
    name: 'Base Goerli',
    rpcUrl: 'https://goerli.base.org',
    explorerUrl: 'https://goerli.basescan.org'
  }
};

// Endereços de contratos
export const CONTRACTS = {
  BRLA: process.env.REACT_APP_BRLA_CONTRACT_ADDRESS || '0x...', // Substituir pelo endereço real
  TREASURY: process.env.REACT_APP_TREASURY_CONTRACT_ADDRESS || '0x...',
  STAKING: process.env.REACT_APP_STAKING_CONTRACT_ADDRESS || '0x...'
};

// Configuração da API PIX
export const PIX_CONFIG = {
  apiBaseUrl: process.env.REACT_APP_PIX_API_BASE_URL || 'https://api.bacen.gov.br/pix/v1',
  timeout: 30000,
  retryAttempts: 3
};

// Configuração do WalletConnect
export const WALLET_CONFIG = {
  projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  appName: 'Super Dapp Base',
  appDescription: 'DApp para pagamentos PIX e conversões BRLA na Base',
  appUrl: 'https://super-dapp-base.vercel.app',
  appIcon: '/favicon.ico'
};

// Configuração de valores padrão
export const DEFAULT_VALUES = {
  minPixAmount: 1, // R$ 1,00
  maxPixAmount: 10000, // R$ 10.000,00
  minBrlaAmount: 1,
  maxBrlaAmount: 10000,
  stakingMinAmount: 100,
  transactionTimeout: 300000, // 5 minutos
  refreshInterval: 30000 // 30 segundos
};

// Configuração de ambiente
export const ENVIRONMENT = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  appVersion: process.env.REACT_APP_VERSION || '1.0.0'
};

// URLs de serviços externos
export const EXTERNAL_URLS = {
  metamaskDownload: 'https://metamask.io/download/',
  baseDocumentation: 'https://docs.base.org/',
  pixDocumentation: 'https://www.bcb.gov.br/estabilidadefinanceira/pix',
  support: 'https://github.com/seu-usuario/super-dapp-base/issues'
};

// Configuração de notificações
export const NOTIFICATION_CONFIG = {
  duration: 5000,
  position: 'top-right',
  types: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }
};

// Configuração de staking pools
export const STAKING_POOLS = [
  {
    id: 'brla-pool',
    name: 'BRLA Staking',
    token: 'BRLA',
    apy: 12.5,
    minStake: 100,
    lockPeriod: 30, // dias
    risk: 'low'
  },
  {
    id: 'eth-brla-lp',
    name: 'ETH-BRLA LP',
    token: 'ETH-BRLA',
    apy: 18.7,
    minStake: 0.1,
    lockPeriod: 60,
    risk: 'medium'
  },
  {
    id: 'base-rewards',
    name: 'Base Rewards',
    token: 'BASE',
    apy: 25.3,
    minStake: 50,
    lockPeriod: 90,
    risk: 'high'
  }
];

// Configuração de taxas
export const FEES = {
  pixToBrla: 0.001, // 0.1%
  brlaToPixConversion: 0.002, // 0.2%
  stakingDeposit: 0,
  stakingWithdraw: 0.001,
  gasPriceMultiplier: 1.2
};

// Configuração de cores do tema
export const THEME_COLORS = {
  primary: '#1B365D',
  secondary: '#FFFFFF',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  background: '#FFFFFF',
  surface: '#F8F9FA'
};

export default {
  BASE_NETWORK,
  CONTRACTS,
  PIX_CONFIG,
  WALLET_CONFIG,
  DEFAULT_VALUES,
  ENVIRONMENT,
  EXTERNAL_URLS,
  NOTIFICATION_CONFIG,
  STAKING_POOLS,
  FEES,
  THEME_COLORS
}; 