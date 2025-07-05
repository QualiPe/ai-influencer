# Smart Contract Deployment Information

## 🚀 Deployment Summary

**Network**: 0G Testnet (Chain ID: 16601)  
**Deployer**: 0xc5a30632C77E18a5Cb5481c8bb0572c83EeA6508  
**Deployment Date**: July 5, 2024

## 📋 Contract Addresses

### MockOracle
- **Address**: 0xD63FD591fd0c6a73B48aD7D5b25A6A6efce11354
- **Purpose**: Mock oracle for testing (replace with real oracle in production)
- **Network**: 0G Testnet

### INFT (AI Agent NFTs)
- **Address**: 0x3A896792D83DB829BDb5bCbeAcA202A1E2fbaBF0
- **Name**: AI Agent NFTs
- **Symbol**: AINFT
- **Purpose**: Main INFT contract for minting AI agent content
- **Network**: 0G Testnet

## 🔗 Network Information

- **RPC URL**: https://og-testnet-evm.itrocket.net
- **Chain ID**: 16601
- **Block Explorer**: https://og-testnet-explorer.itrocket.net

## 📝 Contract Functions

### INFT Contract
- `createAgent(name, description)` - Create a new AI agent
- `levelUpAgent(tokenId)` - Level up an agent
- `getAgent(tokenId)` - Get agent information
- `setOracle(address)` - Set oracle address (owner only)

### MockOracle Contract
- Mock implementation for testing purposes

## 🔧 Integration

### Backend Configuration
Update your backend `.env` file with these addresses:

```env
# Contract Addresses
INFT_CONTRACT_ADDRESS=0x3A896792D83DB829BDb5bCbeAcA202A1E2fbaBF0
ORACLE_CONTRACT_ADDRESS=0xD63FD591fd0c6a73B48aD7D5b25A6A6efce11354

# Network Configuration
RPC_URL=https://og-testnet-evm.itrocket.net
CHAIN_ID=16601
```

### Frontend Configuration
For any frontend applications, use these contract addresses and network configuration.

## 🧪 Testing

### Verify Contracts on Explorer
Visit the 0G testnet explorer to verify the contracts:
https://og-testnet-explorer.itrocket.net

### Test Contract Functions
```bash
# Test agent creation
npx hardhat run scripts/test-inft.js --network og-testnet

# Test contract interaction
npx hardhat console --network og-testnet
```

## 🔐 Security Notes

- These contracts are deployed on the testnet for development and testing
- For production deployment, use the mainnet configuration
- Ensure proper access controls are in place
- Consider upgrading the mock oracle to a real oracle implementation

## 📈 Next Steps

1. **Update Backend**: Configure the backend to use these deployed contracts
2. **Test Integration**: Verify the backend can interact with the contracts
3. **Frontend Development**: Create a frontend to interact with the contracts
4. **Production Deployment**: Deploy to mainnet when ready

## 🆘 Support

If you encounter any issues:
1. Check the contract addresses are correct
2. Verify network connectivity
3. Ensure your account has sufficient test tokens
4. Check the 0G testnet explorer for transaction status 