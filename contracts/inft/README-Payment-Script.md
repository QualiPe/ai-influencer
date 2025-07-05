# Payment Script for AI Influencer Services

This script allows you to send payments to the PaymentContract with custom messages for AI influencer services.

## Features

- 💰 **Send Payments**: Send ETH with custom messages
- 📊 **Contract Stats**: View current contract statistics
- 🔍 **Payment Details**: Retrieve detailed payment information
- 💸 **Fee Calculation**: Automatic service fee calculation
- 🌐 **Explorer Links**: Direct links to view transactions

## Prerequisites

1. **Funded Wallet**: Your wallet needs ETH for payments + gas fees
2. **Private Key**: Set your private key in `.env` file
3. **PaymentContract**: Deployed at `0x57A58c61fC9E49e6f455D506091fd9C2e46a129A`

## Setup

### 1. Set Your Private Key

In your `.env` file:
```
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

### 2. Install Dependencies

```bash
npm install ethers dotenv
```

## Usage

### Basic Payment

```bash
node scripts/send-payment.js
```

This will:
- Send 0.01 ETH to the contract owner
- Include message: "Payment for AI influencer content generation services"
- Show payment breakdown with fees
- Display transaction details

### Customize Payment

To modify the payment amount or message, edit these lines in the script:

```javascript
// Payment parameters
const paymentAmount = ethers.parseEther("0.01"); // Change amount here
const message = "Payment for AI influencer content generation services"; // Change message here
```

## What the Script Does

1. **Connects to 0G Testnet**: Uses the correct RPC endpoint
2. **Loads Contract**: Connects to deployed PaymentContract
3. **Shows Contract Info**: Displays fees, limits, and current stats
4. **Calculates Fees**: Shows payment breakdown (gross, fee, net)
5. **Sends Payment**: Executes the transaction
6. **Confirms Transaction**: Waits for blockchain confirmation
7. **Retrieves Details**: Gets payment information and updated stats

## Output Example

```
💰 Starting Payment Script...

🔑 Wallet address: 0xc5a30632C77E18a5Cb5481c8bb0572c83EeA6508

📋 Contract Information:
   Contract address: 0x57A58c61fC9E49e6f455D506091fd9C2e46a129A
   Service fee: 300 basis points (3%)
   Min payment: 0.001 ETH
   Max payment: 5.0 ETH

📊 Current Contract Stats:
   Total payments: 0
   Total volume: 0.0 ETH
   Current balance: 0.0 ETH

💸 Sending Payment:
   Amount: 0.01 ETH
   Message: Payment for AI influencer content generation services

📊 Payment Breakdown:
   Gross amount: 0.01 ETH
   Service fee: 0.0003 ETH
   Net amount: 0.0097 ETH

🚀 Sending transaction...
   Transaction hash: 0x1234...
⏳ Waiting for confirmation...
   Block number: 1234567
   Gas used: 123456

✅ Payment Successful!
   Payment ID: 1
   Transaction confirmed in block: 1234567

📋 Payment Details:
   Payment ID: 1
   From: 0xc5a30632C77E18a5Cb5481c8bb0572c83EeA6508
   To: 0x...
   Amount: 0.0097 ETH
   Message: Payment for AI influencer content generation services
   Timestamp: 1/1/2024, 12:00:00 PM

📊 Updated Contract Stats:
   Total payments: 1
   Total volume: 0.01 ETH
   Current balance: 0.0003 ETH

🌐 View on explorer: https://chainscan-galileo.0g.ai/address/0x57A58c61fC9E49e6f455D506091fd9C2e46a129A
✅ Payment script completed successfully!
```

## Payment Functions

### sendPayment(message)
- Sends payment to contract owner
- Includes custom message
- Automatically calculates and deducts service fee

### sendPaymentTo(recipient, message)
- Sends payment to specific address
- Includes custom message
- Automatically calculates and deducts service fee
- Transfers net amount to recipient

## Service Fees

- **Default Fee**: 3% (300 basis points)
- **Min Payment**: 0.001 ETH
- **Max Payment**: 5.0 ETH
- **Fee Calculation**: `(amount * serviceFee) / 10000`

## Error Handling

The script handles common errors:
- **Insufficient Funds**: Checks wallet balance
- **Invalid Amount**: Validates against min/max limits
- **Network Issues**: Retries on connection problems
- **Transaction Failures**: Shows detailed error messages

## Integration

This script can be integrated with:
- **Telegram Bot**: Automated payment processing
- **Web Interface**: Payment form backend
- **API Services**: Payment endpoint
- **Cron Jobs**: Scheduled payments

## Security Notes

- Never commit your private key to version control
- Use environment variables for sensitive data
- Test with small amounts first
- Monitor transaction confirmations
- Keep your private key secure

## Support

- **Contract Address**: `0x57A58c61fC9E49e6f455D506091fd9C2e46a129A`
- **Explorer**: https://chainscan-galileo.0g.ai/address/0x57A58c61fC9E49e6f455D506091fd9C2e46a129A
- **Network**: 0G Testnet
- **RPC**: https://og-testnet-evm.itrocket.net 