# NFT Marketplace - Smart Contracts

<!-- vscode-markdown-toc -->

- 1. [Setup](#Setup)
  - 1.1. [Dependencies](#Dependencies)
  - 1.2. [Environment Variables](#EnvironmentVariables)
- 2. [Contracts Deployment](#ContractsDeployment)
  - 2.1. [Lint, Compile and Test Contracts](#LintCompileandTestContracts)
  - 2.2. [Local Network Deployment](#LocalNetworkDeployment)
    - 2.2.1. [Hardhat](#Hardhat)
    - 2.2.2. [Ganache](#Ganache)
  - 2.3. [Remote Network Deployment](#RemoteNetworkDeployment)
  - 2.4. [(Optional) Verify Contracts](#OptionalVerifyContracts)
- 3. [General Useful Commands](#GeneralUsefulCommands)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## 1. <a name='Setup'></a>Setup

### 1.1. <a name='Dependencies'></a>Dependencies

```bash
$ npm install
```

### 1.2. <a name='EnvironmentVariables'></a>Environment Variables

For local development environments, create a copy of `.env.example` and rename it as `.env`. Next, inside `.env` provide the correct values for each env var (as applicable).

For production environments, depending on your infrastructure, provide the expected env vars defined in `.env.example` and their corresponding values.

## 2. <a name='ContractsDeployment'></a>Contracts Deployment

### 2.1. <a name='LintCompileandTestContracts'></a>Lint, Compile and Test Contracts

```bash
$ npx solhint 'contracts/**/*.sol'
$ npx hardhat clean
$ npx hardhat compile
$ REPORT_GAS=true npx hardhat test
```

### 2.2. <a name='LocalNetworkDeployment'></a>Local Network Deployment

Supported networks are:

- Hardhat RPC Server

  **network name**: localhost

- Ganache RPC Server

  **network name**: ganache

#### 2.2.1. <a name='Hardhat'></a>Hardhat

In a separate window terminal, run:

```bash
$ npx hardhat node
```

Select any `Private Key` shown in the console's output and update `.env` (see [Environment Variables](#EnvironmentVariables))

#### 2.2.2. <a name='Ganache'></a>Ganache

Visit [Ganache](https://trufflesuite.com/ganache/index.html) website for instruction on how to install and configure Ganache. Expected `chainId` can be found in `.env.example` file. Once you have your RPC server URL and the private key for the account you're going to use to deploy the contracts, update the corresponding env vars (see [Environment Variables](#EnvironmentVariables)).

**Deploy contracts**

```bash
$ npx hardhat run scripts/deploy.ts --network {localhost or ganache}
```

### 2.3. <a name='RemoteNetworkDeployment'></a>Remote Network Deployment

Depending on the network you are deploying to, you have to provide the URL of the RPC server and optionally, the key for etherscan. Supported networks are:

- Ethereum Rinkeby

  **network name**: ethereum-rinkeby

- Ethereum Ropsten

  **network name**: ethereum-ropsten

- Polygon Mainnet

  **network name**: polygon

- Polygon Testnet (Mumbai)

  **network name**: polygon-testnet

You can use any RPC provider, public, private (paid services such as Alchemy or Infura) or even your own.

Once you have the RPC server url and the etherscan key (optional), update the corresponding env vars in `.env` (see [Environment Variables](#EnvironmentVariables)).

**Deploy contracts**

```bash
$ npx hardhat run scripts/deploy.ts --network <target-network>
```

### 2.4. <a name='OptionalVerifyContracts'></a>(Optional) Verify Contracts

> **IMPORTANT:** _\*\_ETHERSCAN_API_KEY_ env var is required for this step.

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan (Rinkeby, Ropsten, Polygon are supported networks).

Copy the deployment address of your contract and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network <contract-network> DEPLOYED_CONTRACT_ADDRESS
```

## 3. <a name='GeneralUsefulCommands'></a>General Useful Commands

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```
