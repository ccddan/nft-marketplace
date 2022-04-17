import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import { ethers } from "ethers";
import { getProvider } from "./provider";

// Context
export type AppContextProps = {
  // state
  account: string;
  accountBalance: ethers.BigNumber;
  library: ethers.providers.Web3Provider | undefined;
  signer: ethers.providers.JsonRpcSigner | undefined;

  // handlers
  connectWallet: () => Promise<any>;

  // loaders
  connectingWallet: boolean;
  transactionInProgress: boolean;

  // Errors
  error: {
    msg: string | undefined | null;
    setError: (_: string | undefined | null) => void;
  };
};

const AppContextInitialValue: AppContextProps = {
  account: "",
  accountBalance: ethers.BigNumber.from(0),
  library: undefined,
  signer: undefined,
  connectWallet: async () => {},
  connectingWallet: false,
  transactionInProgress: false,
  error: {
    msg: null,
    setError: (_: string | undefined | null) => {},
  },
};
export const AppContext = createContext<AppContextProps>(
  AppContextInitialValue
);
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};

// Provider
const createConnectWalletFn = (
  setAccountFn: Dispatch<SetStateAction<string>>,
  setAccountBalanceFn: Dispatch<SetStateAction<ethers.BigNumber>>,
  setLibraryFn: Dispatch<
    SetStateAction<ethers.providers.Web3Provider | undefined>
  >,
  setSignerFn: Dispatch<
    SetStateAction<ethers.providers.JsonRpcSigner | undefined>
  >,
  setLoaderFn: Dispatch<SetStateAction<boolean>>,
  setErrorFn: Dispatch<SetStateAction<string | undefined | null>>
) => {
  return async () => {
    setLoaderFn(true);
    try {
      let { library, signer } = await getProvider();
      const accounts = await library.listAccounts();
      const balance = await library.getBalance(accounts[0]);
      setAccountFn(accounts[0]);
      setAccountBalanceFn(balance);
      setLibraryFn(library);
      setSignerFn(signer);
    } catch (ex) {
      const error: any = ex;
      console.error("Wallet connection failed:", error);
      setErrorFn(`${error.message}. Try again.`);
    }
    setLoaderFn(false);
  };
};

export type AppProviderProps = {
  children: ReactNode;
};
export const AppProvider = (props: AppProviderProps) => {
  const [errorMsg, setError] = useState<string | undefined | null>(null);
  const [account, setAccount] = useState(AppContextInitialValue.account);
  const [accountBalance, setAccountBalance] = useState(
    AppContextInitialValue.accountBalance
  );
  const [library, setLibrary] = useState(AppContextInitialValue.library);
  const [signer, setSigner] = useState(AppContextInitialValue.signer);

  const [connectingWallet, setConnectingWallet] = useState(
    AppContextInitialValue.connectingWallet
  );
  const [transactionInProgress, setTransactionInProgress] = useState(
    AppContextInitialValue.transactionInProgress
  );

  return (
    <AppContext.Provider
      value={{
        account,
        accountBalance,
        library,
        signer,
        connectWallet: createConnectWalletFn(
          setAccount,
          setAccountBalance,
          setLibrary,
          setSigner,
          setConnectingWallet,
          setError
        ),
        connectingWallet,
        transactionInProgress,
        error: {
          msg: errorMsg,
          setError,
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
