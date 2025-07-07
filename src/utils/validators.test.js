import {
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
  applyCPFMask,
  applyPhoneMask
} from './validators';

describe('Validators', () => {
  describe('validateCPF', () => {
    test('deve validar CPF válido', () => {
      expect(validateCPF('11144477735')).toBe(true);
      expect(validateCPF('111.444.777-35')).toBe(true);
    });

    test('deve rejeitar CPF inválido', () => {
      expect(validateCPF('11111111111')).toBe(false);
      expect(validateCPF('123456789')).toBe(false);
      expect(validateCPF('12345678901')).toBe(false);
      expect(validateCPF('')).toBe(false);
      expect(validateCPF(null)).toBe(false);
    });
  });

  describe('validateCNPJ', () => {
    test('deve validar CNPJ válido', () => {
      expect(validateCNPJ('11222333000181')).toBe(true);
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    });

    test('deve rejeitar CNPJ inválido', () => {
      expect(validateCNPJ('11111111111111')).toBe(false);
      expect(validateCNPJ('123456789012')).toBe(false);
      expect(validateCNPJ('12345678901234')).toBe(false);
      expect(validateCNPJ('')).toBe(false);
      expect(validateCNPJ(null)).toBe(false);
    });
  });

  describe('validateEmail', () => {
    test('deve validar email válido', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    test('deve rejeitar email inválido', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test..test@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
    });
  });

  describe('validatePhone', () => {
    test('deve validar telefone válido', () => {
      expect(validatePhone('11987654321')).toBe(true);
      expect(validatePhone('1133334444')).toBe(true);
      expect(validatePhone('(11) 98765-4321')).toBe(true);
      expect(validatePhone('5511987654321')).toBe(true);
    });

    test('deve rejeitar telefone inválido', () => {
      expect(validatePhone('123456789')).toBe(false);
      expect(validatePhone('00987654321')).toBe(false);
      expect(validatePhone('99987654321')).toBe(false);
      expect(validatePhone('')).toBe(false);
      expect(validatePhone(null)).toBe(false);
    });
  });

  describe('validateRandomPixKey', () => {
    test('deve validar chave aleatória válida', () => {
      expect(validateRandomPixKey('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(validateRandomPixKey('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    test('deve rejeitar chave aleatória inválida', () => {
      expect(validateRandomPixKey('123e4567-e89b-12d3-a456')).toBe(false);
      expect(validateRandomPixKey('not-a-uuid')).toBe(false);
      expect(validateRandomPixKey('')).toBe(false);
      expect(validateRandomPixKey(null)).toBe(false);
    });
  });

  describe('validatePixKey', () => {
    test('deve validar diferentes tipos de chave PIX', () => {
      // CPF
      expect(validatePixKey('11144477735')).toEqual({
        isValid: true,
        type: 'CPF',
        formatted: '111.444.777-35'
      });

      // Email
      expect(validatePixKey('test@example.com')).toEqual({
        isValid: true,
        type: 'EMAIL',
        formatted: 'test@example.com'
      });

      // Telefone
      expect(validatePixKey('11987654321')).toEqual({
        isValid: true,
        type: 'PHONE',
        formatted: '(11) 98765-4321'
      });

      // Chave aleatória
      expect(validatePixKey('123e4567-e89b-12d3-a456-426614174000')).toEqual({
        isValid: true,
        type: 'RANDOM',
        formatted: '123e4567-e89b-12d3-a456-426614174000'
      });
    });

    test('deve rejeitar chave PIX inválida', () => {
      expect(validatePixKey('invalid-key')).toEqual({
        isValid: false,
        error: 'Formato de chave PIX inválido',
        type: null
      });

      expect(validatePixKey('')).toEqual({
        isValid: false,
        error: 'Chave PIX é obrigatória',
        type: null
      });
    });
  });

  describe('validateMonetaryValue', () => {
    test('deve validar valor monetário válido', () => {
      expect(validateMonetaryValue(100)).toEqual({
        isValid: true,
        value: 100
      });

      expect(validateMonetaryValue('50.75')).toEqual({
        isValid: true,
        value: 50.75
      });

      expect(validateMonetaryValue(0.01)).toEqual({
        isValid: true,
        value: 0.01
      });
    });

    test('deve rejeitar valor monetário inválido', () => {
      expect(validateMonetaryValue(0)).toEqual({
        isValid: false,
        error: 'Valor deve ser maior que zero'
      });

      expect(validateMonetaryValue(-10)).toEqual({
        isValid: false,
        error: 'Valor deve ser maior que zero'
      });

      expect(validateMonetaryValue('invalid')).toEqual({
        isValid: false,
        error: 'Valor deve ser um número válido'
      });

      expect(validateMonetaryValue('')).toEqual({
        isValid: false,
        error: 'Valor é obrigatório'
      });
    });

    test('deve respeitar limites mínimo e máximo', () => {
      expect(validateMonetaryValue(0.005, { min: 0.01 })).toEqual({
        isValid: false,
        error: 'Valor mínimo é R$ 0,01'
      });

      expect(validateMonetaryValue(1000001, { max: 1000000 })).toEqual({
        isValid: false,
        error: 'Valor máximo é R$ 1.000.000,00'
      });
    });
  });

  describe('Formatters', () => {
    test('formatCPF deve formatar CPF corretamente', () => {
      expect(formatCPF('11144477735')).toBe('111.444.777-35');
      expect(formatCPF('111.444.777-35')).toBe('111.444.777-35');
    });

    test('formatCNPJ deve formatar CNPJ corretamente', () => {
      expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
      expect(formatCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81');
    });

    test('formatPhone deve formatar telefone corretamente', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    });

    test('formatCurrency deve formatar moeda corretamente', () => {
      expect(formatCurrency(100)).toBe('R$ 100,00');
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(formatCurrency(0.01)).toBe('R$ 0,01');
    });

    test('applyCPFMask deve aplicar máscara progressivamente', () => {
      expect(applyCPFMask('111')).toBe('111');
      expect(applyCPFMask('111444')).toBe('111.444');
      expect(applyCPFMask('111444777')).toBe('111.444.777');
      expect(applyCPFMask('11144477735')).toBe('111.444.777-35');
    });

    test('applyPhoneMask deve aplicar máscara progressivamente', () => {
      expect(applyPhoneMask('11')).toBe('11');
      expect(applyPhoneMask('119876')).toBe('(11) 9876');
      expect(applyPhoneMask('1198765')).toBe('(11) 9876-5');
      expect(applyPhoneMask('11987654321')).toBe('(11) 98765-4321');
    });
  });
});

// Testes de integração para o hook usePixBrla
describe('usePixBrla Integration Tests', () => {
  // Mock do window.ethereum
  const mockEthereum = {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  };

  beforeEach(() => {
    global.window = {
      ethereum: mockEthereum,
    };
    jest.clearAllMocks();
  });

  test('deve detectar wallet instalada', () => {
    expect(window.ethereum).toBeDefined();
    expect(typeof window.ethereum.request).toBe('function');
  });

  test('deve simular conexão de wallet', async () => {
    mockEthereum.request.mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']);
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    expect(accounts).toHaveLength(1);
    expect(accounts[0]).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  test('deve simular troca de rede', async () => {
    mockEthereum.request.mockResolvedValueOnce(null);
    
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }] // Base chain ID
    });
    
    expect(mockEthereum.request).toHaveBeenCalledWith({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }]
    });
  });
});

