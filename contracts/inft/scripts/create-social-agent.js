const SocialAgentManager = require("../lib/SocialAgentManager");
const MockVideoGenerator = require("../lib/mocks/VideoGenerator");
const MockContentAnalyzer = require("../lib/mocks/ContentAnalyzer");

// Mock services (replace with real implementations)
const mockStorage = {
    store: async (data) => {
        console.log("📦 Storing encrypted data on 0G Storage...");
        await new Promise(resolve => setTimeout(resolve, 100));
        return { uri: `ipfs://Qm${Date.now()}` };
    }
};

const mockEncryption = {
    encrypt: async (data, key) => {
        console.log("🔐 Encrypting data...");
        return Buffer.from(data).toString('base64');
    },
    sealKey: async (key, publicKey) => {
        console.log("🔒 Sealing key for owner...");
        return Buffer.from(key).toString('base64');
    }
};

async function createSocialAgentDemo() {
    console.log("🚀 Starting Social Agent Creation Demo...\n");

    // Initialize services
    const videoGenerator = new MockVideoGenerator();
    const contentAnalyzer = new MockContentAnalyzer();
    const socialAgentManager = new SocialAgentManager(
        mockStorage, 
        mockEncryption, 
        videoGenerator, 
        contentAnalyzer
    );

    try {
        // Step 1: Create a Social Agent
        console.log("🤖 Step 1: Creating Social Agent...");
        
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

        const socialAgent = await socialAgentManager.createSocialAgent(agentConfig, ownerPublicKey);

        console.log("✅ Social Agent created successfully!");
        console.log("🆔 Agent ID:", socialAgent.agentId.substring(0, 20) + "...");
        console.log("📄 Encrypted URI:", socialAgent.encryptedURI);
        console.log("🔑 Sealed Key:", socialAgent.sealedKey.substring(0, 20) + "...");
        console.log("");

        // Step 2: Generate Video Content
        console.log("🎬 Step 2: Generating Video Content...");
        
        const topic = "The Future of AI in 2024";
        const script = `
            Hey everyone! Today we're diving into the most exciting AI developments of 2024. 
            From GPT-5 rumors to autonomous vehicles, AI is reshaping our world faster than ever.
            
            Did you know that AI models are now creating entire movies? It's absolutely incredible!
            But here's the question: Are you ready for this AI revolution?
            
            Let me know in the comments what AI trend excites you most!
        `;

        console.log("📝 Script:", script.substring(0, 100) + "...");
        console.log("🎯 Topic:", topic);
        console.log("⏳ Generating video (this may take a few seconds)...");

        const videoContent = await socialAgentManager.generateVideoContent(
            socialAgent.agentId, 
            topic, 
            script
        );

        console.log("✅ Video content generated successfully!");
        console.log("🎥 Video URL:", videoContent.videoUrl);
        console.log("🖼️ Thumbnail:", videoContent.thumbnailUrl);
        console.log("📊 Predicted Views:", videoContent.analysis.predictedViews);
        console.log("👍 Predicted Likes:", videoContent.analysis.predictedLikes);
        console.log("🔄 Predicted Shares:", videoContent.analysis.predictedShares);
        console.log("📈 Virality Score:", (videoContent.analysis.viralityScore * 100).toFixed(1) + "%");
        console.log("");

        // Step 3: Mint as INFT (Mock)
        console.log("🪙 Step 3: Minting Content as INFT...");
        
        const mockContract = {
            mint: async (recipient, uri, hash) => {
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

        const mintResult = await socialAgentManager.mintContentAsINFT(
            mockContract, 
            recipient, 
            videoContent
        );

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

        const statsUpdate = await socialAgentManager.updateAgentStats(socialAgent.agentId, newStats);

        console.log("✅ Agent stats updated successfully!");
        console.log("📈 New URI:", statsUpdate.updatedURI);
        console.log("🔑 New Sealed Key:", statsUpdate.newSealedKey.substring(0, 20) + "...");
        console.log("");

        console.log("🎉 Social Agent Demo Completed Successfully!");
        console.log("");
        console.log("📋 Summary:");
        console.log("   • Created social agent: TechGuru Alex");
        console.log("   • Generated video: 'The Future of AI in 2024'");
        console.log("   • Minted as INFT with encrypted metadata");
        console.log("   • Updated agent statistics");
        console.log("");
        console.log("🔐 All data is encrypted and stored on 0G Storage");
        console.log("🪙 Content is now tradeable as an INFT");
        console.log("📊 Engagement predictions help optimize future content");

    } catch (error) {
        console.error("❌ Error during demo:", error.message);
    }
}

// Run the demonstration
if (require.main === module) {
    createSocialAgentDemo()
        .then(() => {
            console.log("\n✨ Demo completed!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Demo failed:", error);
            process.exit(1);
        });
}

module.exports = { createSocialAgentDemo }; 