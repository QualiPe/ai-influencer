const { expect } = require("chai");
const { ethers } = require("hardhat");
const MetadataManager = require("../lib/MetadataManager");

describe("MetadataManager", function () {
    let metadataManager;
    let mockStorage;
    let mockEncryption;
    let mockContract;
    let owner;
    let recipient;

    beforeEach(async function () {
        // Get signers
        [owner, recipient] = await ethers.getSigners();

        // Create mock storage service
        mockStorage = {
            store: async (data) => {
                return { uri: `ipfs://${Date.now()}` };
            }
        };

        // Create mock encryption service
        mockEncryption = {
            encrypt: async (data, key) => {
                return Buffer.from(data).toString('base64');
            },
            sealKey: async (key, publicKey) => {
                return Buffer.from(key).toString('base64');
            }
        };

        // Create mock contract
        mockContract = {
            mint: async (recipient, uri, hash) => {
                return {
                    wait: async () => {
                        return {
                            events: [{
                                args: {
                                    tokenId: ethers.BigNumber.from(1)
                                }
                            }],
                            transactionHash: "0x1234567890abcdef"
                        };
                    }
                };
            }
        };

        // Initialize MetadataManager
        metadataManager = new MetadataManager(mockStorage, mockEncryption);
    });

    describe("createAIAgent", function () {
        it("should create AI agent with encrypted metadata", async function () {
            const aiModelData = {
                model: "gpt-4",
                weights: "base64_encoded_weights",
                config: { layers: 12, heads: 12 },
                capabilities: ["text-generation", "code-completion"]
            };

            const ownerPublicKey = "0x1234567890abcdef";

            const result = await metadataManager.createAIAgent(aiModelData, ownerPublicKey);

            expect(result).to.have.property("encryptedURI");
            expect(result).to.have.property("sealedKey");
            expect(result).to.have.property("metadataHash");
            expect(result.encryptedURI).to.include("ipfs://");
            expect(result.sealedKey).to.be.a("string");
            expect(result.metadataHash).to.be.a("string");
        });

        it("should handle errors gracefully", async function () {
            // Create a failing mock
            const failingStorage = {
                store: async () => {
                    throw new Error("Storage failed");
                }
            };

            const failingMetadataManager = new MetadataManager(failingStorage, mockEncryption);

            const aiModelData = {
                model: "gpt-4",
                weights: "base64_encoded_weights",
                config: { layers: 12, heads: 12 },
                capabilities: ["text-generation"]
            };

            await expect(
                failingMetadataManager.createAIAgent(aiModelData, "0x123")
            ).to.be.rejectedWith("Failed to create AI agent: Storage failed");
        });
    });

    describe("mintINFT", function () {
        it("should mint INFT successfully", async function () {
            const aiAgentData = {
                encryptedURI: "ipfs://QmTest123",
                sealedKey: "base64_sealed_key",
                metadataHash: "0xabcdef1234567890"
            };

            const result = await metadataManager.mintINFT(mockContract, recipient.address, aiAgentData);

            expect(result).to.have.property("tokenId");
            expect(result).to.have.property("sealedKey");
            expect(result).to.have.property("transactionHash");
            expect(result.tokenId).to.equal(ethers.BigNumber.from(1));
            expect(result.transactionHash).to.equal("0x1234567890abcdef");
        });

        it("should handle minting errors", async function () {
            const failingContract = {
                mint: async () => {
                    throw new Error("Minting failed");
                }
            };

            const aiAgentData = {
                encryptedURI: "ipfs://QmTest123",
                sealedKey: "base64_sealed_key",
                metadataHash: "0xabcdef1234567890"
            };

            await expect(
                metadataManager.mintINFT(failingContract, recipient.address, aiAgentData)
            ).to.be.rejectedWith("Minting failed");
        });
    });

    describe("Integration test", function () {
        it("should create AI agent and mint INFT in sequence", async function () {
            const aiModelData = {
                model: "gpt-4",
                weights: "base64_encoded_weights",
                config: { layers: 12, heads: 12 },
                capabilities: ["text-generation"]
            };

            const ownerPublicKey = "0x1234567890abcdef";

            // Step 1: Create AI agent
            const aiAgentData = await metadataManager.createAIAgent(aiModelData, ownerPublicKey);
            
            expect(aiAgentData).to.have.property("encryptedURI");
            expect(aiAgentData).to.have.property("sealedKey");
            expect(aiAgentData).to.have.property("metadataHash");

            // Step 2: Mint INFT
            const mintResult = await metadataManager.mintINFT(mockContract, recipient.address, aiAgentData);
            
            expect(mintResult).to.have.property("tokenId");
            expect(mintResult).to.have.property("sealedKey");
            expect(mintResult).to.have.property("transactionHash");
        });
    });
}); 