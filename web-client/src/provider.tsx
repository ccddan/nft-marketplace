// import Authereum from "authereum";
// import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import config from "../config";
import { ethers } from "ethers";

export const getProvider = async () => {
  const providerOptions = {
    // TODO: multi wallet support not working in web3modal
    // walletlink: {
    //   package: CoinbaseWalletSDK,
    //   options: {
    //     appName: "Coinbase",
    //     rpc: config.blockchain.network["polygon-testnet"].host,
    //     chainId: config.blockchain.network["polygon-testnet"].chainId,
    //     // rpc: config.blockchain.network["local"].host,
    //     // chainId: config.blockchain.network["local"].chainId,
    //   },
    // },
    // authereum: {
    //   package: Authereum,
    // },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        appName: "WalletConnect",
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
    disableInjectedProvider: false, // if true, wallet(s) do(es) not show up
    providerOptions,
  });
  web3Modal.clearCachedProvider();
  await web3Modal.toggleModal();

  const instance = await web3Modal.connect();
  const library = new ethers.providers.Web3Provider(instance);
  await library.ready;
  const signer = library.getSigner();

  // Subscribe to accounts change
  library.on("accountsChanged", (accounts: string[]) => {
    console.log("accountsChanged:", accounts);
  });

  // Subscribe to chainId change
  library.on("chainChanged", (chainId: number) => {
    console.log("chainChanged:", chainId);
  });

  // Subscribe to library connection
  library.on("connect", (info: { chainId: number }) => {
    console.log(info);
  });

  // Subscribe to session disconnection
  library.on("disconnect", (code: number, reason: string) => {
    console.log("disconnect:", code, reason);
  });

  return { instance, library, signer };
};
