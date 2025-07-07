/**
 * Utilitários de validação para PIX e valores monetários
 */

/**
 * Validar CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - True se válido
 */
export const validateCPF = (cpf) => {
  if (!cpf) return false;
  
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  // Valida dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

/**
 * Validar CNPJ
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean} - True se válido
 */
export const validateCNPJ = (cnpj) => {
  if (!cnpj) return false;
  
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  // Valida primeiro dígito verificador
  let sum = 0;
  let weight = 2;
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (firstDigit !== parseInt(cleanCNPJ.charAt(12))) return false;
  
  // Valida segundo dígito verificador
  sum = 0;
  weight = 2;
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (secondDigit !== parseInt(cleanCNPJ.charAt(13))) return false;
  
  return true;
};

/**
 * Validar email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - True se válido
 */
export const validateEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar telefone brasileiro
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} - True se válido
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Verifica se tem 10 ou 11 dígitos (sem código do país)
  if (cleanPhone.length === 10 || cleanPhone.length === 11) {
    // Verifica se começa com código de área válido
    const areaCode = cleanPhone.substring(0, 2);
    const validAreaCodes = [
      '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
      '21', '22', '24', // RJ
      '27', '28', // ES
      '31', '32', '33', '34', '35', '37', '38', // MG
      '41', '42', '43', '44', '45', '46', // PR
      '47', '48', '49', // SC
      '51', '53', '54', '55', // RS
      '61', // DF
      '62', '64', // GO
      '63', // TO
      '65', '66', // MT
      '67', // MS
      '68', // AC
      '69', // RO
      '71', '73', '74', '75', '77', // BA
      '79', // SE
      '81', '87', // PE
      '82', // AL
      '83', // PB
      '84', // RN
      '85', '88', // CE
      '86', '89', // PI
      '91', '93', '94', // PA
      '92', '97', // AM
      '95', // RR
      '96', // AP
      '98', '99' // MA
    ];
    
    return validAreaCodes.includes(areaCode);
  }
  
  // Verifica se tem 13 dígitos (com código do país +55)
  if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
    const phoneWithoutCountry = cleanPhone.substring(2);
    return validatePhone(phoneWithoutCountry);
  }
  
  return false;
};

/**
 * Validar chave PIX aleatória (UUID)
 * @param {string} key - Chave aleatória a ser validada
 * @returns {boolean} - True se válido
 */
export const validateRandomPixKey = (key) => {
  if (!key) return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(key);
};

/**
 * Validar chave PIX (todos os tipos)
 * @param {string} pixKey - Chave PIX a ser validada
 * @returns {Object} - Resultado da validação
 */
export const validatePixKey = (pixKey) => {
  if (!pixKey || typeof pixKey !== 'string') {
    return { isValid: false, error: 'Chave PIX é obrigatória', type: null };
  }

  const cleanKey = pixKey.trim();

  // CPF
  if (validateCPF(cleanKey)) {
    return { isValid: true, type: 'CPF', formatted: formatCPF(cleanKey) };
  }

  // CNPJ
  if (validateCNPJ(cleanKey)) {
    return { isValid: true, type: 'CNPJ', formatted: formatCNPJ(cleanKey) };
  }

  // Email
  if (validateEmail(cleanKey)) {
    return { isValid: true, type: 'EMAIL', formatted: cleanKey.toLowerCase() };
  }

  // Telefone
  if (validatePhone(cleanKey)) {
    return { isValid: true, type: 'PHONE', formatted: formatPhone(cleanKey) };
  }

  // Chave aleatória
  if (validateRandomPixKey(cleanKey)) {
    return { isValid: true, type: 'RANDOM', formatted: cleanKey.toLowerCase() };
  }

  return { isValid: false, error: 'Formato de chave PIX inválido', type: null };
};

/**
 * Validar valor monetário
 * @param {string|number} value - Valor a ser validado
 * @param {Object} options - Opções de validação
 * @returns {Object} - Resultado da validação
 */
export const validateMonetaryValue = (value, options = {}) => {
  const { min = 0.01, max = 1000000, allowZero = false } = options;
  
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: 'Valor é obrigatório' };
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Valor deve ser um número válido' };
  }
  
  if (!allowZero && numValue <= 0) {
    return { isValid: false, error: 'Valor deve ser maior que zero' };
  }
  
  if (numValue < min) {
    return { isValid: false, error: `Valor mínimo é ${formatCurrency(min)}` };
  }
  
  if (numValue > max) {
    return { isValid: false, error: `Valor máximo é ${formatCurrency(max)}` };
  }
  
  return { isValid: true, value: numValue };
};

/**
 * Formatadores
 */

/**
 * Formatar CPF
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} - CPF formatado
 */
export const formatCPF = (cpf) => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formatar CNPJ
 * @param {string} cnpj - CNPJ a ser formatado
 * @returns {string} - CNPJ formatado
 */
export const formatCNPJ = (cnpj) => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Formatar telefone
 * @param {string} phone - Telefone a ser formatado
 * @returns {string} - Telefone formatado
 */
export const formatPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Formatar valor monetário
 * @param {number} value - Valor a ser formatado
 * @param {string} currency - Moeda (BRL por padrão)
 * @returns {string} - Valor formatado
 */
export const formatCurrency = (value, currency = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(value);
};

/**
 * Formatar número com separadores de milhares
 * @param {number} value - Valor a ser formatado
 * @param {number} decimals - Número de casas decimais
 * @returns {string} - Número formatado
 */
export const formatNumber = (value, decimals = 2) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Limpar caracteres não numéricos
 * @param {string} value - Valor a ser limpo
 * @returns {string} - Valor limpo
 */
export const cleanNumericValue = (value) => {
  return value.replace(/\D/g, '');
};

/**
 * Aplicar máscara de CPF
 * @param {string} value - Valor a ser mascarado
 * @returns {string} - Valor com máscara
 */
export const applyCPFMask = (value) => {
  const cleanValue = cleanNumericValue(value);
  
  if (cleanValue.length <= 3) return cleanValue;
  if (cleanValue.length <= 6) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`;
  if (cleanValue.length <= 9) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6)}`;
  
  return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`;
};

/**
 * Aplicar máscara de telefone
 * @param {string} value - Valor a ser mascarado
 * @returns {string} - Valor com máscara
 */
export const applyPhoneMask = (value) => {
  const cleanValue = cleanNumericValue(value);
  
  if (cleanValue.length <= 2) return cleanValue;
  if (cleanValue.length <= 6) return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
  if (cleanValue.length <= 10) return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 6)}-${cleanValue.slice(6)}`;
  
  return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
};

export default {
  validateCPF,
  validateCNPJ,
  validateEmail,
  validatePhone,
  validateRandomPixKey,
  validatePixKey,
  validateMonetaryValue,
  formatCPF,
  formatCNPJ,
  formatPhone,
  formatCurrency,
  formatNumber,
  cleanNumericValue,
  applyCPFMask,
  applyPhoneMask
}; 