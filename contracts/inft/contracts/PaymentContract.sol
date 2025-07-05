// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PaymentContract
 * @dev A contract for receiving payments with messages for AI influencer services
 */
contract PaymentContract is ReentrancyGuard, Ownable {

    // Events
    event PaymentReceived(
        uint256 indexed paymentId,
        address indexed from,
        address indexed to,
        uint256 amount,
        string message,
        uint256 timestamp
    );

    event PaymentWithdrawn(
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );

    event ServiceFeeUpdated(
        uint256 oldFee,
        uint256 newFee,
        uint256 timestamp
    );

    // Structs
    struct Payment {
        uint256 paymentId;
        address from;
        address to;
        uint256 amount;
        string message;
        uint256 timestamp;
        bool exists;
    }

    // State variables
    uint256 private _paymentIds = 0;
    uint256 public serviceFee = 250; // 2.5% (250 basis points)
    uint256 public minPaymentAmount = 0; // No minimum payment amount
    uint256 public maxPaymentAmount = 10 ether;

    // Mappings
    mapping(uint256 => Payment) public payments;
    mapping(address => uint256[]) public userPayments;
    mapping(address => uint256) public totalReceived;

    // Modifiers
    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= maxPaymentAmount, "Amount too high");
        _;
    }

    modifier validMessage(string memory message) {
        require(bytes(message).length > 0, "Message cannot be empty");
        require(bytes(message).length <= 500, "Message too long");
        _;
    }

    // Constructor
    constructor() Ownable(msg.sender) {
        _paymentIds = 1; // Start from 1
    }

    /**
     * @dev Receive payment with a message
     * @param message The message to store with the payment
     */
    function sendPayment(string memory message) 
        external 
        payable 
        nonReentrant 
        validAmount(msg.value)
        validMessage(message)
    {
        require(msg.sender != address(0), "Invalid sender");

        uint256 paymentId = _paymentIds;
        uint256 feeAmount = (msg.value * serviceFee) / 10000;
        uint256 netAmount = msg.value - feeAmount;

        // Create payment record
        Payment memory newPayment = Payment({
            paymentId: paymentId,
            from: msg.sender,
            to: owner(),
            amount: netAmount,
            message: message,
            timestamp: block.timestamp,
            exists: true
        });

        // Store payment
        payments[paymentId] = newPayment;
        userPayments[msg.sender].push(paymentId);
        totalReceived[owner()] += netAmount;

        // Emit event
        emit PaymentReceived(
            paymentId,
            msg.sender,
            owner(),
            netAmount,
            message,
            block.timestamp
        );

        _paymentIds++;
    }

    /**
     * @dev Send payment to a specific address
     * @param recipient The address to receive the payment
     * @param message The message to store with the payment
     */
    function sendPaymentTo(address recipient, string memory message) 
        external 
        payable 
        nonReentrant 
        validAmount(msg.value)
        validMessage(message)
    {
        require(msg.sender != address(0), "Invalid sender");
        require(recipient != address(0), "Invalid recipient");
        require(msg.sender != recipient, "Cannot send to self");

        uint256 paymentId = _paymentIds;
        uint256 feeAmount = (msg.value * serviceFee) / 10000;
        uint256 netAmount = msg.value - feeAmount;

        // Create payment record
        Payment memory newPayment = Payment({
            paymentId: paymentId,
            from: msg.sender,
            to: recipient,
            amount: netAmount,
            message: message,
            timestamp: block.timestamp,
            exists: true
        });

        // Store payment
        payments[paymentId] = newPayment;
        userPayments[msg.sender].push(paymentId);
        totalReceived[recipient] += netAmount;

        // Transfer amount to recipient
        (bool success, ) = recipient.call{value: netAmount}("");
        require(success, "Transfer failed");

        // Emit event
        emit PaymentReceived(
            paymentId,
            msg.sender,
            recipient,
            netAmount,
            message,
            block.timestamp
        );

        _paymentIds++;
    }

    /**
     * @dev Withdraw accumulated fees (owner only)
     */
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");

        emit PaymentWithdrawn(owner(), balance, block.timestamp);
    }

    /**
     * @dev Update service fee (owner only)
     * @param newFee New fee in basis points (e.g., 250 = 2.5%)
     */
    function updateServiceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        
        uint256 oldFee = serviceFee;
        serviceFee = newFee;

        emit ServiceFeeUpdated(oldFee, newFee, block.timestamp);
    }

    /**
     * @dev Update payment limits (owner only)
     * @param newMin New minimum payment amount
     * @param newMax New maximum payment amount
     */
    function updatePaymentLimits(uint256 newMin, uint256 newMax) external onlyOwner {
        require(newMin < newMax, "Min must be less than max");
        require(newMax <= 100 ether, "Max cannot exceed 100 ETH");
        
        minPaymentAmount = newMin;
        maxPaymentAmount = newMax;
    }

    /**
     * @dev Get payment by ID
     * @param paymentId The payment ID to retrieve
     * @return Payment struct
     */
    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        require(payments[paymentId].exists, "Payment does not exist");
        return payments[paymentId];
    }

    /**
     * @dev Get all payments for a user
     * @param user The user address
     * @return Array of payment IDs
     */
    function getUserPayments(address user) external view returns (uint256[] memory) {
        return userPayments[user];
    }

    /**
     * @dev Get total received by an address
     * @param recipient The recipient address
     * @return Total amount received
     */
    function getTotalReceived(address recipient) external view returns (uint256) {
        return totalReceived[recipient];
    }

    /**
     * @dev Get contract statistics
     * @return totalPayments Total number of payments
     * @return totalVolume Total volume processed
     * @return currentBalance Current contract balance
     */
    function getContractStats() external view returns (
        uint256 totalPayments,
        uint256 totalVolume,
        uint256 currentBalance
    ) {
        totalPayments = _paymentIds - 1; // Subtract 1 because we start from 1
        totalVolume = address(this).balance + totalReceived[owner()];
        currentBalance = address(this).balance;
    }

    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        revert("Use sendPayment() function");
    }

    /**
     * @dev Fallback function
     */
    fallback() external payable {
        revert("Use sendPayment() function");
    }
} 