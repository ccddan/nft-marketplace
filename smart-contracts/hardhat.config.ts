import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const ACCOUNTS = process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    "ethereum-rinkeby": {
      url: process.env.ETHEREUM_RINKEBY_URL || "",
      accounts: ACCOUNTS,
    },
    "ethereum-ropsten": {
      url: process.env.ETHEREUM_ROPSTEN_URL || "",
      accounts: ACCOUNTS,
    },
    "polygon": {
      url: process.env.POLYGON_URL || "",
      accounts: ACCOUNTS,
    },
    "polygon-testnet": {
      url: process.env.POLYGON_MUMBAI_URL || "",
      accounts: ACCOUNTS,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      // For supported networks, see: https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html

      // ethereum
      rinkeby: process.env.ETHERSCAN_RINKEBY_API_KEY,
      ropsten: process.env.ETHERSCAN_ROPSTEN_API_KEY,

      // polygon
      polygon: process.env.POLYGON_ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGON_MUMBAI_ETHERSCAN_API_KEY,
    },
  },
};

export default config;
