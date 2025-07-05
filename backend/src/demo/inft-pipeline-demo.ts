import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { INFTService } from '../services/INFTService';

async function runINFTPipelineDemo() {
  console.log("🚀 Starting INFT Pipeline Demo...\n");

  try {
    // Create NestJS application context
    const app = await NestFactory.createApplicationContext(AppModule);
    const inftService = app.get(INFTService);

    // Step 1: Create Social Agent Configuration
    const agentConfig = {
      name: "TechGuru Alex",
      personality: "Enthusiastic tech expert who explains complex topics simply",
      niche: "tech",
      targetAudience: "millennials",
      contentStyle: "Educational and entertaining",
      videoResolution: "1080p",
      videoDuration: 90,
      videoStyle: "modern",
      aiModel: "gpt-4",
      voiceModel: "elevenlabs",
      avatarModel: "stable-diffusion"
    };

    const ownerPublicKey = "0x1234567890abcdef1234567890abcdef12345678";

    console.log("🤖 Step 1: Creating Social Agent...");
    const socialAgent = await inftService.createSocialAgent(agentConfig, ownerPublicKey);
    console.log("✅ Social Agent created successfully!");
    console.log("🆔 Agent ID:", socialAgent.agentId.substring(0, 20) + "...");
    console.log("📄 Encrypted URI:", socialAgent.encryptedURI);
    console.log("🔑 Sealed Key:", socialAgent.sealedKey.substring(0, 20) + "...");
    console.log("");

    // Step 2: Generate Video Content
    console.log("🎬 Step 2: Generating Video Content...");
    const topic = "The Future of AI in 2024";
    
    const videoContent = await inftService.generateVideoContent(socialAgent.agentId, topic);
    console.log("✅ Video content generated successfully!");
    console.log("🎥 Video URL:", videoContent.videoUrl);
    console.log("🖼️ Thumbnail:", videoContent.thumbnailUrl);
    console.log("📊 Predicted Views:", videoContent.analysis.predictedViews);
    console.log("👍 Predicted Likes:", videoContent.analysis.predictedLikes);
    console.log("🔄 Predicted Shares:", videoContent.analysis.predictedShares);
    console.log("📈 Virality Score:", (videoContent.analysis.viralityScore * 100).toFixed(1) + "%");
    console.log("");

    // Step 3: Mint as INFT
    console.log("🪙 Step 3: Minting Content as INFT...");
    
    const mockContract = {
      mint: async (recipient: string, uri: string, hash: string) => {
        console.log("📋 Minting INFT...");
        console.log("👤 Recipient:", recipient);
        console.log("🔗 URI:", uri);
        console.log("🔍 Hash:", hash);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          wait: async () => {
            return {
              events: [{
                args: {
                  tokenId: Math.floor(Math.random() * 1000) + 1
                }
              }],
              transactionHash: "0x" + Math.random().toString(16).substring(2, 42)
            };
          }
        };
      }
    };

    const recipient = "0xabcdef1234567890abcdef1234567890abcdef12";

    const mintResult = await inftService.mintContentAsINFT(recipient, videoContent);
    console.log("✅ Content minted as INFT successfully!");
    console.log("🆔 Token ID:", mintResult.tokenId);
    console.log("🎬 Content ID:", mintResult.contentId.substring(0, 20) + "...");
    console.log("🔗 Transaction Hash:", mintResult.transactionHash);
    console.log("");

    // Step 4: Update Agent Stats
    console.log("📊 Step 4: Updating Agent Stats...");
    
    const newStats = {
      videosCreated: 1,
      totalViews: videoContent.analysis.predictedViews,
      engagementRate: videoContent.analysis.engagementRate
    };

    const statsUpdate = await inftService.updateAgentStats(socialAgent.agentId, newStats);
    console.log("✅ Agent stats updated successfully!");
    console.log("📈 New URI:", statsUpdate.updatedURI);
    console.log("🔑 New Sealed Key:", statsUpdate.newSealedKey.substring(0, 20) + "...");
    console.log("");

    // Step 5: Complete Pipeline Demo
    console.log("🔄 Step 5: Running Complete Pipeline...");
    
    const completePipelineResult = await inftService.generateContentWithINFT(
      agentConfig,
      ownerPublicKey,
      recipient
    );
    
    console.log("✅ Complete pipeline executed successfully!");
    console.log("🤖 Agent:", completePipelineResult.agent.agentId.substring(0, 20) + "...");
    console.log("🎬 Content:", completePipelineResult.content.videoUrl);
    console.log("🪙 INFT Token ID:", completePipelineResult.inft.tokenId);
    console.log("📊 Stats:", completePipelineResult.stats);
    console.log("");

    console.log("🎉 INFT Pipeline Demo Completed Successfully!");
    console.log("");
    console.log("📋 Summary:");
    console.log("   • Created social agent: TechGuru Alex");
    console.log("   • Generated video: 'The Future of AI in 2024'");
    console.log("   • Minted as INFT with encrypted metadata");
    console.log("   • Updated agent statistics");
    console.log("   • Executed complete pipeline");
    console.log("");
    console.log("🔐 All data is encrypted and stored on 0G Storage");
    console.log("🪙 Content is now tradeable as an INFT");
    console.log("📊 Engagement predictions help optimize future content");

    await app.close();

  } catch (error) {
    console.error("❌ Error during demo:", error.message);
    console.error(error.stack);
  }
}

// Run the demonstration
if (require.main === module) {
  runINFTPipelineDemo()
    .then(() => {
      console.log("\n✨ Demo completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Demo failed:", error);
      process.exit(1);
    });
}

export { runINFTPipelineDemo }; 