# PaymentContract

A smart contract for receiving payments with messages, designed specifically for AI influencer services. The contract allows users to send payments with custom messages, automatically calculates and deducts service fees, and stores all payment data on-chain.

## Features

### Core Functionality
- **Payment with Messages**: Send payments with custom messages (up to 500 characters)
- **Automatic Fee Calculation**: Configurable service fee (default 2.5%)
- **Payment Limits**: Configurable minimum and maximum payment amounts
- **Event Emission**: Comprehensive events for payment tracking
- **Data Storage**: All payment data stored on-chain for transparency

### Security Features
- **Reentrancy Protection**: Prevents reentrancy attacks
- **Ownable Access Control**: Only owner can update fees and withdraw
- **Input Validation**: Validates amounts, messages, and addresses
- **Emergency Withdrawal**: Owner can withdraw funds in emergencies

### Management Features
- **Fee Management**: Owner can update service fee (max 10%)
- **Payment Limits**: Owner can adjust min/max payment amounts
- **Statistics**: Get contract statistics and user payment history
- **Fee Withdrawal**: Owner can withdraw accumulated fees

## Contract Functions

### Public Functions

#### `sendPayment(string memory message)`
Send payment to the contract owner with a message.
- **Parameters**: `message` - Custom message (1-500 characters)
- **Value**: ETH amount to send
- **Events**: `PaymentReceived`

#### `sendPaymentTo(address recipient, string memory message)`
Send payment to a specific address with a message.
- **Parameters**: 
  - `recipient` - Address to receive the payment
  - `message` - Custom message (1-500 characters)
- **Value**: ETH amount to send
- **Events**: `PaymentReceived`

#### `getPayment(uint256 paymentId)`
Get payment details by ID.
- **Parameters**: `paymentId` - Payment ID
- **Returns**: Payment struct with all details

#### `getUserPayments(address user)`
Get all payment IDs for a specific user.
- **Parameters**: `user` - User address
- **Returns**: Array of payment IDs

#### `getTotalReceived(address recipient)`
Get total amount received by an address.
- **Parameters**: `recipient` - Recipient address
- **Returns**: Total amount received

#### `getContractStats()`
Get contract statistics.
- **Returns**: Total payments, total volume, current balance

### Owner Functions

#### `withdrawFees()`
Withdraw accumulated service fees.
- **Events**: `PaymentWithdrawn`

#### `updateServiceFee(uint256 newFee)`
Update the service fee percentage.
- **Parameters**: `newFee` - New fee in basis points (max 1000 = 10%)
- **Events**: `ServiceFeeUpdated`

#### `updatePaymentLimits(uint256 newMin, uint256 newMax)`
Update payment amount limits.
- **Parameters**: 
  - `newMin` - New minimum payment amount
  - `newMax` - New maximum payment amount (max 100 ETH)

#### `emergencyWithdraw()`
Emergency withdrawal of all contract funds.

## Events

### `PaymentReceived`
Emitted when a payment is received.
```solidity
event PaymentReceived(
    uint256 indexed paymentId,
    address indexed from,
    address indexed to,
    uint256 amount,
    string message,
    uint256 timestamp
);
```

### `PaymentWithdrawn`
Emitted when fees are withdrawn.
```solidity
event PaymentWithdrawn(
    address indexed owner,
    uint256 amount,
    uint256 timestamp
);
```

### `ServiceFeeUpdated`
Emitted when service fee is updated.
```solidity
event ServiceFeeUpdated(
    uint256 oldFee,
    uint256 newFee,
    uint256 timestamp
);
```

## Data Structures

### Payment Struct
```solidity
struct Payment {
    uint256 paymentId;
    address from;
    address to;
    uint256 amount;
    string message;
    uint256 timestamp;
    bool exists;
}
```

## Initial Configuration

- **Service Fee**: 250 basis points (2.5%)
- **Minimum Payment**: 0.001 ETH
- **Maximum Payment**: 10 ETH
- **Owner**: Contract deployer

## Usage Examples

### Basic Payment
```javascript
// Send 0.1 ETH with a message
await paymentContract.sendPayment("Thanks for the AI content!", {
    value: ethers.parseEther("0.1")
});
```

### Payment to Specific Address
```javascript
// Send 0.05 ETH to a specific address
await paymentContract.sendPaymentTo(recipientAddress, "Custom video payment", {
    value: ethers.parseEther("0.05")
});
```

### Get Payment Details
```javascript
// Get payment by ID
const payment = await paymentContract.getPayment(1);
console.log("From:", payment.from);
console.log("Amount:", ethers.formatEther(payment.amount));
console.log("Message:", payment.message);
```

### Update Service Fee (Owner Only)
```javascript
// Update fee to 3%
await paymentContract.updateServiceFee(300);
```

### Withdraw Fees (Owner Only)
```javascript
// Withdraw accumulated fees
await paymentContract.withdrawFees();
```

## Integration with AI Influencer Platform

The PaymentContract is designed to integrate seamlessly with the AI influencer platform:

### 1. Content Monetization
- Users can pay for custom AI-generated content
- Payments are tied to specific content requests via messages
- Automatic fee collection for platform revenue

### 2. Creator Payments
- Direct payments to content creators
- Transparent payment history on-chain
- Automated fee distribution

### 3. Subscription Services
- Recurring payments for premium content
- Message-based payment categorization
- Flexible payment amounts

### 4. Analytics and Tracking
- Complete payment history on-chain
- User payment patterns
- Revenue analytics

## Testing

Run the comprehensive test suite:
```bash
npx hardhat test test/PaymentContract.test.js
```

Run the demo script:
```bash
npx hardhat run scripts/demo-payment.js --network 0g-testnet
```

## Deployment

Deploy using Hardhat Ignition:
```bash
npx hardhat ignition deploy ignition/modules/PaymentContract.ts --network 0g-testnet
```

## Security Considerations

1. **Reentrancy Protection**: All state-changing functions are protected
2. **Access Control**: Only owner can update critical parameters
3. **Input Validation**: All inputs are validated before processing
4. **Fee Limits**: Service fee cannot exceed 10%
5. **Payment Limits**: Configurable min/max amounts prevent abuse
6. **Emergency Functions**: Owner can withdraw funds if needed

## Gas Optimization

- Efficient storage patterns
- Minimal state changes
- Optimized event emission
- Batch operations where possible

## Future Enhancements

1. **Multi-token Support**: Accept ERC-20 tokens
2. **Subscription Management**: Automated recurring payments
3. **Escrow Services**: Hold payments until content delivery
4. **Dispute Resolution**: Multi-signature dispute handling
5. **Analytics Dashboard**: Enhanced reporting features

## License

MIT License - see LICENSE file for details. 