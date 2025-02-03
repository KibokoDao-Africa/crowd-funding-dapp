import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    liskTestnet: {
      url: "https://evm.testnet.lisk.com", 
      chainId: 4202,
      accounts: ["YOUR_PRIVATE_KEY"], 
    },
  },
};

export default config;