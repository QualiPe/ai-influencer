// test/INFT.test.js
describe('INFT Contract', function () {
    it('should mint INFT with encrypted metadata', async function () {
        const metadata = await createTestMetadata();
        const result = await inft.mint(owner.address, metadata.uri, metadata.hash);
        expect(result).to.emit(inft, 'Transfer');
    });
    
    it('should transfer with re-encryption', async function () {
        // Test secure transfer logic
    });
    
    it('should authorize usage without ownership transfer', async function () {
        // Test authorization functionality
    });
});