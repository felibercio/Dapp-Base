import { ethers } from 'ethers';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';

// ABI do contrato principal
const PIX_STABLECOIN_EXCHANGE_ABI = [
  // Eventos
  'event PixToStablecoinInitiated(string indexed pixId, address indexed user, uint256 pixAmount, address indexed stablecoin, uint256 expectedStablecoinAmount, uint256 nonce)',
  'event PixConfirmed(string indexed pixId, address indexed user, uint256 pixAmount, string bankTransactionId)',
  'event StablecoinTransferred(string indexed pixId, address indexed user, address indexed stablecoin, uint256 stablecoinAmount, uint256 fee)',
  'event StablecoinToPixInitiated(address indexed user, address indexed stablecoin, uint256 stablecoinAmount, uint256 expectedPixAmount, string pixKey, uint256 nonce)',
  
  // Funções principais
  'function initiatePixToStablecoin(string calldata pixId, uint256 pixAmount, address stablecoin) external',
  'function initiateStablecoinToPix(address stablecoin, uint256 stablecoinAmount, string calldata pixKey) external',
  
  // Funções de visualização
  'function getStablecoinInfo(address stablecoin) external view returns (tuple(address token, uint8 decimals, bool isActive, uint256 minAmount, uint256 maxAmount, uint256 dailyLimit, uint256 poolBalance, uint256 exchangeRate))',
  'function getPixTransaction(string calldata pixId) external view returns (tuple(string pixId, address user, uint256 pixAmount, address stablecoin, uint256 stablecoinAmount, uint256 fee, uint256 timestamp, uint8 status, string pixKey, string bankTransactionId))',
  'function getUserDailyVolume(address user) external view returns (uint256)',
  'function calculateStablecoinAmount(uint256 pixAmount, address stablecoin) external view returns (uint256)',
  'function calculatePixAmount(uint256 stablecoinAmount, address stablecoin) external view returns (uint256)',
  'function calculateFee(uint256 amount) external view returns (uint256)',
  'function getSupportedStablecoins() external view returns (address[])',
  'function getPoolBalance(address stablecoin) external view returns (uint256)',
  'function userNonce(address user) external view returns (uint256)'
];

// Endereços dos contratos
const CONTRACT_ADDRESSES = {
  PIX_STABLECOIN_EXCHANGE: process.env.REACT_APP_PIX_STABLECOIN_EXCHANGE_ADDRESS || '',
  BRLA_TOKEN: process.env.REACT_APP_BRLA_TOKEN_ADDRESS || '0x5d0707b7e9b3b75d5a9e0e2e0e0e0e0e0e0e0e0e',
  USDC_TOKEN: process.env.REACT_APP_USDC_TOKEN_ADDRESS || '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
};

/**
 * Serviço para interagir com o contrato PixStablecoinExchange
 */
