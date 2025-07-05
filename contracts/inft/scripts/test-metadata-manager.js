const MetadataManager = require("../lib/MetadataManager");

// Mock storage service (replace with real 0G Storage implementation)
const mockStorage = {
    store: async (data) => {
        console.log("📦 Storing encrypted data...");
        // Simulate storage delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return { uri: `ipfs://Qm${Date.now()}` };
    }
};

// Mock encryption service (replace with real encryption implementation)
const mockEncryption = {
    encrypt: async (data, key) => {
        console.log("🔐 Encrypting metadata...");
        // Simple base64 encoding for demo (use proper encryption in production)
        return Buffer.from(data).toString('base64');
    },
    sealKey: async (key, publicKey) => {
        console.log("🔒 Sealing key for owner...");
        // Simple base64 encoding for demo (use proper key sealing in production)
        return Buffer.from(key).toString('base64');
    }
};

async function demonstrateMetadataManager() {
    console.log("🚀 Starting MetadataManager demonstration...\n");

    // Initialize MetadataManager
    const metadataManager = new MetadataManager(mockStorage, mockEncryption);

    try {
        // Example AI model data
        const aiModelData = {
            model: "gpt-4",
            weights: "base64_encoded_model_weights_here",
            config: {
                layers: 12,
                heads: 12,
                embedding_dim: 768,
                max_tokens: 2048
            },
            capabilities: [
                "text-generation",
                "code-completion", 
                "translation",
                "summarization"
            ]
        };

        const ownerPublicKey = "0x1234567890abcdef1234567890abcdef12345678";

        console.log("🤖 Creating AI Agent...");
        console.log("Model:", aiModelData.model);
        console.log("Capabilities:", aiModelData.capabilities.join(", "));
        console.log("Owner:", ownerPublicKey);
        console.log("");

        // Create AI agent
        const aiAgentData = await metadataManager.createAIAgent(aiModelData, ownerPublicKey);

        console.log("✅ AI Agent created successfully!");
        console.log("📄 Encrypted URI:", aiAgentData.encryptedURI);
        console.log("🔑 Sealed Key:", aiAgentData.sealedKey.substring(0, 20) + "...");
        console.log("🔍 Metadata Hash:", aiAgentData.metadataHash);
        console.log("");

        // Mock contract for demonstration
        const mockContract = {
            mint: async (recipient, uri, hash) => {
                console.log("🪙 Minting INFT...");
                console.log("Recipient:", recipient);
                console.log("URI:", uri);
                console.log("Hash:", hash);
                
                // Simulate transaction
                await new Promise(resolve => setTimeout(resolve, 200));
                
                return {
                    wait: async () => {
                        return {
                            events: [{
                                args: {
                                    tokenId: 1
                                }
                            }],
                            transactionHash: "0x" + Math.random().toString(16).substring(2, 42)
                        };
                    }
                };
            }
        };

        const recipient = "0xabcdef1234567890abcdef1234567890abcdef12";

        // Mint INFT
        const mintResult = await metadataManager.mintINFT(mockContract, recipient, aiAgentData);

        console.log("✅ INFT minted successfully!");
        console.log("🆔 Token ID:", mintResult.tokenId.toString());
        console.log("🔑 Sealed Key:", mintResult.sealedKey.substring(0, 20) + "...");
        console.log("🔗 Transaction Hash:", mintResult.transactionHash);
        console.log("");

        console.log("🎉 MetadataManager demonstration completed successfully!");

    } catch (error) {
        console.error("❌ Error during demonstration:", error.message);
    }
}

// Run the demonstration
if (require.main === module) {
    demonstrateMetadataManager()
        .then(() => {
            console.log("\n✨ Script completed!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Script failed:", error);
            process.exit(1);
        });
}

module.exports = { demonstrateMetadataManager }; 