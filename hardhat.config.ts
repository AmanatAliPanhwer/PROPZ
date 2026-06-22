import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    amoy: {
      url: 'https://polygon-amoy.g.alchemy.com/v2/demo',
      accounts: process.env.REWARDER_PRIVATE_KEY
        ? [process.env.REWARDER_PRIVATE_KEY]
        : [],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY || '',
  },
  paths: {
    sources: './blockchain/contracts',
    tests: './blockchain/test',
    cache: './blockchain/cache',
    artifacts: './blockchain/artifacts',
  },
};

export default config;
