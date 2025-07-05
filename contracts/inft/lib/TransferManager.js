class TransferManager {
    constructor(oracle, metadataManager) {
        this.oracle = oracle;
        this.metadata = metadataManager;
    }
    
    async prepareTransfer(tokenId, fromAddress, toAddress, toPublicKey) {
        try {
            // Retrieve current metadata
            const currentURI = await this.metadata.getEncryptedURI(tokenId);
            const encryptedData = await this.storage.retrieve(currentURI);
            
            // Request oracle to re-encrypt for new owner
            const transferRequest = {
                tokenId,
                encryptedData,
                fromAddress,
                toAddress,
                toPublicKey
            };
            
            // Get oracle proof and new sealed key
            const oracleResponse = await this.oracle.processTransfer(transferRequest);
            
            return {
                sealedKey: oracleResponse.sealedKey,
                proof: oracleResponse.proof,
                newEncryptedURI: oracleResponse.newURI
            };
        } catch (error) {
            throw new Error(`Transfer preparation failed: ${error.message}`);
        }
    }
    
    async executeTransfer(contract, transferData) {
        const { from, to, tokenId, sealedKey, proof } = transferData;
        
        const tx = await contract.transfer(
            from,
            to,
            tokenId,
            sealedKey,
            proof
        );
        
        return await tx.wait();
    }
}

module.exports = TransferManager;