const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// PaymentContract address (deployed on 0G testnet) - No minimum amount version
const PAYMENT_CONTRACT_ADDRESS = "0xd3d4c6b01059586aCa7EBdd5827Eb020896Bc1A4";

// PaymentContract ABI (only the events we need)
const PAYMENT_CONTRACT_ABI = [
  "event PaymentReceived(uint256 indexed paymentId, address indexed from, address indexed to, uint256 amount, string message, uint256 timestamp)"
];

// File paths
const TOPICS_FILE = path.join(__dirname, "../../../backend/src/topics/topics.txt");

async function addLastPaymentToTop() {
  try {
    console.log("📝 Adding last payment message to top of topics.txt...\n");

    // Initialize provider
    const provider = new ethers.JsonRpcProvider("https://og-testnet-evm.itrocket.net");
    console.log("🔗 Connected to 0G Testnet");

    // Create contract instance
    const paymentContract = new ethers.Contract(
      PAYMENT_CONTRACT_ADDRESS,
      PAYMENT_CONTRACT_ABI,
      provider
    );

    console.log("📋 Contract Information:");
    console.log("   Contract address:", PAYMENT_CONTRACT_ADDRESS);
    console.log("   Topics file:", TOPICS_FILE);
    console.log("");

    // Get current block
    const currentBlock = await provider.getBlockNumber();
    console.log("Current block:", currentBlock);

    // Get events from the last 2000 blocks to capture recent payments
    const fromBlock = Math.max(0, currentBlock - 2000);
    console.log("Searching from block:", fromBlock, "to", currentBlock);

    const events = await paymentContract.queryFilter("PaymentReceived", fromBlock, currentBlock);
    
    if (events.length === 0) {
      console.log("❌ No payment events found");
      return;
    }

    // Get the last (most recent) payment event
    const lastEvent = events[events.length - 1];
    const { paymentId, from, to, amount, message, timestamp } = lastEvent.args;
    
    console.log("💰 Last Payment Found:");
    console.log("   Payment ID:", Number(paymentId));
    console.log("   From:", from);
    console.log("   To:", to);
    console.log("   Amount:", ethers.formatEther(amount), "ETH");
    console.log("   Message:", message);
    console.log("   Timestamp:", new Date(Number(timestamp) * 1000).toLocaleString());
    console.log("   Block:", lastEvent.blockNumber);
    console.log("");

    // Read current topics file
    let currentContent = "";
    try {
      currentContent = fs.readFileSync(TOPICS_FILE, 'utf8');
    } catch (error) {
      console.log("⚠️ Could not read backend/src/topics/topics.txt, creating new file");
      currentContent = "# AI Influencer Content Topics\n# Generated from blockchain payments\n\n";
    }

    // Add the message to the top
    const updatedContent = message + "\n\n" + currentContent;

    // Write back to file
    fs.writeFileSync(TOPICS_FILE, updatedContent);

    console.log("✅ Last payment message added to top of backend/src/topics/topics.txt:");
    console.log("   📝 Added:", message);
    console.log("   📊 Payment ID:", Number(paymentId));
    console.log("   💰 Amount:", ethers.formatEther(amount), "ETH");
    console.log("");

    // Show file preview
    const lines = updatedContent.split('\n').slice(0, 8);
    console.log("📄 Backend topics.txt preview (first 8 lines):");
    lines.forEach((line, index) => {
      if (line.trim()) {
        console.log(`   ${index + 1}: ${line}`);
      }
    });
    console.log("");

    console.log("🌐 View contract on explorer: https://chainscan-galileo.0g.ai/address/" + PAYMENT_CONTRACT_ADDRESS);
    console.log("✅ Last payment message successfully added to backend topics!");

  } catch (error) {
    console.error("❌ Error adding last payment to top:", error.message);
    process.exit(1);
  }
}

// Run the script
addLastPaymentToTop(); 