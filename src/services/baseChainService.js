import { ethers } from 'ethers';
import { createPublicClient, createWalletClient, custom, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

// Configuração da rede Base
const BASE_CHAIN_CONFIG = {
  chainId: 8453,
  name: 'Base',
  currency: 'ETH',
  explorerUrl: 'https://basescan.org',
  rpcUrl: 'https://mainnet.base.org',
};

// Endereço do contrato BRLA na Base (exemplo)
const BRLA_CONTRACT_ADDRESS = '0x...'; // Substituir pelo endereço real do contrato BRLA

// ABI simplificada do contrato BRLA
const BRLA_ABI = [
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

/**
 * Serviço para interagir com a blockchain Base
 */
export class BaseChainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.brlaContract = null;
    this.publicClient = null;
    this.walletClient = null;
  }

  /**
   * Inicializar conexão com a rede Base
   */
  async initialize() {
    try {
      // Verificar se o MetaMask está disponível
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask não está instalado');
      }

      // Configurar provider (ethers v6)
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Configurar cliente público (viem)
      this.publicClient = createPublicClient({
        chain: base,
        transport: custom(window.ethereum)
      });

      // Verificar se está conectado à rede Base
      const network = await this.provider.getNetwork();
      if (Number(network.chainId) !== BASE_CHAIN_CONFIG.chainId) {
        await this.switchToBaseNetwork();
      }

      console.log('Conectado à rede Base com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao inicializar conexão com Base:', error);
      throw error;
    }
  }

  /**
   * Conectar wallet
   */
  async connectWallet() {
    try {
      if (!window.ethereum) {
        throw new Error('Wallet não encontrada');
      }

      // Solicitar conexão
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('Nenhuma conta disponível');
      }

      // Configurar signer (ethers v6)
      this.signer = await this.provider.getSigner();
      
      // Configurar cliente da wallet (viem)
      this.walletClient = createWalletClient({
        chain: base,
        transport: custom(window.ethereum)
      });

      // Configurar contrato BRLA
      this.brlaContract = new ethers.Contract(
        BRLA_CONTRACT_ADDRESS,
        BRLA_ABI,
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
   * Trocar para a rede Base
   */
  async switchToBaseNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_CHAIN_CONFIG.chainId.toString(16)}` }]
      });
    } catch (error) {
      // Se a rede não existe, adicionar
      if (error.code === 4902) {
        await this.addBaseNetwork();
      } else {
        throw error;
      }
    }
  }

  /**
   * Adicionar rede Base ao MetaMask
   */
  async addBaseNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${BASE_CHAIN_CONFIG.chainId.toString(16)}`,
          chainName: BASE_CHAIN_CONFIG.name,
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: [BASE_CHAIN_CONFIG.rpcUrl],
          blockExplorerUrls: [BASE_CHAIN_CONFIG.explorerUrl]
        }]
      });
    } catch (error) {
      console.error('Erro ao adicionar rede Base:', error);
      throw error;
    }
  }

  /**
   * Obter saldo de BRLA
   */
  async getBrlaBalance(address) {
    try {
      if (!this.brlaContract) {
        throw new Error('Contrato BRLA não inicializado');
      }

      const balance = await this.brlaContract.balanceOf(address);
      const decimals = await this.brlaContract.decimals();
      
      return {
        raw: balance.toString(),
        formatted: ethers.formatUnits(balance, decimals),
        decimals
      };
    } catch (error) {
      console.error('Erro ao obter saldo BRLA:', error);
      throw error;
    }
  }

  /**
   * Transferir BRLA
   */
  async transferBrla(toAddress, amount) {
    try {
      if (!this.brlaContract || !this.signer) {
        throw new Error('Contrato ou signer não inicializado');
      }

      // Obter decimais do token
      const decimals = await this.brlaContract.decimals();
      
      // Converter amount para a unidade correta
      const amountInWei = ethers.parseUnits(amount.toString(), decimals);

      // Executar transferência
      const tx = await this.brlaContract.transfer(toAddress, amountInWei);
      
      console.log('Transação enviada:', tx.hash);
      
      // Aguardar confirmação
      const receipt = await tx.wait();
      
      console.log('Transação confirmada:', receipt.hash);
      
      return {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'success' : 'failed'
      };
    } catch (error) {
      console.error('Erro ao transferir BRLA:', error);
      throw error;
    }
  }

  /**
   * Processar conversão PIX para BRLA
   */
  async processPixToBrlaConversion(pixData) {
    try {
      const { amount, userAddress } = pixData;
      
      // Validar dados
      if (!amount || !userAddress) {
        throw new Error('Dados insuficientes para conversão');
      }

      // Verificar se o usuário tem uma wallet conectada
      if (!this.signer) {
        throw new Error('Wallet não conectada');
      }

      // Calcular quantidade de BRLA (1:1 por simplicidade)
      const brlaAmount = amount;

      // Obter endereço do treasury/pool para enviar BRLA
      const treasuryAddress = await this.getTreasuryAddress();

      // Executar transferência de BRLA do treasury para o usuário
      const transferResult = await this.transferBrla(userAddress, brlaAmount);

      // Registrar transação
      await this.recordTransaction({
        type: 'PIX_TO_BRLA',
        pixAmount: amount,
        brlaAmount,
        userAddress,
        transactionHash: transferResult.hash,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        brlaAmount,
        transactionHash: transferResult.hash,
        explorerUrl: `${BASE_CHAIN_CONFIG.explorerUrl}/tx/${transferResult.hash}`
      };
    } catch (error) {
      console.error('Erro na conversão PIX para BRLA:', error);
      throw error;
    }
  }

  /**
   * Processar conversão BRLA para PIX
   */
  async processBrlaToPixConversion(brlaData) {
    try {
      const { amount, pixKey, userAddress } = brlaData;
      
      // Validar dados
      if (!amount || !pixKey || !userAddress) {
        throw new Error('Dados insuficientes para conversão');
      }

      // Verificar saldo do usuário
      const balance = await this.getBrlaBalance(userAddress);
      const userBalance = parseFloat(balance.formatted);

      if (userBalance < amount) {
        throw new Error('Saldo insuficiente de BRLA');
      }

      // Obter endereço do treasury para receber BRLA
      const treasuryAddress = await this.getTreasuryAddress();

      // Executar transferência de BRLA do usuário para o treasury
      const transferResult = await this.transferBrla(treasuryAddress, amount);

      // Registrar transação
      await this.recordTransaction({
        type: 'BRLA_TO_PIX',
        brlaAmount: amount,
        pixAmount: amount, // 1:1 por simplicidade
        pixKey,
        userAddress,
        transactionHash: transferResult.hash,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        pixAmount: amount,
        transactionHash: transferResult.hash,
        explorerUrl: `${BASE_CHAIN_CONFIG.explorerUrl}/tx/${transferResult.hash}`
      };
    } catch (error) {
      console.error('Erro na conversão BRLA para PIX:', error);
      throw error;
    }
  }

  /**
   * Obter endereço do treasury
   */
  async getTreasuryAddress() {
    // Em produção, isso seria configurado via contrato ou variável de ambiente
    return '0x...'; // Substituir pelo endereço real do treasury
  }

  /**
   * Registrar transação no localStorage (em produção seria um banco de dados)
   */
  async recordTransaction(transactionData) {
    try {
      const transactions = JSON.parse(localStorage.getItem('dapp_transactions') || '[]');
      transactions.push({
        id: Date.now().toString(),
        ...transactionData
      });
      localStorage.setItem('dapp_transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Erro ao registrar transação:', error);
    }
  }

  /**
   * Obter histórico de transações
   */
  async getTransactionHistory(userAddress) {
    try {
      const transactions = JSON.parse(localStorage.getItem('dapp_transactions') || '[]');
      return transactions.filter(tx => tx.userAddress === userAddress);
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      return [];
    }
  }

  /**
   * Monitorar eventos do contrato BRLA
   */
  async setupEventListeners() {
    try {
      if (!this.brlaContract) {
        throw new Error('Contrato não inicializado');
      }

      // Escutar eventos de transferência
      this.brlaContract.on('Transfer', (from, to, value, event) => {
        console.log('Evento Transfer detectado:', {
          from,
          to,
          value: ethers.utils.formatEther(value),
          transactionHash: event.transactionHash
        });

        // Emitir evento personalizado para a aplicação
        window.dispatchEvent(new CustomEvent('brlaTransfer', {
          detail: { from, to, value, transactionHash: event.transactionHash }
        }));
      });

      console.log('Event listeners configurados');
    } catch (error) {
      console.error('Erro ao configurar event listeners:', error);
    }
  }

  /**
   * Desconectar wallet
   */
  async disconnectWallet() {
    try {
      this.signer = null;
      this.brlaContract = null;
      this.walletClient = null;
      
      // Remover event listeners
      if (this.brlaContract) {
        this.brlaContract.removeAllListeners();
      }
      
      console.log('Wallet desconectada');
      return true;
    } catch (error) {
      console.error('Erro ao desconectar wallet:', error);
      throw error;
    }
  }

  /**
   * Obter informações da rede
   */
  async getNetworkInfo() {
    try {
      if (!this.provider) {
        throw new Error('Provider não inicializado');
      }

      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getGasPrice();

      return {
        chainId: network.chainId,
        name: network.name,
        blockNumber,
        gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei')
      };
    } catch (error) {
      console.error('Erro ao obter informações da rede:', error);
      throw error;
    }
  }
}

// Exportar instância singleton
export default new BaseChainService(); 