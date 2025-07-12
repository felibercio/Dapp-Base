// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title PixOracle
 * @dev Oracle para validação de pagamentos PIX
 * @author Felipe Bercio
 */
contract PixOracle is Ownable, ReentrancyGuard, AccessControl {
    bytes32 public constant REPORTER_ROLE = keccak256("REPORTER_ROLE");

    struct PixPayment {
        uint256 amount;          // Valor em wei (BRL * 10^18)
        address recipient;       // Endereço do destinatário na blockchain
        bool confirmed;          // Status de confirmação
        uint256 timestamp;       // Timestamp da confirmação
        string pixKey;          // Chave PIX utilizada
        string bankTransactionId; // ID da transação no banco
    }

    // Mapeamentos
    mapping(string => PixPayment) public pixPayments;
    mapping(string => bool) public processedTransactions;

    // Eventos
    event PixPaymentReported(
        string indexed pixId,
        uint256 amount,
        address indexed recipient,
        string pixKey,
        string bankTransactionId
    );

    event PixPaymentConfirmed(
        string indexed pixId,
        uint256 amount,
        address indexed recipient
    );

    event ReporterAdded(address indexed reporter);
    event ReporterRemoved(address indexed reporter);

    constructor(address initialOwner) Ownable(initialOwner) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(REPORTER_ROLE, initialOwner);
    }

    /**
     * @dev Reportar pagamento PIX recebido
     * @param pixId ID único da transação PIX
     * @param amount Valor em wei (BRL * 10^18)
     * @param recipient Endereço do destinatário
     * @param pixKey Chave PIX utilizada
     * @param bankTransactionId ID da transação no banco
     */
    function reportPixPayment(
        string calldata pixId,
        uint256 amount,
        address recipient,
        string calldata pixKey,
        string calldata bankTransactionId
    ) external onlyRole(REPORTER_ROLE) nonReentrant {
        require(bytes(pixId).length > 0, "PIX ID cannot be empty");
        require(amount > 0, "Amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient address");
        require(!processedTransactions[pixId], "Transaction already processed");

        // Registrar pagamento
        pixPayments[pixId] = PixPayment({
            amount: amount,
            recipient: recipient,
            confirmed: false,
            timestamp: block.timestamp,
            pixKey: pixKey,
            bankTransactionId: bankTransactionId
        });

        processedTransactions[pixId] = true;

        emit PixPaymentReported(pixId, amount, recipient, pixKey, bankTransactionId);
    }

    /**
     * @dev Confirmar pagamento PIX
     * @param pixId ID da transação PIX
     */
    function confirmPixPayment(string calldata pixId) 
        external 
        onlyRole(REPORTER_ROLE) 
        nonReentrant 
        returns (bool) 
    {
        require(bytes(pixId).length > 0, "PIX ID cannot be empty");
        require(processedTransactions[pixId], "Transaction not reported");
        require(!pixPayments[pixId].confirmed, "Payment already confirmed");

        pixPayments[pixId].confirmed = true;

        emit PixPaymentConfirmed(
            pixId, 
            pixPayments[pixId].amount, 
            pixPayments[pixId].recipient
        );

        return true;
    }

    /**
     * @dev Verificar se pagamento foi confirmado
     */
    function isPixPaymentConfirmed(string calldata pixId) 
        external 
        view 
        returns (bool) 
    {
        return pixPayments[pixId].confirmed;
    }

    /**
     * @dev Obter informações do pagamento
     */
    function getPixPaymentInfo(string calldata pixId) 
        external 
        view 
        returns (
            uint256 amount,
            address recipient,
            bool confirmed,
            uint256 timestamp,
            string memory pixKey,
            string memory bankTransactionId
        ) 
    {
        PixPayment memory payment = pixPayments[pixId];
        return (
            payment.amount,
            payment.recipient,
            payment.confirmed,
            payment.timestamp,
            payment.pixKey,
            payment.bankTransactionId
        );
    }

    /**
     * @dev Adicionar reporter
     */
    function addReporter(address reporter) external onlyOwner {
        require(reporter != address(0), "Invalid reporter address");
        grantRole(REPORTER_ROLE, reporter);
        emit ReporterAdded(reporter);
    }

    /**
     * @dev Remover reporter
     */
    function removeReporter(address reporter) external onlyOwner {
        revokeRole(REPORTER_ROLE, reporter);
        emit ReporterRemoved(reporter);
    }

    /**
     * @dev Verificar se endereço é reporter
     */
    function isReporter(address account) external view returns (bool) {
        return hasRole(REPORTER_ROLE, account);
    }
} 