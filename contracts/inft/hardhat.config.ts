require("dotenv").config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337
    },
    "og-testnet": {
      url: "https://og-testnet-evm.itrocket.net",
      chainId: 16601,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "sepolia": {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/your-project-id",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "og-mainnet": {
      url: "https://rpc.0g.ai",
      chainId: 1000,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  }
};

export default config;
