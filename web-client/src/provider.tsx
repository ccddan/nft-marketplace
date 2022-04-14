import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import config from "../config";
import { ethers } from "ethers";

export const getProvider = async () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        networkParams: {
          // ...config.blockchain.network["polygon-testnet"],
          ...config.blockchain.network["local"],
        },
        config: {
          buildEnv: config.blockchain.mode,
        },
      },
    },
  };
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions,
  });
  const connection = await web3Modal.connect();

  const provider = new ethers.providers.Web3Provider(connection);
  await provider.ready;

  provider.on("accountsChanged", (accounts: string[]) => {
    console.log("accountsChanged:", accounts);
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId: number) => {
    console.log("chainChanged:", chainId);
  });

  // Subscribe to session disconnection
  provider.on("disconnect", (code: number, reason: string) => {
    console.log("disconnect:", code, reason);
  });

  await web3Modal.toggleModal();

  return provider;
};
