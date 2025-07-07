import axios from 'axios';

// Configuração base da API PIX do Banco Central
const PIX_API_BASE_URL = 'https://api.bacen.gov.br/pix/v1';

// Configuração do axios para PIX
const pixApiClient = axios.create({
  baseURL: PIX_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
pixApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pix_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
pixApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API PIX:', error);
    
    if (error.response?.status === 401) {
      // Token expirado, limpar localStorage
      localStorage.removeItem('pix_access_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Serviço de integração com a API PIX do Banco Central
 */
export class PixApiService {
  
  /**
   * Criar uma cobrança PIX
   * @param {Object} chargeData - Dados da cobrança
   * @returns {Promise} Resposta da API
   */
  static async createCharge(chargeData) {
    try {
      const response = await pixApiClient.post('/cob', {
        calendario: {
          expiracao: chargeData.expiration || 3600, // 1 hora por padrão
        },
        devedor: {
          cpf: chargeData.payerCpf,
          nome: chargeData.payerName,
        },
        valor: {
          original: chargeData.amount.toFixed(2),
        },
        chave: chargeData.pixKey,
        solicitacaoPagador: chargeData.description || 'Pagamento PIX para conversão BRLA',
        infoAdicionais: [
          {
            nome: 'Conversão',
            valor: 'PIX para BRLA'
          },
          {
            nome: 'Plataforma',
            valor: 'Super Dapp Base'
          }
        ]
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao criar cobrança PIX: ${error.message}`);
    }
  }

  /**
   * Consultar status de uma cobrança PIX
   * @param {string} txid - ID da transação
   * @returns {Promise} Status da cobrança
   */
  static async getChargeStatus(txid) {
    try {
      const response = await pixApiClient.get(`/cob/${txid}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao consultar status da cobrança: ${error.message}`);
    }
  }

  /**
   * Criar PIX de transferência
   * @param {Object} transferData - Dados da transferência
   * @returns {Promise} Resposta da API
   */
  static async createTransfer(transferData) {
    try {
      const response = await pixApiClient.post('/pix', {
        endToEndId: transferData.endToEndId,
        valor: transferData.amount.toFixed(2),
        chave: transferData.pixKey,
        infoPagador: transferData.payerInfo || 'Conversão BRLA para PIX',
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao criar transferência PIX: ${error.message}`);
    }
  }

  /**
   * Consultar PIX recebidos
   * @param {Object} filters - Filtros de consulta
   * @returns {Promise} Lista de PIX recebidos
   */
  static async getReceivedPixTransactions(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.inicio) params.append('inicio', filters.inicio);
      if (filters.fim) params.append('fim', filters.fim);
      if (filters.cpf) params.append('cpf', filters.cpf);
      if (filters.cnpj) params.append('cnpj', filters.cnpj);
      
      const response = await pixApiClient.get(`/pix?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao consultar PIX recebidos: ${error.message}`);
    }
  }

  /**
   * Validar chave PIX
   * @param {string} pixKey - Chave PIX a ser validada
   * @returns {Promise} Informações da chave
   */
  static async validatePixKey(pixKey) {
    try {
      // Validação básica de formato
      const pixKeyValidation = this.validatePixKeyFormat(pixKey);
      if (!pixKeyValidation.isValid) {
        throw new Error(pixKeyValidation.error);
      }

      // Consultar informações da chave no DICT
      const response = await pixApiClient.get(`/dict/key/${encodeURIComponent(pixKey)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao validar chave PIX: ${error.message}`);
    }
  }

  /**
   * Validar formato da chave PIX
   * @param {string} pixKey - Chave PIX
   * @returns {Object} Resultado da validação
   */
  static validatePixKeyFormat(pixKey) {
    if (!pixKey || typeof pixKey !== 'string') {
      return { isValid: false, error: 'Chave PIX é obrigatória' };
    }

    const cleanKey = pixKey.trim();

    // CPF (11 dígitos)
    if (/^\d{11}$/.test(cleanKey.replace(/\D/g, ''))) {
      return { isValid: true, type: 'CPF' };
    }

    // CNPJ (14 dígitos)
    if (/^\d{14}$/.test(cleanKey.replace(/\D/g, ''))) {
      return { isValid: true, type: 'CNPJ' };
    }

    // Email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanKey)) {
      return { isValid: true, type: 'EMAIL' };
    }

    // Telefone (+5511999999999)
    if (/^\+55\d{10,11}$/.test(cleanKey.replace(/\D/g, '').replace(/^55/, '+55'))) {
      return { isValid: true, type: 'PHONE' };
    }

    // Chave aleatória (UUID)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanKey)) {
      return { isValid: true, type: 'RANDOM' };
    }

    return { isValid: false, error: 'Formato de chave PIX inválido' };
  }

  /**
   * Gerar QR Code para cobrança PIX
   * @param {Object} chargeData - Dados da cobrança
   * @returns {Promise} QR Code da cobrança
   */
  static async generateQRCode(chargeData) {
    try {
      const charge = await this.createCharge(chargeData);
      
      // Gerar payload do QR Code PIX
      const qrCodePayload = this.generatePixQRCodePayload({
        pixKey: chargeData.pixKey,
        merchantName: chargeData.merchantName || 'Super Dapp Base',
        merchantCity: chargeData.merchantCity || 'São Paulo',
        amount: chargeData.amount,
        txid: charge.txid,
        description: chargeData.description
      });

      return {
        qrCode: qrCodePayload,
        txid: charge.txid,
        copyPaste: qrCodePayload
      };
    } catch (error) {
      throw new Error(`Erro ao gerar QR Code: ${error.message}`);
    }
  }

  /**
   * Gerar payload do QR Code PIX
   * @param {Object} data - Dados para o QR Code
   * @returns {string} Payload do QR Code
   */
  static generatePixQRCodePayload(data) {
    // Implementação simplificada do payload PIX
    // Em produção, usar biblioteca específica para gerar payload completo
    const payload = [
      '00020101', // Payload Format Indicator
      '010212', // Point of Initiation Method
      `26${data.pixKey.length.toString().padStart(2, '0')}${data.pixKey}`, // Merchant Account Information
      '52040000', // Merchant Category Code
      '5303986', // Transaction Currency (BRL)
      `54${data.amount.toFixed(2).length.toString().padStart(2, '0')}${data.amount.toFixed(2)}`, // Transaction Amount
      '5802BR', // Country Code
      `59${data.merchantName.length.toString().padStart(2, '0')}${data.merchantName}`, // Merchant Name
      `60${data.merchantCity.length.toString().padStart(2, '0')}${data.merchantCity}`, // Merchant City
      data.txid ? `62${data.txid.length.toString().padStart(2, '0')}${data.txid}` : '', // Additional Data Field
      '6304' // CRC16
    ].join('');

    return payload;
  }

  /**
   * Webhook para receber notificações PIX
   * @param {Object} webhookData - Dados do webhook
   * @returns {Promise} Processamento do webhook
   */
  static async processWebhook(webhookData) {
    try {
      console.log('Processando webhook PIX:', webhookData);
      
      // Verificar se é uma notificação de PIX recebido
      if (webhookData.tipo === 'PIX_RECEBIDO') {
        // Processar conversão para BRLA
        await this.processPixToBrlaConversion(webhookData);
      }
      
      return { status: 'success', message: 'Webhook processado com sucesso' };
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      throw new Error(`Erro ao processar webhook: ${error.message}`);
    }
  }

  /**
   * Processar conversão de PIX para BRLA
   * @param {Object} pixData - Dados do PIX recebido
   * @returns {Promise} Resultado da conversão
   */
  static async processPixToBrlaConversion(pixData) {
    try {
      // Aqui seria implementada a lógica de conversão
      // 1. Validar o PIX recebido
      // 2. Calcular a quantidade de BRLA a ser enviada
      // 3. Executar a transação na blockchain
      // 4. Notificar o usuário
      
      console.log('Processando conversão PIX para BRLA:', pixData);
      
      return {
        success: true,
        pixAmount: pixData.valor,
        brlaAmount: pixData.valor, // 1:1 por simplicidade
        transactionHash: 'mock_transaction_hash'
      };
    } catch (error) {
      throw new Error(`Erro na conversão PIX para BRLA: ${error.message}`);
    }
  }
}

// Exportar instância configurada
export default PixApiService; 