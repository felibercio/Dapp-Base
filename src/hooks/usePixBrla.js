import { useState, useEffect, useCallback } from 'react';
import PixApiService from '../services/pixApi';
import BaseChainService from '../services/baseChainService';

/**
 * Hook personalizado para gerenciar transações PIX/BRLA
 */
export const usePixBrla = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [brlaBalance, setBrlaBalance] = useState('0');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  // Verificar conexão da wallet ao carregar
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Verificar se a wallet está conectada
  const checkWalletConnection = useCallback(async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
          await loadBrlaBalance(accounts[0]);
          await loadTransactionHistory(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar conexão da wallet:', error);
    }
  }, []);

  // Conectar wallet
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      // Inicializar serviço da Base
      await BaseChainService.initialize();
      
      // Conectar wallet
      const result = await BaseChainService.connectWallet();
      
      setWalletConnected(result.isConnected);
      setWalletAddress(result.address);
      
      // Carregar saldo e histórico
      await loadBrlaBalance(result.address);
      await loadTransactionHistory(result.address);
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Desconectar wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await BaseChainService.disconnectWallet();
      setWalletConnected(false);
      setWalletAddress('');
      setBrlaBalance('0');
      setTransactions([]);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Carregar saldo de BRLA
  const loadBrlaBalance = useCallback(async (address) => {
    try {
      const balance = await BaseChainService.getBrlaBalance(address);
      setBrlaBalance(balance.formatted);
    } catch (error) {
      console.error('Erro ao carregar saldo BRLA:', error);
    }
  }, []);

  // Carregar histórico de transações
  const loadTransactionHistory = useCallback(async (address) => {
    try {
      const history = await BaseChainService.getTransactionHistory(address);
      setTransactions(history);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  }, []);

  // Processar PIX para BRLA
  const processPixToBrla = useCallback(async (pixData) => {
    if (!walletConnected) {
      throw new Error('Wallet não conectada');
    }

    setIsLoading(true);
    setError('');

    try {
      // Validar dados
      if (!pixData.amount || pixData.amount <= 0) {
        throw new Error('Valor inválido');
      }

      // Criar cobrança PIX
      const charge = await PixApiService.createCharge({
        amount: pixData.amount,
        pixKey: pixData.pixKey || 'chave-pix-do-dapp',
        payerCpf: pixData.payerCpf,
        payerName: pixData.payerName,
        description: `Conversão PIX para BRLA - R$ ${pixData.amount}`,
        expiration: 1800 // 30 minutos
      });

      // Gerar QR Code
      const qrCode = await PixApiService.generateQRCode({
        amount: pixData.amount,
        pixKey: pixData.pixKey || 'chave-pix-do-dapp',
        merchantName: 'Super Dapp Base',
        merchantCity: 'São Paulo',
        description: `Conversão PIX para BRLA - R$ ${pixData.amount}`,
        txid: charge.txid
      });

      // Retornar dados para exibição
      return {
        success: true,
        charge,
        qrCode,
        message: 'Cobrança PIX criada com sucesso'
      };

    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletConnected]);

  // Processar BRLA para PIX
  const processBrlaToPixConversion = useCallback(async (conversionData) => {
    if (!walletConnected) {
      throw new Error('Wallet não conectada');
    }

    setIsLoading(true);
    setError('');

    try {
      // Validar dados
      if (!conversionData.amount || conversionData.amount <= 0) {
        throw new Error('Valor inválido');
      }

      if (!conversionData.pixKey) {
        throw new Error('Chave PIX é obrigatória');
      }

      // Validar chave PIX
      const pixKeyValidation = PixApiService.validatePixKeyFormat(conversionData.pixKey);
      if (!pixKeyValidation.isValid) {
        throw new Error(pixKeyValidation.error);
      }

      // Verificar saldo
      const currentBalance = parseFloat(brlaBalance);
      if (currentBalance < conversionData.amount) {
        throw new Error('Saldo insuficiente de BRLA');
      }

      // Processar conversão na blockchain
      const blockchainResult = await BaseChainService.processBrlaToPixConversion({
        amount: conversionData.amount,
        pixKey: conversionData.pixKey,
        userAddress: walletAddress
      });

      // Criar transferência PIX
      const pixTransfer = await PixApiService.createTransfer({
        endToEndId: `E${Date.now()}`,
        amount: conversionData.amount,
        pixKey: conversionData.pixKey,
        payerInfo: 'Conversão BRLA para PIX - Super Dapp Base'
      });

      // Atualizar saldo e histórico
      await loadBrlaBalance(walletAddress);
      await loadTransactionHistory(walletAddress);

      return {
        success: true,
        pixTransfer,
        blockchainResult,
        message: 'Conversão BRLA para PIX realizada com sucesso'
      };

    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletConnected, walletAddress, brlaBalance, loadBrlaBalance, loadTransactionHistory]);

  // Confirmar recebimento de PIX (webhook simulation)
  const confirmPixReceived = useCallback(async (pixData) => {
    if (!walletConnected) {
      throw new Error('Wallet não conectada');
    }

    setIsLoading(true);
    setError('');

    try {
      // Processar conversão PIX para BRLA na blockchain
      const result = await BaseChainService.processPixToBrlaConversion({
        amount: pixData.amount,
        userAddress: walletAddress,
        pixTransactionId: pixData.transactionId
      });

      // Atualizar saldo e histórico
      await loadBrlaBalance(walletAddress);
      await loadTransactionHistory(walletAddress);

      return {
        success: true,
        result,
        message: 'PIX convertido para BRLA com sucesso'
      };

    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletConnected, walletAddress, loadBrlaBalance, loadTransactionHistory]);

  // Obter status de uma transação PIX
  const getPixTransactionStatus = useCallback(async (txid) => {
    try {
      const status = await PixApiService.getChargeStatus(txid);
      return status;
    } catch (error) {
      console.error('Erro ao obter status da transação:', error);
      throw error;
    }
  }, []);

  // Validar chave PIX
  const validatePixKey = useCallback(async (pixKey) => {
    try {
      const validation = PixApiService.validatePixKeyFormat(pixKey);
      if (!validation.isValid) {
        return validation;
      }

      // Validar chave no DICT (opcional)
      try {
        const dictInfo = await PixApiService.validatePixKey(pixKey);
        return {
          isValid: true,
          type: validation.type,
          dictInfo
        };
      } catch (error) {
        // Se não conseguir validar no DICT, retornar validação básica
        return validation;
      }
    } catch (error) {
      return {
        isValid: false,
        error: error.message
      };
    }
  }, []);

  // Obter informações da rede
  const getNetworkInfo = useCallback(async () => {
    try {
      return await BaseChainService.getNetworkInfo();
    } catch (error) {
      console.error('Erro ao obter informações da rede:', error);
      throw error;
    }
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    // Estado
    isLoading,
    walletConnected,
    walletAddress,
    brlaBalance,
    transactions,
    error,
    
    // Ações
    connectWallet,
    disconnectWallet,
    processPixToBrla,
    processBrlaToPixConversion,
    confirmPixReceived,
    getPixTransactionStatus,
    validatePixKey,
    getNetworkInfo,
    loadBrlaBalance,
    loadTransactionHistory,
    clearError
  };
};

export default usePixBrla; 