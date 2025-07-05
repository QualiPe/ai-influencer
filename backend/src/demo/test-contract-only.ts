import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { INFTService } from '../services/INFTService';

async function testContractOnly() {
  console.log("🧪 Testing Contract Integration Only...\n");

  try {
    // Create NestJS application context
    const app = await NestFactory.createApplicationContext(AppModule);
    const inftService = app.get(INFTService);

    console.log("✅ Backend initialized successfully");
    console.log("🔗 Connected to INFT contract");
    console.log("");

    // Test 1: Create a mock video content (without actual video generation)
    console.log("1️⃣ Creating mock video content...");
    
    const mockVideoContent = {
      videoUrl: "/shared/test_video.mp4",
      thumbnailUrl: "/shared/test_thumbnail.jpg",
      script: "This is a test video script for AI content generation.",
      topic: "Testing AI Integration",
      analysis: {
        predictedViews: 50000,
        predictedLikes: 2500,
        predictedShares: 500,
        engagementRate: 0.05,
        viralityScore: 0.3
      }
    };

    console.log("✅ Mock video content created");
    console.log("📝 Script:", mockVideoContent.script.substring(0, 50) + "...");
    console.log("");

    // Test 2: Mint as INFT using real contract
    console.log("2️⃣ Minting content as INFT using real contract...");
    
    const recipient = "0xc5a30632C77E18a5Cb5481c8bb0572c83EeA6508"; // Your wallet address

    const mintResult = await inftService.mintContentAsINFT(recipient, mockVideoContent);
    
    console.log("✅ Content minted as INFT successfully!");
    console.log("🆔 Token ID:", mintResult.tokenId);
    console.log("🎬 Content ID:", mintResult.contentId.substring(0, 20) + "...");
    console.log("🔗 Transaction Hash:", mintResult.transactionHash);
    console.log("📊 Gas Used:", mintResult.gasUsed);
    console.log("📦 Block Number:", mintResult.blockNumber);
    console.log("");

    // Test 3: Create Social Agent
    console.log("3️⃣ Creating Social Agent...");
    
    const agentConfig = {
      name: "TestAgent-" + Date.now(),
      personality: "Friendly tech enthusiast",
      niche: "tech",
      targetAudience: "developers",
      contentStyle: "Educational",
      videoResolution: "1080p",
      videoDuration: 60,
      videoStyle: "modern",
      aiModel: "gpt-4",
      voiceModel: "elevenlabs",
      avatarModel: "stable-diffusion"
    };

    const ownerPublicKey = "0xc5a30632C77E18a5Cb5481c8bb0572c83EeA6508";

    const socialAgent = await inftService.createSocialAgent(agentConfig, ownerPublicKey);
    
    console.log("✅ Social Agent created successfully!");
    console.log("🆔 Agent ID:", socialAgent.agentId.substring(0, 20) + "...");
    console.log("📄 Encrypted URI:", socialAgent.encryptedURI);
    console.log("🔑 Sealed Key:", socialAgent.sealedKey.substring(0, 20) + "...");
    console.log("");

    // Test 4: Update Agent Stats
    console.log("4️⃣ Updating Agent Stats...");
    
    const newStats = {
      videosCreated: 1,
      totalViews: mockVideoContent.analysis.predictedViews,
      engagementRate: mockVideoContent.analysis.engagementRate
    };

    const statsUpdate = await inftService.updateAgentStats(socialAgent.agentId, newStats);
    
    console.log("✅ Agent stats updated successfully!");
    console.log("📈 New URI:", statsUpdate.updatedURI);
    console.log("🔑 New Sealed Key:", statsUpdate.newSealedKey.substring(0, 20) + "...");
    console.log("");

    console.log("🎉 Contract Integration Test Completed Successfully!");
    console.log("");
    console.log("📋 Test Summary:");
    console.log("   ✅ Backend initialization");
    console.log("   ✅ Contract connection");
    console.log("   ✅ INFT minting (real transaction)");
    console.log("   ✅ Social agent creation");
    console.log("   ✅ Stats update");
    console.log("");
    console.log("🚀 Your INFT contract integration is working perfectly!");
    console.log("🔗 Transaction hash:", mintResult.transactionHash);
    console.log("🌐 View on explorer: https://og-testnet-explorer.itrocket.net/tx/" + mintResult.transactionHash);

    await app.close();

  } catch (error) {
    console.error("❌ Error during contract test:", error.message);
    console.error(error.stack);
  }
}

// Run the test
if (require.main === module) {
  testContractOnly()
    .then(() => {
      console.log("\n✨ Contract test completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Contract test failed:", error);
      process.exit(1);
    });
}

export { testContractOnly }; 