export class PixStablecoinService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.publicClient = null;
    this.walletClient = null;
  }

  /**
   * Inicializar serviço
   */
  async initialize() {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask não está instalado');
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.publicClient = createPublicClient({
        chain: base,
        transport: custom(window.ethereum)
      });

      // Verificar rede
      const network = await this.provider.getNetwork();
      if (Number(network.chainId) !== 8453) {
        throw new Error('Por favor, conecte-se à rede Base');
      }

      console.log('PixStablecoinService inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao inicializar PixStablecoinService:', error);
      throw error;
    }
  }

  /**
   * Conectar wallet
   */
  async connectWallet() {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('Nenhuma conta disponível');
      }

      this.signer = await this.provider.getSigner();
      this.walletClient = createWalletClient({
        chain: base,
        transport: custom(window.ethereum)
      });

      // Inicializar contrato
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES.PIX_STABLECOIN_EXCHANGE,
        PIX_STABLECOIN_EXCHANGE_ABI,
        this.signer
      );

      const address = await this.signer.getAddress();
      console.log('Wallet conectada:', address);
      
      return {
        address,
        isConnected: true
      };
    } catch (error) {
      console.error('Erro ao conectar wallet:', error);
      throw error;
    }
  }

  /**
   * Iniciar conversão PIX para Stablecoin
   */
  async initiatePixToStablecoin(pixId, pixAmount, stablecoinAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato não inicializado');
      }

      const amountInWei = ethers.parseEther(pixAmount.toString());

      // Verificar se a stablecoin é suportada
      const stablecoinInfo = await this.getStablecoinInfo(stablecoinAddress);
      if (!stablecoinInfo.isActive) {
        throw new Error('Stablecoin não suportada');
      }

      // Verificar limites
      if (amountInWei < stablecoinInfo.minAmount) {
        throw new Error('Valor abaixo do mínimo permitido');
      }

      if (amountInWei > stablecoinInfo.maxAmount) {
        throw new Error('Valor acima do máximo permitido');
      }

      // Calcular quantidade esperada de stablecoin
      const expectedStablecoinAmount = await this.calculateStablecoinAmount(
        amountInWei,
        stablecoinAddress
      );

      // Verificar liquidez do pool
      const poolBalance = await this.getPoolBalance(stablecoinAddress);
      if (poolBalance < expectedStablecoinAmount) {
        throw new Error('Liquidez insuficiente no pool');
      }

      // Executar transação
      const tx = await this.contract.initiatePixToStablecoin(
        pixId,
        amountInWei,
        stablecoinAddress
      );

      console.log('Transação enviada:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transação confirmada:', receipt.transactionHash);

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        pixId,
        pixAmount,
        stablecoinAddress,
        expectedStablecoinAmount: ethers.formatUnits(expectedStablecoinAmount, stablecoinInfo.decimals),
        explorerUrl: `https://basescan.org/tx/${receipt.transactionHash}`
      };
    } catch (error) {
      console.error('Erro ao iniciar conversão PIX para Stablecoin:', error);
      throw error;
    }
  }

  /**
   * Iniciar conversão Stablecoin para PIX
   */
  async initiateStablecoinToPix(stablecoinAddress, stablecoinAmount, pixKey) {
    try {
      if (!this.contract) {
        throw new Error('Contrato não inicializado');
      }

      const stablecoinInfo = await this.getStablecoinInfo(stablecoinAddress);
      if (!stablecoinInfo.isActive) {
        throw new Error('Stablecoin não suportada');
      }

      const amountInWei = ethers.parseUnits(
        stablecoinAmount.toString(),
        stablecoinInfo.decimals
      );

      // Verificar saldo do usuário
      const userAddress = await this.signer.getAddress();
      const stablecoinContract = new ethers.Contract(
        stablecoinAddress,
        ['function balanceOf(address) view returns (uint256)', 'function approve(address, uint256) returns (bool)'],
        this.signer
      );

      const balance = await stablecoinContract.balanceOf(userAddress);
      if (balance < amountInWei) {
        throw new Error('Saldo insuficiente de stablecoin');
      }

      // Aprovar o contrato para gastar os tokens
      const allowance = await stablecoinContract.allowance(userAddress, CONTRACT_ADDRESSES.PIX_STABLECOIN_EXCHANGE);
      if (allowance < amountInWei) {
        console.log('Aprovando gasto de tokens...');
        const approveTx = await stablecoinContract.approve(
          CONTRACT_ADDRESSES.PIX_STABLECOIN_EXCHANGE,
          amountInWei
        );
        await approveTx.wait();
        console.log('Aprovação confirmada');
      }

      // Calcular valor PIX esperado
      const expectedPixAmount = await this.calculatePixAmount(amountInWei, stablecoinAddress);
      const fee = await this.calculateFee(expectedPixAmount);
      const netPixAmount = expectedPixAmount - fee;

      // Executar transação
      const tx = await this.contract.initiateStablecoinToPix(
        stablecoinAddress,
        amountInWei,
        pixKey
      );

      console.log('Transação enviada:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transação confirmada:', receipt.transactionHash);

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        stablecoinAddress,
        stablecoinAmount,
        expectedPixAmount: ethers.formatEther(expectedPixAmount),
        netPixAmount: ethers.formatEther(netPixAmount),
        fee: ethers.formatEther(fee),
        pixKey,
        explorerUrl: `https://basescan.org/tx/${receipt.transactionHash}`
      };
    } catch (error) {
      console.error('Erro ao iniciar conversão Stablecoin para PIX:', error);
      throw error;
    }
  }

  /**
   * Obter informações de uma stablecoin
   */
  async getStablecoinInfo(stablecoinAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato não inicializado');
      }

      const info = await this.contract.getStablecoinInfo(stablecoinAddress);
      
      return {
        token: info.token,
        decimals: info.decimals,
        isActive: info.isActive,
        minAmount: info.minAmount,
        maxAmount: info.maxAmount,
        dailyLimit: info.dailyLimit,
        poolBalance: info.poolBalance,
        exchangeRate: info.exchangeRate
      };
    } catch (error) {
      console.error('Erro ao obter informações da stablecoin:', error);
      throw error;
    }
  }

  /**
   * Obter stablecoins suportadas
   */
  async getSupportedStablecoins() {
    try {
      if (!this.contract) {
        throw new Error('Contrato não inicializado');
      }

      const addresses = await this.contract.getSupportedStablecoins();
      const stablecoins = [];

      for (const address of addresses) {
        const info = await this.getStablecoinInfo(address);
        if (info.isActive) {
          stablecoins.push({
            address,
            ...info,
            name: address === CONTRACT_ADDRESSES.BRLA_TOKEN ? 'BRLA' : 'USDC',
            symbol: address === CONTRACT_ADDRESSES.BRLA_TOKEN ? 'BRLA' : 'USDC'
          });
        }
      }

      return stablecoins;
    } catch (error) {
      console.error('Erro ao obter stablecoins suportadas:', error);
      throw error;
    }
  }

  /**
   * Calcular quantidade de stablecoin
   */
  async calculateStablecoinAmount(pixAmount, stablecoinAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato não inicializado');
      }

      return await this.contract.calculateStablecoinAmount(pixAmount, stablecoinAddress);
    } catch (error) {
      console.error('Erro ao calcular quantidade de stablecoin:', error);
      throw error;
    }
  }

  /**
   * Calcular valor PIX
   */
  async calculatePixAmount(stablecoinAmount, stablecoinAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato não inicializado');
      }

      return await this.contract.calculatePixAmount(stablecoinAmount, stablecoinAddress);
    } catch (error) {
      console.error('Erro ao calcular valor PIX:', error);
      throw error;
    }
  }

  /**
   * Calcular taxa
   */
  async calculateFee(amount) {
    try {
      if (!this.contract) {
        throw new Error('Contrato não inicializado');
      }

      return await this.contract.calculateFee(amount);
    } catch (error) {
      console.error('Erro ao calcular taxa:', error);
      throw error;
    }
  }

  /**
   * Obter saldo do pool
   */
  async getPoolBalance(stablecoinAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato não inicializado');
      }

      return await this.contract.getPoolBalance(stablecoinAddress);
    } catch (error) {
      console.error('Erro ao obter saldo do pool:', error);
      throw error;
    }
  }

  /**
   * Obter volume diário do usuário
   */
  async getUserDailyVolume(userAddress = null) {
    try {
      if (!this.contract) {
        throw new Error('Contrato não inicializado');
      }

      const address = userAddress || await this.signer.getAddress();
      const volume = await this.contract.getUserDailyVolume(address);
      
      return ethers.formatEther(volume);
    } catch (error) {
      console.error('Erro ao obter volume diário:', error);
      throw error;
    }
  }

  /**
   * Obter informações de transação PIX
   */
  async getPixTransaction(pixId) {
    try {
      if (!this.contract) {
        throw new Error('Contrato não inicializado');
      }

      const transaction = await this.contract.getPixTransaction(pixId);
      
      return {
        pixId: transaction.pixId,
        user: transaction.user,
        pixAmount: ethers.formatEther(transaction.pixAmount),
        stablecoin: transaction.stablecoin,
        stablecoinAmount: transaction.stablecoinAmount,
        fee: ethers.formatEther(transaction.fee),
        timestamp: Number(transaction.timestamp),
        status: transaction.status,
        pixKey: transaction.pixKey,
        bankTransactionId: transaction.bankTransactionId
      };
    } catch (error) {
      console.error('Erro ao obter transação PIX:', error);
      throw error;
    }
  }

  /**
   * Configurar listeners de eventos
   */
  setupEventListeners() {
    try {
      if (!this.contract) {
        throw new Error('Contrato não inicializado');
      }

      // PIX para Stablecoin iniciado
      this.contract.on('PixToStablecoinInitiated', (pixId, user, pixAmount, stablecoin, expectedStablecoinAmount, nonce, event) => {
        console.log('PIX para Stablecoin iniciado:', {
          pixId,
          user,
          pixAmount: ethers.formatEther(pixAmount),
          stablecoin,
          expectedStablecoinAmount: expectedStablecoinAmount.toString(),
          nonce: nonce.toString(),
          transactionHash: event.transactionHash
        });

        window.dispatchEvent(new CustomEvent('pixToStablecoinInitiated', {
          detail: {
            pixId,
            user,
            pixAmount: ethers.formatEther(pixAmount),
            stablecoin,
            expectedStablecoinAmount: expectedStablecoinAmount.toString(),
            nonce: nonce.toString(),
            transactionHash: event.transactionHash
          }
        }));
      });

      // PIX confirmado
      this.contract.on('PixConfirmed', (pixId, user, pixAmount, bankTransactionId, event) => {
        console.log('PIX confirmado:', {
          pixId,
          user,
          pixAmount: ethers.formatEther(pixAmount),
          bankTransactionId,
          transactionHash: event.transactionHash
        });

        window.dispatchEvent(new CustomEvent('pixConfirmed', {
          detail: {
            pixId,
            user,
            pixAmount: ethers.formatEther(pixAmount),
            bankTransactionId,
            transactionHash: event.transactionHash
          }
        }));
      });

      // Stablecoin transferida
      this.contract.on('StablecoinTransferred', (pixId, user, stablecoin, stablecoinAmount, fee, event) => {
        console.log('Stablecoin transferida:', {
          pixId,
          user,
          stablecoin,
          stablecoinAmount: stablecoinAmount.toString(),
          fee: ethers.formatEther(fee),
          transactionHash: event.transactionHash
        });

        window.dispatchEvent(new CustomEvent('stablecoinTransferred', {
          detail: {
            pixId,
            user,
            stablecoin,
            stablecoinAmount: stablecoinAmount.toString(),
            fee: ethers.formatEther(fee),
            transactionHash: event.transactionHash
          }
        }));
      });

      // Stablecoin para PIX iniciado
      this.contract.on('StablecoinToPixInitiated', (user, stablecoin, stablecoinAmount, expectedPixAmount, pixKey, nonce, event) => {
        console.log('Stablecoin para PIX iniciado:', {
          user,
          stablecoin,
          stablecoinAmount: stablecoinAmount.toString(),
          expectedPixAmount: ethers.formatEther(expectedPixAmount),
          pixKey,
          nonce: nonce.toString(),
          transactionHash: event.transactionHash
        });

        window.dispatchEvent(new CustomEvent('stablecoinToPixInitiated', {
          detail: {
            user,
            stablecoin,
            stablecoinAmount: stablecoinAmount.toString(),
            expectedPixAmount: ethers.formatEther(expectedPixAmount),
            pixKey,
            nonce: nonce.toString(),
            transactionHash: event.transactionHash
          }
        }));
      });

      console.log('Event listeners configurados');
    } catch (error) {
      console.error('Erro ao configurar event listeners:', error);
    }
  }

  /**
   * Remover listeners de eventos
   */
  removeEventListeners() {
    try {
      if (this.contract) {
        this.contract.removeAllListeners();
      }
      console.log('Event listeners removidos');
    } catch (error) {
      console.error('Erro ao remover event listeners:', error);
    }
  }

  /**
   * Desconectar
   */
  async disconnect() {
    try {
      this.removeEventListeners();
      this.signer = null;
      this.contract = null;
      this.walletClient = null;
      console.log('PixStablecoinService desconectado');
    } catch (error) {
      console.error('Erro ao desconectar:', error);
    }
  }
}

// Exportar instância singleton
export default new PixStablecoinService(); 