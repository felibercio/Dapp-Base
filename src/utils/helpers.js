/**
 * Utilitários e helpers para a aplicação
 */

import { DEFAULT_VALUES } from '../config/constants';

/**
 * Formatar valor monetário para exibição
 * @param {number} value - Valor a ser formatado
 * @param {string} currency - Moeda (BRL, USD, etc.)
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value, currency = 'BRL') => {
  if (!value && value !== 0) return '-';
  
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(value);
};

/**
 * Formatar número com separadores de milhares
 * @param {number} value - Valor a ser formatado
 * @param {number} decimals - Número de casas decimais
 * @returns {string} Número formatado
 */
export const formatNumber = (value, decimals = 2) => {
  if (!value && value !== 0) return '-';
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Formatar data para exibição
 * @param {string|Date} date - Data a ser formatada
 * @param {boolean} includeTime - Se deve incluir horário
 * @returns {string} Data formatada
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return '-';
  
  const dateObj = new Date(date);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }
  
  return dateObj.toLocaleString('pt-BR', options);
};

/**
 * Truncar endereço de wallet para exibição
 * @param {string} address - Endereço da wallet
 * @param {number} startChars - Caracteres do início
 * @param {number} endChars - Caracteres do final
 * @returns {string} Endereço truncado
 */
export const truncateAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Gerar ID único para transações
 * @returns {string} ID único
 */
export const generateTransactionId = () => {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validar se valor está dentro dos limites
 * @param {number} value - Valor a ser validado
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} Se é válido
 */
export const isValueInRange = (value, min, max) => {
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue >= min && numValue <= max;
};

/**
 * Validar valor PIX
 * @param {number} value - Valor PIX
 * @returns {boolean} Se é válido
 */
export const isValidPixAmount = (value) => {
  return isValueInRange(value, DEFAULT_VALUES.minPixAmount, DEFAULT_VALUES.maxPixAmount);
};

/**
 * Validar valor BRLA
 * @param {number} value - Valor BRLA
 * @returns {boolean} Se é válido
 */
export const isValidBrlaAmount = (value) => {
  return isValueInRange(value, DEFAULT_VALUES.minBrlaAmount, DEFAULT_VALUES.maxBrlaAmount);
};

/**
 * Calcular taxa de conversão
 * @param {number} amount - Valor base
 * @param {number} feePercentage - Porcentagem da taxa
 * @returns {object} Valor com taxa e valor final
 */
export const calculateFee = (amount, feePercentage) => {
  const fee = amount * feePercentage;
  const finalAmount = amount - fee;
  
  return {
    originalAmount: amount,
    fee,
    finalAmount,
    feePercentage
  };
};

/**
 * Debounce para otimizar chamadas de função
 * @param {Function} func - Função a ser chamada
 * @param {number} delay - Delay em ms
 * @returns {Function} Função com debounce
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Copiar texto para clipboard
 * @param {string} text - Texto a ser copiado
 * @returns {Promise<boolean>} Se foi copiado com sucesso
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erro ao copiar para clipboard:', error);
    return false;
  }
};

/**
 * Detectar se é mobile
 * @returns {boolean} Se é mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Gerar QR Code payload para PIX
 * @param {object} pixData - Dados do PIX
 * @returns {string} Payload do QR Code
 */
export const generatePixQRCodePayload = (pixData) => {
  const { amount, pixKey, merchantName, merchantCity, description } = pixData;
  
  // Formato básico do PIX QR Code (EMV)
  const payload = [
    '00020101', // Payload Format Indicator
    '0014BR.GOV.BCB.PIX', // Merchant Account Information
    `26${pixKey.length.toString().padStart(2, '0')}${pixKey}`, // PIX Key
    `52040000`, // Merchant Category Code
    `5303986`, // Transaction Currency (BRL)
    `54${amount.toFixed(2).length.toString().padStart(2, '0')}${amount.toFixed(2)}`, // Transaction Amount
    `5802BR`, // Country Code
    `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`, // Merchant Name
    `60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}`, // Merchant City
    description ? `62${description.length.toString().padStart(2, '0')}${description}` : '', // Additional Data
    '6304' // CRC placeholder
  ].join('');
  
  // Calcular CRC16
  const crc = calculateCRC16(payload);
  
  return payload + crc;
};

/**
 * Calcular CRC16 para PIX QR Code
 * @param {string} data - Dados para calcular CRC
 * @returns {string} CRC16 calculado
 */
const calculateCRC16 = (data) => {
  const polynomial = 0x1021;
  let crc = 0xFFFF;
  
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
    }
  }
  
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
};

/**
 * Aguardar um determinado tempo
 * @param {number} ms - Tempo em millisegundos
 * @returns {Promise} Promise que resolve após o tempo
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry de função com backoff exponencial
 * @param {Function} fn - Função a ser executada
 * @param {number} maxRetries - Número máximo de tentativas
 * @param {number} baseDelay - Delay base em ms
 * @returns {Promise} Resultado da função
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      await sleep(delay);
    }
  }
  
  throw lastError;
};

/**
 * Validar se URL é válida
 * @param {string} url - URL a ser validada
 * @returns {boolean} Se é válida
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Obter parâmetros da URL
 * @returns {object} Parâmetros da URL
 */
export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
};

/**
 * Gerar cor aleatória em hexadecimal
 * @returns {string} Cor em hexadecimal
 */
export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

/**
 * Converter timestamp para tempo relativo
 * @param {number} timestamp - Timestamp em ms
 * @returns {string} Tempo relativo
 */
export const getRelativeTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  if (diff < minute) return 'agora';
  if (diff < hour) return `${Math.floor(diff / minute)}m atrás`;
  if (diff < day) return `${Math.floor(diff / hour)}h atrás`;
  if (diff < week) return `${Math.floor(diff / day)}d atrás`;
  if (diff < month) return `${Math.floor(diff / week)}sem atrás`;
  if (diff < year) return `${Math.floor(diff / month)}mês atrás`;
  
  return `${Math.floor(diff / year)}ano atrás`;
};

export default {
  formatCurrency,
  formatNumber,
  formatDate,
  truncateAddress,
  generateTransactionId,
  isValueInRange,
  isValidPixAmount,
  isValidBrlaAmount,
  calculateFee,
  debounce,
  copyToClipboard,
  isMobile,
  generatePixQRCodePayload,
  sleep,
  retryWithBackoff,
  isValidUrl,
  getUrlParams,
  generateRandomColor,
  getRelativeTime
}; 