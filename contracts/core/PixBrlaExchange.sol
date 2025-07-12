// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../tokens/BRLAToken.sol";
import "../oracles/PixOracle.sol";

/**
 * @title PixBrlaExchange
 * @dev Contrato principal para conversão PIX <-> BRLA
 * @author Felipe Bercio
 */
contract PixBrlaExchange is Ownable, ReentrancyGuard, Pausable {

    // Interfaces
    BRLAToken public immutable brlaToken;
    PixOracle public pixOracle;

    // Configurações
    uint256 public constant CONVERSION_RATE = 1e18; // 1 PIX = 1 BRLA (1:1)
    uint256 public feePercentage = 50; // 0.5% (50/10000)
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Limites
    uint256 public minPixAmount = 1e18; // 1 BRL mínimo
    uint256 public maxPixAmount = 10000e18; // 10.000 BRL máximo
    uint256 public dailyLimit = 50000e18; // 50.000 BRL por dia

    // Endereços importantes
    address public treasury;
    address public feeCollector;

    // Controle de limites diários
    mapping(address => uint256) public dailyPixTobrlaVolume;
    mapping(address => uint256) public dailyBrlaToPixVolume;
    mapping(address => uint256) public lastTransactionDay;

    // Controle de transações
    mapping(string => bool) public processedPixIds;
    mapping(address => uint256) public userNonce;

    // Eventos
    event PixToBrlaInitiated(
        string indexed pixId,
        address indexed user,
        uint256 pixAmount,
        uint256 expectedBrlaAmount,
        uint256 nonce
    );

    event PixToBrlaCompleted(
        string indexed pixId,
        address indexed user,
        uint256 pixAmount,
        uint256 brlaAmount,
        uint256 fee
    );

    event BrlaToPixInitiated(
        address indexed user,
        uint256 brlaAmount,
        uint256 expectedPixAmount,
        string pixKey,
        uint256 nonce
    );

    event BrlaToPixCompleted(
        address indexed user,
        uint256 brlaAmount,
        uint256 pixAmount,
        uint256 fee,
        string pixKey
    );

    event ConfigurationUpdated(
        uint256 feePercentage,
        uint256 minPixAmount,
        uint256 maxPixAmount,
        uint256 dailyLimit
    );

    event AddressesUpdated(
        address treasury,
        address feeCollector,
        address pixOracle
    );

    constructor(
        address _brlaToken,
        address _pixOracle,
        address _treasury,
        address _feeCollector,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_brlaToken != address(0), "Invalid BRLA token address");
        require(_pixOracle != address(0), "Invalid PIX oracle address");
        require(_treasury != address(0), "Invalid treasury address");
        require(_feeCollector != address(0), "Invalid fee collector address");

        brlaToken = BRLAToken(_brlaToken);
        pixOracle = PixOracle(_pixOracle);
        treasury = _treasury;
        feeCollector = _feeCollector;
    }

    /**
     * @dev Iniciar conversão PIX para BRLA
     * @param pixId ID único da transação PIX
     * @param expectedAmount Valor esperado em PIX
     */
    function initiatePixToBrla(
        string calldata pixId,
        uint256 expectedAmount
    ) external nonReentrant whenNotPaused {
        require(bytes(pixId).length > 0, "PIX ID cannot be empty");
        require(!processedPixIds[pixId], "PIX ID already processed");
        require(expectedAmount >= minPixAmount, "Amount below minimum");
        require(expectedAmount <= maxPixAmount, "Amount exceeds maximum");

        // Verificar limite diário
        _checkDailyLimit(msg.sender, expectedAmount, true);

        // Marcar como processado
        processedPixIds[pixId] = true;

        // Incrementar nonce do usuário
        userNonce[msg.sender]++;

        // Calcular BRLA esperado
        uint256 expectedBrlaAmount = (expectedAmount * CONVERSION_RATE) / 1e18;

        emit PixToBrlaInitiated(
            pixId,
            msg.sender,
            expectedAmount,
            expectedBrlaAmount,
            userNonce[msg.sender]
        );
    }

    /**
     * @dev Completar conversão PIX para BRLA (chamado pelo oracle)
     * @param pixId ID da transação PIX
     */
    function completePixToBrla(string calldata pixId) external nonReentrant {
        require(
            pixOracle.isReporter(msg.sender),
            "Only authorized reporters can complete"
        );
        require(
            pixOracle.isPixPaymentConfirmed(pixId),
            "PIX payment not confirmed"
        );

        // Obter informações do pagamento
        (
            uint256 pixAmount,
            address recipient,
            bool confirmed,
            ,
            ,
        ) = pixOracle.getPixPaymentInfo(pixId);

        require(confirmed, "Payment not confirmed");
        require(pixAmount > 0, "Invalid PIX amount");
        require(recipient != address(0), "Invalid recipient");

        // Calcular valores
        uint256 fee = (pixAmount * feePercentage) / FEE_DENOMINATOR;
        uint256 netAmount = pixAmount - fee;
        uint256 brlaAmount = (netAmount * CONVERSION_RATE) / 1e18;

        // Mint BRLA para o usuário
        brlaToken.mint(recipient, brlaAmount);

        // Mint taxa para o collector
        if (fee > 0) {
            uint256 feeInBrla = (fee * CONVERSION_RATE) / 1e18;
            brlaToken.mint(feeCollector, feeInBrla);
        }

        emit PixToBrlaCompleted(pixId, recipient, pixAmount, brlaAmount, fee);
    }

    /**
     * @dev Iniciar conversão BRLA para PIX
     * @param brlaAmount Quantidade de BRLA a ser convertida
     * @param pixKey Chave PIX de destino
     */
    function initiateBrlaToPixConversion(
        uint256 brlaAmount,
        string calldata pixKey
    ) external nonReentrant whenNotPaused {
        require(brlaAmount > 0, "Amount must be greater than 0");
        require(bytes(pixKey).length > 0, "PIX key cannot be empty");
        require(
            brlaToken.balanceOf(msg.sender) >= brlaAmount,
            "Insufficient BRLA balance"
        );

        // Converter para valor PIX
        uint256 pixAmount = (brlaAmount * 1e18) / CONVERSION_RATE;
        require(pixAmount >= minPixAmount, "Amount below minimum");
        require(pixAmount <= maxPixAmount, "Amount exceeds maximum");

        // Verificar limite diário
        _checkDailyLimit(msg.sender, pixAmount, false);

        // Calcular taxa
        uint256 fee = (pixAmount * feePercentage) / FEE_DENOMINATOR;
        uint256 netPixAmount = pixAmount - fee;

        // Burn BRLA do usuário
        brlaToken.burnFrom(msg.sender, brlaAmount);

        // Mint taxa para o collector
        if (fee > 0) {
            uint256 feeInBrla = (fee * CONVERSION_RATE) / 1e18;
            brlaToken.mint(feeCollector, feeInBrla);
        }

        // Incrementar nonce do usuário
        userNonce[msg.sender]++;

        emit BrlaToPixInitiated(
            msg.sender,
            brlaAmount,
            netPixAmount,
            pixKey,
            userNonce[msg.sender]
        );

        emit BrlaToPixCompleted(
            msg.sender,
            brlaAmount,
            netPixAmount,
            fee,
            pixKey
        );
    }

    /**
     * @dev Verificar limite diário
     */
    function _checkDailyLimit(address user, uint256 amount, bool isPixToBrla) internal {
        uint256 currentDay = block.timestamp / 1 days;

        if (lastTransactionDay[user] != currentDay) {
            dailyPixTobrlaVolume[user] = 0;
            dailyBrlaToPixVolume[user] = 0;
            lastTransactionDay[user] = currentDay;
        }

        if (isPixToBrla) {
            require(
                dailyPixTobrlaVolume[user] + amount <= dailyLimit,
                "Daily PIX to BRLA limit exceeded"
            );
            dailyPixTobrlaVolume[user] += amount;
        } else {
            require(
                dailyBrlaToPixVolume[user] + amount <= dailyLimit,
                "Daily BRLA to PIX limit exceeded"
            );
            dailyBrlaToPixVolume[user] += amount;
        }
    }

    // Funções administrativas
    function updateConfiguration(
        uint256 _feePercentage,
        uint256 _minPixAmount,
        uint256 _maxPixAmount,
        uint256 _dailyLimit
    ) external onlyOwner {
        require(_feePercentage <= 1000, "Fee cannot exceed 10%");
        require(_minPixAmount > 0, "Min amount must be greater than 0");
        require(_maxPixAmount > _minPixAmount, "Max amount must be greater than min");
        require(_dailyLimit > _maxPixAmount, "Daily limit must be greater than max amount");

        feePercentage = _feePercentage;
        minPixAmount = _minPixAmount;
        maxPixAmount = _maxPixAmount;
        dailyLimit = _dailyLimit;

        emit ConfigurationUpdated(_feePercentage, _minPixAmount, _maxPixAmount, _dailyLimit);
    }

    function updateAddresses(
        address _treasury,
        address _feeCollector,
        address _pixOracle
    ) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury address");
        require(_feeCollector != address(0), "Invalid fee collector address");
        require(_pixOracle != address(0), "Invalid PIX oracle address");

        treasury = _treasury;
        feeCollector = _feeCollector;
        pixOracle = PixOracle(_pixOracle);

        emit AddressesUpdated(_treasury, _feeCollector, _pixOracle);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Funções de visualização
    function getUserDailyLimits(address user) external view returns (
        uint256 pixToBrlaUsed,
        uint256 brlaToPixUsed,
        uint256 remainingLimit
    ) {
        uint256 currentDay = block.timestamp / 1 days;

        if (lastTransactionDay[user] == currentDay) {
            pixToBrlaUsed = dailyPixTobrlaVolume[user];
            brlaToPixUsed = dailyBrlaToPixVolume[user];
        } else {
            pixToBrlaUsed = 0;
            brlaToPixUsed = 0;
        }

        uint256 totalUsed = pixToBrlaUsed + brlaToPixUsed;
        remainingLimit = totalUsed >= dailyLimit ? 0 : dailyLimit - totalUsed;
    }

    function calculateFee(uint256 amount) external view returns (uint256) {
        return (amount * feePercentage) / FEE_DENOMINATOR;
    }

    function getConversionRate() external pure returns (uint256) {
        return CONVERSION_RATE;
    }

    function getUserNonce(address user) external view returns (uint256) {
        return userNonce[user];
    }
} 