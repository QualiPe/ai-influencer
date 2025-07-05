const { ethers } = require("ethers");
require("dotenv").config();

// PaymentContract address (deployed on 0G testnet) - No minimum amount version
const PAYMENT_CONTRACT_ADDRESS = "0xd3d4c6b01059586aCa7EBdd5827Eb020896Bc1A4";

// PaymentContract ABI (only the functions we need)
const PAYMENT_CONTRACT_ABI = [
  "function sendPayment(string memory message) external payable",
  "function sendPaymentTo(address recipient, string memory message) external payable",
  "function getPayment(uint256 paymentId) external view returns (uint256 paymentId, address from, address to, uint256 amount, string memory message, uint256 timestamp, bool exists)",
  "function getContractStats() external view returns (uint256 totalPayments, uint256 totalVolume, uint256 currentBalance)",
  "function minPaymentAmount() external view returns (uint256)",
  "function maxPaymentAmount() external view returns (uint256)"
];

async function sendPayment() {
  try {
    console.log("💰 Starting Payment Script...\n");

    // Check if PRIVATE_KEY is set
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY not found in .env file");
    }

    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider("https://og-testnet-evm.itrocket.net");
    
    // Get private key from .env and ensure it doesn't have 0x prefix
    let privateKey = process.env.PRIVATE_KEY;
    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.slice(2);
    }
    const formattedPrivateKey = `0x${privateKey}`;
    
    const wallet = new ethers.Wallet(formattedPrivateKey, provider);
    console.log("🔑 Wallet address:", wallet.address);

    // Create contract instance
    const paymentContract = new ethers.Contract(
      PAYMENT_CONTRACT_ADDRESS,
      PAYMENT_CONTRACT_ABI,
      wallet
    );

    // Get contract info
    console.log("📋 Contract Information:");
    console.log("   Contract address:", PAYMENT_CONTRACT_ADDRESS);
    
    const minAmount = await paymentContract.minPaymentAmount();
    const maxAmount = await paymentContract.maxPaymentAmount();
    
    console.log("   Min payment:", ethers.formatEther(minAmount), "ETH");
    console.log("   Max payment:", ethers.formatEther(maxAmount), "ETH");
    console.log("");

    // Get current stats
    const stats = await paymentContract.getContractStats();
    console.log("📊 Current Contract Stats:");
    console.log("   Total payments:", Number(stats.totalPayments));
    console.log("   Total volume:", ethers.formatEther(stats.totalVolume), "ETH");
    console.log("   Current balance:", ethers.formatEther(stats.currentBalance), "ETH");
    console.log("");

    // Payment parameters
    const paymentAmount = ethers.parseEther("0.00001"); // 0.00001 ETH (very small amount - no minimum)
    const message = "Tell how the weather prediction works";

    console.log("💸 Sending Payment:");
    console.log("   Amount:", ethers.formatEther(paymentAmount), "ETH");
    console.log("   Message:", message);
    console.log("");

    // Send payment
    console.log("🚀 Sending transaction...");
    const tx = await paymentContract.sendPayment(message, { value: paymentAmount });
    console.log("   Transaction hash:", tx.hash);
    
    // Wait for confirmation
    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("   Block number:", receipt.blockNumber);
    console.log("   Gas used:", receipt.gasUsed.toString());
    console.log("");

    // Get payment details
    const newStats = await paymentContract.getContractStats();
    const paymentId = Number(newStats.totalPayments);
    
    console.log("✅ Payment Successful!");
    console.log("   Payment ID:", paymentId);
    console.log("   Transaction confirmed in block:", receipt.blockNumber);
    console.log("");

    // Get payment details
    try {
      const payment = await paymentContract.getPayment(paymentId);
      console.log("📋 Payment Details:");
      console.log("   Payment ID:", Number(payment.paymentId));
      console.log("   From:", payment.from);
      console.log("   To:", payment.to);
      console.log("   Amount:", ethers.formatEther(payment.amount), "ETH");
      console.log("   Message:", payment.message);
      console.log("   Timestamp:", new Date(Number(payment.timestamp) * 1000).toLocaleString());
      console.log("");

      // Updated stats
      const updatedStats = await paymentContract.getContractStats();
      console.log("📊 Updated Contract Stats:");
      console.log("   Total payments:", Number(updatedStats.totalPayments));
      console.log("   Total volume:", ethers.formatEther(updatedStats.totalVolume), "ETH");
      console.log("   Current balance:", ethers.formatEther(updatedStats.currentBalance), "ETH");
      console.log("");

    } catch (error) {
      console.log("⚠️ Could not retrieve payment details:", error.message);
    }

    console.log("🌐 View on explorer: https://chainscan-galileo.0g.ai/address/" + PAYMENT_CONTRACT_ADDRESS);
    console.log("✅ Payment script completed successfully!");

  } catch (error) {
    console.error("❌ Payment failed:", error.message);
    if (error.code === 'INSUFFICIENT_FUNDS') {
      console.log("💡 Make sure your wallet has enough ETH for the payment + gas fees");
    }
    process.exit(1);
  }
}

// Run the script
sendPayment(); 