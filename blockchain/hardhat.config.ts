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
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;