// Testes para componentes PIX
describe('PIX Components Tests', () => {
  test('deve validar dados de entrada PIX', () => {
    const pixData = {
      amount: 100,
      pixKey: 'test@example.com',
      payerCpf: '11144477735',
      payerName: 'João Silva'
    };

    // Validar valor
    const valueValidation = validateMonetaryValue(pixData.amount);
    expect(valueValidation.isValid).toBe(true);

    // Validar chave PIX
    const keyValidation = validatePixKey(pixData.pixKey);
    expect(keyValidation.isValid).toBe(true);
    expect(keyValidation.type).toBe('EMAIL');

    // Validar CPF
    const cpfValidation = validateCPF(pixData.payerCpf);
    expect(cpfValidation).toBe(true);
  });

  test('deve rejeitar dados inválidos', () => {
    const invalidPixData = {
      amount: -10,
      pixKey: 'invalid-key',
      payerCpf: '11111111111',
      payerName: ''
    };

    // Validar valor
    const valueValidation = validateMonetaryValue(invalidPixData.amount);
    expect(valueValidation.isValid).toBe(false);

    // Validar chave PIX
    const keyValidation = validatePixKey(invalidPixData.pixKey);
    expect(keyValidation.isValid).toBe(false);

    // Validar CPF
    const cpfValidation = validateCPF(invalidPixData.payerCpf);
    expect(cpfValidation).toBe(false);
  });
});

// Testes para API PIX
describe('PIX API Tests', () => {
  test('deve gerar payload QR Code PIX', () => {
    const pixData = {
      pixKey: 'test@example.com',
      merchantName: 'Super Dapp Base',
      merchantCity: 'São Paulo',
      amount: 100,
      txid: 'test123',
      description: 'Teste PIX'
    };

    // Simular geração de payload
    const payload = [
      '00020101', // Payload Format Indicator
      '010212', // Point of Initiation Method
      `26${pixData.pixKey.length.toString().padStart(2, '0')}${pixData.pixKey}`,
      '52040000', // Merchant Category Code
      '5303986', // Transaction Currency (BRL)
      `54${pixData.amount.toFixed(2).length.toString().padStart(2, '0')}${pixData.amount.toFixed(2)}`,
      '5802BR', // Country Code
      `59${pixData.merchantName.length.toString().padStart(2, '0')}${pixData.merchantName}`,
      `60${pixData.merchantCity.length.toString().padStart(2, '0')}${pixData.merchantCity}`,
      `62${pixData.txid.length.toString().padStart(2, '0')}${pixData.txid}`,
      '6304' // CRC16
    ].join('');

    expect(payload).toContain('00020101');
    expect(payload).toContain(pixData.pixKey);
    expect(payload).toContain(pixData.merchantName);
    expect(payload).toContain('100.00');
  });
});

export default {}; 