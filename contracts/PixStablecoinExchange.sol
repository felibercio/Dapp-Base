// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title PixStablecoinExchange
 * @dev Contrato para conversão instantânea PIX -> Stablecoins (BRLA, USDC)
 * @author Felipe Bercio
 * @notice Permite que usuários façam PIX e recebam stablecoins instantaneamente
 */
contract PixStablecoinExchange is Ownable, ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;
    using Math for uint256;

    // Roles
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Supported stablecoins
    struct StablecoinInfo {
        IERC20 token;
        uint8 decimals;
        bool isActive;
        uint256 minAmount;
        uint256 maxAmount;
        uint256 dailyLimit;
        uint256 poolBalance;
        uint256 exchangeRate; // Rate in relation to BRL (1e18 = 1:1)
    }

    // PIX transaction structure
    struct PixTransaction {
        string pixId;
        address user;
        uint256 pixAmount; // Amount in BRL (wei format)
        address stablecoin;
        uint256 stablecoinAmount;
        uint256 fee;
        uint256 timestamp;
        TransactionStatus status;
        string pixKey;
        string bankTransactionId;
    }

    enum TransactionStatus {
        INITIATED,
        PIX_CONFIRMED,
        COMPLETED,
        FAILED,
        REFUNDED
    }

    // State variables
    mapping(address => StablecoinInfo) public stablecoins;
    mapping(string => PixTransaction) public pixTransactions;
    mapping(address => mapping(uint256 => uint256)) public dailyVolume; // user -> day -> volume
    mapping(address => uint256) public userNonce;
    
    address[] public supportedStablecoins;
    
    // Configuration
    uint256 public feePercentage = 50; // 0.5% (50/10000)
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public constant MAX_FEE_PERCENTAGE = 1000; // 10%
    
    address public treasury;
    address public feeCollector;
    
    // Events
    event PixToStablecoinInitiated(
        string indexed pixId,
        address indexed user,
        uint256 pixAmount,
        address indexed stablecoin,
        uint256 expectedStablecoinAmount,
        uint256 nonce
    );
    
    event PixConfirmed(
        string indexed pixId,
        address indexed user,
        uint256 pixAmount,
        string bankTransactionId
    );
    
    event StablecoinTransferred(
        string indexed pixId,
        address indexed user,
        address indexed stablecoin,
        uint256 stablecoinAmount,
        uint256 fee
    );
    
    event StablecoinToPixInitiated(
        address indexed user,
        address indexed stablecoin,
        uint256 stablecoinAmount,
        uint256 expectedPixAmount,
        string pixKey,
        uint256 nonce
    );
    
    event StablecoinAdded(
        address indexed stablecoin,
        uint8 decimals,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 dailyLimit
    );
    
    event StablecoinUpdated(
        address indexed stablecoin,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 dailyLimit,
        uint256 exchangeRate
    );
    
    event PoolFunded(
        address indexed stablecoin,
        uint256 amount,
        address indexed funder
    );
    
    event PoolWithdrawn(
        address indexed stablecoin,
        uint256 amount,
        address indexed recipient
    );

    constructor(
        address _treasury,
        address _feeCollector,
        address _initialOwner
    ) Ownable(_initialOwner) {
        require(_treasury != address(0), "Invalid treasury address");
        require(_feeCollector != address(0), "Invalid fee collector address");
        
        treasury = _treasury;
        feeCollector = _feeCollector;
        
        _grantRole(DEFAULT_ADMIN_ROLE, _initialOwner);
        _grantRole(ORACLE_ROLE, _initialOwner);
        _grantRole(OPERATOR_ROLE, _initialOwner);
        _grantRole(PAUSER_ROLE, _initialOwner);
    }

    /**
     * @dev Adicionar nova stablecoin suportada
     */
    function addStablecoin(
        address _token,
        uint8 _decimals,
        uint256 _minAmount,
        uint256 _maxAmount,
        uint256 _dailyLimit,
        uint256 _exchangeRate
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_token != address(0), "Invalid token address");
        require(_maxAmount > _minAmount, "Max amount must be greater than min");
        require(_dailyLimit > _maxAmount, "Daily limit must be greater than max");
        require(_exchangeRate > 0, "Exchange rate must be greater than 0");
        require(!stablecoins[_token].isActive, "Stablecoin already exists");

        stablecoins[_token] = StablecoinInfo({
            token: IERC20(_token),
            decimals: _decimals,
            isActive: true,
            minAmount: _minAmount,
            maxAmount: _maxAmount,
            dailyLimit: _dailyLimit,
            poolBalance: 0,
            exchangeRate: _exchangeRate
        });

        supportedStablecoins.push(_token);

        emit StablecoinAdded(_token, _decimals, _minAmount, _maxAmount, _dailyLimit);
    }

    /**
     * @dev Iniciar conversão PIX para Stablecoin
     */
    function initiatePixToStablecoin(
        string calldata _pixId,
        uint256 _pixAmount,
        address _stablecoin
    ) external nonReentrant whenNotPaused {
        require(bytes(_pixId).length > 0, "PIX ID cannot be empty");
        require(_pixAmount > 0, "PIX amount must be greater than 0");
        require(stablecoins[_stablecoin].isActive, "Stablecoin not supported");
        require(pixTransactions[_pixId].user == address(0), "PIX ID already exists");

        StablecoinInfo storage stablecoinInfo = stablecoins[_stablecoin];
        
        // Verificar limites
        require(_pixAmount >= stablecoinInfo.minAmount, "Amount below minimum");
        require(_pixAmount <= stablecoinInfo.maxAmount, "Amount exceeds maximum");
        
        // Verificar limite diário
        _checkDailyLimit(msg.sender, _pixAmount);
        
        // Calcular quantidade de stablecoin esperada
        uint256 expectedStablecoinAmount = _calculateStablecoinAmount(
            _pixAmount,
            _stablecoin
        );
        
        // Verificar se há liquidez suficiente
        require(
            stablecoinInfo.poolBalance >= expectedStablecoinAmount,
            "Insufficient pool liquidity"
        );

        // Criar transação
        pixTransactions[_pixId] = PixTransaction({
            pixId: _pixId,
            user: msg.sender,
            pixAmount: _pixAmount,
            stablecoin: _stablecoin,
            stablecoinAmount: expectedStablecoinAmount,
            fee: _calculateFee(_pixAmount),
            timestamp: block.timestamp,
            status: TransactionStatus.INITIATED,
            pixKey: "",
            bankTransactionId: ""
        });

        // Incrementar nonce do usuário
        userNonce[msg.sender]++;

        emit PixToStablecoinInitiated(
            _pixId,
            msg.sender,
            _pixAmount,
            _stablecoin,
            expectedStablecoinAmount,
            userNonce[msg.sender]
        );
    }

    /**
     * @dev Confirmar recebimento do PIX (chamado pelo oracle)
     */
    function confirmPixPayment(
        string calldata _pixId,
        string calldata _bankTransactionId,
        string calldata _pixKey
    ) external onlyRole(ORACLE_ROLE) nonReentrant {
        PixTransaction storage transaction = pixTransactions[_pixId];
        require(transaction.user != address(0), "Transaction not found");
        require(
            transaction.status == TransactionStatus.INITIATED,
            "Transaction already processed"
        );

        // Atualizar informações da transação
        transaction.status = TransactionStatus.PIX_CONFIRMED;
        transaction.bankTransactionId = _bankTransactionId;
        transaction.pixKey = _pixKey;

        emit PixConfirmed(_pixId, transaction.user, transaction.pixAmount, _bankTransactionId);

        // Processar transferência de stablecoin automaticamente
        _processStablecoinTransfer(_pixId);
    }

    /**
     * @dev Processar transferência de stablecoin
     */
    function _processStablecoinTransfer(string memory _pixId) internal {
        PixTransaction storage transaction = pixTransactions[_pixId];
        require(
            transaction.status == TransactionStatus.PIX_CONFIRMED,
            "PIX not confirmed"
        );

        StablecoinInfo storage stablecoinInfo = stablecoins[transaction.stablecoin];
        
        // Calcular valores finais
        uint256 fee = transaction.fee;
        uint256 netStablecoinAmount = transaction.stablecoinAmount;
        
        // Verificar liquidez novamente
        require(
            stablecoinInfo.poolBalance >= netStablecoinAmount,
            "Insufficient pool liquidity"
        );

        // Transferir stablecoin para o usuário
        stablecoinInfo.token.safeTransfer(transaction.user, netStablecoinAmount);
        
        // Atualizar saldo do pool
        stablecoinInfo.poolBalance -= netStablecoinAmount;
        
        // Transferir taxa (em stablecoin)
        if (fee > 0) {
            uint256 feeInStablecoin = _calculateStablecoinAmount(fee, transaction.stablecoin);
            if (stablecoinInfo.poolBalance >= feeInStablecoin) {
                stablecoinInfo.token.safeTransfer(feeCollector, feeInStablecoin);
                stablecoinInfo.poolBalance -= feeInStablecoin;
            }
        }

        // Atualizar volume diário
        uint256 currentDay = block.timestamp / 1 days;
        dailyVolume[transaction.user][currentDay] += transaction.pixAmount;

        // Atualizar status
        transaction.status = TransactionStatus.COMPLETED;

        emit StablecoinTransferred(
            _pixId,
            transaction.user,
            transaction.stablecoin,
            netStablecoinAmount,
            fee
        );
    }

    /**
     * @dev Iniciar conversão Stablecoin para PIX
     */
    function initiateStablecoinToPix(
        address _stablecoin,
        uint256 _stablecoinAmount,
        string calldata _pixKey
    ) external nonReentrant whenNotPaused {
        require(stablecoins[_stablecoin].isActive, "Stablecoin not supported");
        require(_stablecoinAmount > 0, "Amount must be greater than 0");
        require(bytes(_pixKey).length > 0, "PIX key cannot be empty");

        StablecoinInfo storage stablecoinInfo = stablecoins[_stablecoin];
        
        // Verificar saldo do usuário
        require(
            stablecoinInfo.token.balanceOf(msg.sender) >= _stablecoinAmount,
            "Insufficient stablecoin balance"
        );

        // Calcular valor PIX esperado
        uint256 expectedPixAmount = _calculatePixAmount(_stablecoinAmount, _stablecoin);
        
        // Verificar limites
        require(expectedPixAmount >= stablecoinInfo.minAmount, "Amount below minimum");
        require(expectedPixAmount <= stablecoinInfo.maxAmount, "Amount exceeds maximum");
        
        // Verificar limite diário
        _checkDailyLimit(msg.sender, expectedPixAmount);

        // Transferir stablecoin para o pool
        stablecoinInfo.token.safeTransferFrom(
            msg.sender,
            address(this),
            _stablecoinAmount
        );
        
        // Atualizar saldo do pool
        stablecoinInfo.poolBalance += _stablecoinAmount;

        // Calcular taxa
        uint256 fee = _calculateFee(expectedPixAmount);
        uint256 netPixAmount = expectedPixAmount - fee;

        // Incrementar nonce do usuário
        userNonce[msg.sender]++;

        // Atualizar volume diário
        uint256 currentDay = block.timestamp / 1 days;
        dailyVolume[msg.sender][currentDay] += expectedPixAmount;

        emit StablecoinToPixInitiated(
            msg.sender,
            _stablecoin,
            _stablecoinAmount,
            netPixAmount,
            _pixKey,
            userNonce[msg.sender]
        );
    }

    /**
     * @dev Calcular quantidade de stablecoin baseada no valor PIX
     */
    function _calculateStablecoinAmount(
        uint256 _pixAmount,
        address _stablecoin
    ) internal view returns (uint256) {
        StablecoinInfo storage stablecoinInfo = stablecoins[_stablecoin];
        
        // Ajustar para decimais da stablecoin
        uint256 amount = (_pixAmount * stablecoinInfo.exchangeRate) / 1e18;
        
        // Ajustar para decimais corretos
        if (stablecoinInfo.decimals != 18) {
            amount = (amount * (10 ** stablecoinInfo.decimals)) / 1e18;
        }
        
        return amount;
    }

    /**
     * @dev Calcular valor PIX baseado na quantidade de stablecoin
     */
    function _calculatePixAmount(
        uint256 _stablecoinAmount,
        address _stablecoin
    ) internal view returns (uint256) {
        StablecoinInfo storage stablecoinInfo = stablecoins[_stablecoin];
        
        // Ajustar para 18 decimais se necessário
        uint256 normalizedAmount = _stablecoinAmount;
        if (stablecoinInfo.decimals != 18) {
            normalizedAmount = (_stablecoinAmount * 1e18) / (10 ** stablecoinInfo.decimals);
        }
        
        // Calcular valor PIX
        return (normalizedAmount * 1e18) / stablecoinInfo.exchangeRate;
    }

    /**
     * @dev Calcular taxa
     */
    function _calculateFee(uint256 _amount) internal view returns (uint256) {
        return (_amount * feePercentage) / FEE_DENOMINATOR;
    }

    /**
     * @dev Verificar limite diário
     */
    function _checkDailyLimit(address _user, uint256 _amount) internal view {
        uint256 currentDay = block.timestamp / 1 days;
        uint256 currentDailyVolume = dailyVolume[_user][currentDay];
        
        // Verificar limite diário baseado na primeira stablecoin ativa
        for (uint256 i = 0; i < supportedStablecoins.length; i++) {
            address stablecoin = supportedStablecoins[i];
            if (stablecoins[stablecoin].isActive) {
                require(
                    currentDailyVolume + _amount <= stablecoins[stablecoin].dailyLimit,
                    "Daily limit exceeded"
                );
                break;
            }
        }
    }

    /**
     * @dev Financiar pool de stablecoin
     */
    function fundPool(
        address _stablecoin,
        uint256 _amount
    ) external onlyRole(OPERATOR_ROLE) {
        require(stablecoins[_stablecoin].isActive, "Stablecoin not supported");
        require(_amount > 0, "Amount must be greater than 0");

        StablecoinInfo storage stablecoinInfo = stablecoins[_stablecoin];
        
        stablecoinInfo.token.safeTransferFrom(msg.sender, address(this), _amount);
        stablecoinInfo.poolBalance += _amount;

        emit PoolFunded(_stablecoin, _amount, msg.sender);
    }

    /**
     * @dev Retirar do pool de stablecoin
     */
    function withdrawFromPool(
        address _stablecoin,
        uint256 _amount,
        address _recipient
    ) external onlyRole(OPERATOR_ROLE) {
        require(stablecoins[_stablecoin].isActive, "Stablecoin not supported");
        require(_amount > 0, "Amount must be greater than 0");
        require(_recipient != address(0), "Invalid recipient");

        StablecoinInfo storage stablecoinInfo = stablecoins[_stablecoin];
        require(stablecoinInfo.poolBalance >= _amount, "Insufficient pool balance");

        stablecoinInfo.token.safeTransfer(_recipient, _amount);
        stablecoinInfo.poolBalance -= _amount;

        emit PoolWithdrawn(_stablecoin, _amount, _recipient);
    }

    // Funções administrativas
    function updateStablecoin(
        address _stablecoin,
        uint256 _minAmount,
        uint256 _maxAmount,
        uint256 _dailyLimit,
        uint256 _exchangeRate
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(stablecoins[_stablecoin].isActive, "Stablecoin not supported");
        require(_maxAmount > _minAmount, "Max amount must be greater than min");
        require(_dailyLimit > _maxAmount, "Daily limit must be greater than max");
        require(_exchangeRate > 0, "Exchange rate must be greater than 0");

        StablecoinInfo storage stablecoinInfo = stablecoins[_stablecoin];
        stablecoinInfo.minAmount = _minAmount;
        stablecoinInfo.maxAmount = _maxAmount;
        stablecoinInfo.dailyLimit = _dailyLimit;
        stablecoinInfo.exchangeRate = _exchangeRate;

        emit StablecoinUpdated(_stablecoin, _minAmount, _maxAmount, _dailyLimit, _exchangeRate);
    }

    function updateFeePercentage(uint256 _feePercentage) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_feePercentage <= MAX_FEE_PERCENTAGE, "Fee percentage too high");
        feePercentage = _feePercentage;
    }

    function updateAddresses(
        address _treasury,
        address _feeCollector
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_treasury != address(0), "Invalid treasury address");
        require(_feeCollector != address(0), "Invalid fee collector address");
        
        treasury = _treasury;
        feeCollector = _feeCollector;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // Funções de visualização
    function getStablecoinInfo(address _stablecoin) external view returns (StablecoinInfo memory) {
        return stablecoins[_stablecoin];
    }

    function getPixTransaction(string calldata _pixId) external view returns (PixTransaction memory) {
        return pixTransactions[_pixId];
    }

    function getUserDailyVolume(address _user) external view returns (uint256) {
        uint256 currentDay = block.timestamp / 1 days;
        return dailyVolume[_user][currentDay];
    }

    function calculateStablecoinAmount(
        uint256 _pixAmount,
        address _stablecoin
    ) external view returns (uint256) {
        return _calculateStablecoinAmount(_pixAmount, _stablecoin);
    }

    function calculatePixAmount(
        uint256 _stablecoinAmount,
        address _stablecoin
    ) external view returns (uint256) {
        return _calculatePixAmount(_stablecoinAmount, _stablecoin);
    }

    function calculateFee(uint256 _amount) external view returns (uint256) {
        return _calculateFee(_amount);
    }

    function getSupportedStablecoins() external view returns (address[] memory) {
        return supportedStablecoins;
    }

    function getPoolBalance(address _stablecoin) external view returns (uint256) {
        return stablecoins[_stablecoin].poolBalance;
    }
} 