const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting PaymentContract Demo on 0G Network...\n");

  // Get signers - for 0G network, we'll use the same account for all operations
  const [owner] = await ethers.getSigners();
  
  // Create additional signers for testing (using the same private key but different nonces)
  // This is just for demo purposes - in real scenarios you'd have different accounts
  const user1 = owner; // Use owner as user1 for demo
  const user2 = owner; // Use owner as user2 for demo
  
  console.log("👤 Owner/Deployer:", owner.address);
  console.log("👤 User 1 (same as owner for demo):", user1.address);
  console.log("👤 User 2 (same as owner for demo):", user2.address);
  console.log("");

  // Deploy PaymentContract
  console.log("📦 Deploying PaymentContract...");
  const PaymentContractFactory = await ethers.getContractFactory("PaymentContract");
  const paymentContract = await PaymentContractFactory.deploy();
  await paymentContract.waitForDeployment();
  
  const contractAddress = await paymentContract.getAddress();
  console.log("✅ PaymentContract deployed to:", contractAddress);
  console.log("");

  // Check initial values
  console.log("📊 Initial Contract Values:");
  console.log("   Service Fee:", await paymentContract.serviceFee(), "basis points (2.5%)");
  console.log("   Min Payment:", ethers.formatEther(await paymentContract.minPaymentAmount()), "ETH");
  console.log("   Max Payment:", ethers.formatEther(await paymentContract.maxPaymentAmount()), "ETH");
  console.log("");

  // Test 1: Send payment to owner (this will fail since owner can't send to self)
  console.log("💰 Test 1: Attempting to send payment to owner (should fail)");
  const amount1 = ethers.parseEther("0.1");
  const message1 = "Thanks for the great AI content!";
  
  try {
    const tx1 = await paymentContract.connect(user1).sendPayment(message1, { value: amount1 });
    console.log("   Transaction sent:", tx1.hash);
    
    const receipt1 = await tx1.wait();
    console.log("   Transaction confirmed in block:", receipt1.blockNumber);
  } catch (error) {
    console.log("   ❌ Expected error:", error.message);
  }
  console.log("");

  // Test 2: Update service fee (owner only)
  console.log("⚙️ Test 2: Updating service fee");
  const newFee = 300; // 3%
  const tx3 = await paymentContract.connect(owner).updateServiceFee(newFee);
  console.log("   Transaction sent:", tx3.hash);
  
  const receipt3 = await tx3.wait();
  console.log("   Transaction confirmed in block:", receipt3.blockNumber);
  
  const updatedFee = await paymentContract.serviceFee();
  console.log("   New service fee:", updatedFee, "basis points (3%)");
  console.log("");

  // Test 3: Get contract stats
  console.log("📈 Test 3: Contract statistics");
  const stats = await paymentContract.getContractStats();
  console.log("   Total payments:", Number(stats.totalPayments));
  console.log("   Total volume:", ethers.formatEther(stats.totalVolume), "ETH");
  console.log("   Current balance:", ethers.formatEther(stats.currentBalance), "ETH");
  console.log("");

  // Test 4: Update payment limits
  console.log("⚙️ Test 4: Updating payment limits");
  const newMin = ethers.parseEther("0.001");
  const newMax = ethers.parseEther("5");
  
  const tx4 = await paymentContract.connect(owner).updatePaymentLimits(newMin, newMax);
  console.log("   Transaction sent:", tx4.hash);
  
  const receipt4 = await tx4.wait();
  console.log("   Transaction confirmed in block:", receipt4.blockNumber);
  
  console.log("   New min payment:", ethers.formatEther(await paymentContract.minPaymentAmount()), "ETH");
  console.log("   New max payment:", ethers.formatEther(await paymentContract.maxPaymentAmount()), "ETH");
  console.log("");

  // Final stats
  console.log("🎯 Final Contract Statistics:");
  const finalStats = await paymentContract.getContractStats();
  console.log("   Total payments:", Number(finalStats.totalPayments));
  console.log("   Total volume processed:", ethers.formatEther(finalStats.totalVolume), "ETH");
  console.log("   Current contract balance:", ethers.formatEther(finalStats.currentBalance), "ETH");
  console.log("");

  console.log("✅ PaymentContract Demo completed successfully!");
  console.log("🔗 Contract address:", contractAddress);
  console.log("🌐 View on explorer: https://chainscan-galileo.0g.ai/address/" + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Demo failed:", error);
    process.exit(1);
  }); 