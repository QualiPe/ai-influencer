const { ethers } = require('ethers');
const crypto = require('crypto');

class MetadataManager {
    constructor(ogStorage, encryptionService) {
        this.storage = ogStorage;
        this.encryption = encryptionService;
    }
    
    async createAIAgent(aiModelData, ownerPublicKey) {
        try {
            // Prepare AI agent metadata
            const metadata = {
                model: aiModelData.model,
                weights: aiModelData.weights,
                config: aiModelData.config,
                capabilities: aiModelData.capabilities,
                version: '1.0',
                createdAt: Date.now()
            };
            
            // Generate encryption key
            const encryptionKey = crypto.randomBytes(32);
            
            // Encrypt metadata
            const encryptedData = await this.encryption.encrypt(
                JSON.stringify(metadata),
                encryptionKey
            );
            
            // Store on 0G Storage
            const storageResult = await this.storage.store(encryptedData);
            
            // Seal key for owner
            const sealedKey = await this.encryption.sealKey(
                encryptionKey,
                ownerPublicKey
            );
            
            // Generate metadata hash
            const metadataHash = ethers.keccak256(
                ethers.toUtf8Bytes(JSON.stringify(metadata))
            );
            
            return {
                encryptedURI: storageResult.uri,
                sealedKey,
                metadataHash
            };
        } catch (error) {
            throw new Error(`Failed to create AI agent: ${error.message}`);
        }
    }
    
    async mintINFT(contract, recipient, aiAgentData) {
        const { encryptedURI, sealedKey, metadataHash } = aiAgentData;
        
        const tx = await contract.mint(
            recipient,
            encryptedURI,
            metadataHash
        );
        
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId;
        
        return {
            tokenId,
            sealedKey,
            transactionHash: receipt.transactionHash
        };
    }
}

module.exports = MetadataManager;