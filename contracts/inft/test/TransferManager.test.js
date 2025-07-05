const { expect } = require("chai");
const TransferManager = require("../lib/TransferManager");

describe("TransferManager", function () {
    let transferManager;
    let mockOracle;
    let mockMetadataManager;
    let mockStorage;
    let mockContract;

    beforeEach(() => {
        // Mock storage
        mockStorage = {
            retrieve: async (uri) => "encryptedData"
        };

        // Mock metadata manager
        mockMetadataManager = {
            getEncryptedURI: async (tokenId) => "mockURI",
            storage: mockStorage
        };

        // Mock oracle
        mockOracle = {
            processTransfer: async (transferRequest) => ({
                sealedKey: "sealedKey",
                proof: "oracleProof",
                newURI: "newEncryptedURI"
            })
        };

        // Mock contract
        mockContract = {
            transfer: async (from, to, tokenId, sealedKey, proof) => ({
                wait: async () => ({
                    events: [{ args: { tokenId } }],
                    transactionHash: "0x123"
                })
            })
        };

        transferManager = new TransferManager(mockOracle, mockMetadataManager);
        // Attach storage to transferManager for .storage.retrieve
        transferManager.storage = mockStorage;
    });

    describe("prepareTransfer", function () {
        it("should prepare transfer successfully", async () => {
            const result = await transferManager.prepareTransfer(
                1, "0xfrom", "0xto", "0xpubkey"
            );

            expect(result).to.have.property("sealedKey");
            expect(result).to.have.property("proof");
            expect(result).to.have.property("newEncryptedURI");
            expect(result.sealedKey).to.equal("sealedKey");
            expect(result.proof).to.equal("oracleProof");
            expect(result.newEncryptedURI).to.equal("newEncryptedURI");
        });

        it("should handle errors in prepareTransfer", async () => {
            // Make storage.retrieve throw
            transferManager.storage.retrieve = async () => { 
                throw new Error("fail"); 
            };

            await expect(
                transferManager.prepareTransfer(1, "0xfrom", "0xto", "0xpubkey")
            ).to.be.rejectedWith("Transfer preparation failed: fail");
        });

        it("should handle oracle errors", async () => {
            // Make oracle.processTransfer throw
            mockOracle.processTransfer = async () => { 
                throw new Error("oracle error"); 
            };

            await expect(
                transferManager.prepareTransfer(1, "0xfrom", "0xto", "0xpubkey")
            ).to.be.rejectedWith("Transfer preparation failed: oracle error");
        });
    });

    describe("executeTransfer", function () {
        it("should execute transfer successfully", async () => {
            const transferData = {
                from: "0xfrom",
                to: "0xto",
                tokenId: 1,
                sealedKey: "sealedKey",
                proof: "oracleProof"
            };

            const receipt = await transferManager.executeTransfer(mockContract, transferData);

            expect(receipt).to.have.property("transactionHash");
            expect(receipt.transactionHash).to.equal("0x123");
            expect(receipt.events[0].args.tokenId).to.equal(1);
        });

        it("should handle contract transfer errors", async () => {
            // Make contract.transfer throw
            mockContract.transfer = async () => { 
                throw new Error("contract error"); 
            };

            const transferData = {
                from: "0xfrom",
                to: "0xto",
                tokenId: 1,
                sealedKey: "sealedKey",
                proof: "oracleProof"
            };

            await expect(
                transferManager.executeTransfer(mockContract, transferData)
            ).to.be.rejectedWith("contract error");
        });
    });

    describe("Integration test", function () {
        it("should prepare and execute transfer in sequence", async () => {
            // Step 1: Prepare transfer
            const transferPrep = await transferManager.prepareTransfer(
                1, "0xfrom", "0xto", "0xpubkey"
            );

            expect(transferPrep).to.have.property("sealedKey");
            expect(transferPrep).to.have.property("proof");
            expect(transferPrep).to.have.property("newEncryptedURI");

            // Step 2: Execute transfer
            const transferData = {
                from: "0xfrom",
                to: "0xto",
                tokenId: 1,
                sealedKey: transferPrep.sealedKey,
                proof: transferPrep.proof
            };

            const receipt = await transferManager.executeTransfer(mockContract, transferData);

            expect(receipt).to.have.property("transactionHash");
            expect(receipt.events[0].args.tokenId).to.equal(1);
        });
    });
}); 