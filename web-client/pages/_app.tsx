import "../styles/globals.css";

import { NextRouter, useRouter } from "next/router";

import type { AppProps } from "next/app";
import Link from "next/link";
import { getProvider } from "../src/provider";

const getNavbarItemStyles = (
  router: NextRouter,
  expectedRoute: string = "/"
): string => {
  return `mr-4 text-pink-500 ${
    router.pathname === expectedRoute ? "font-black" : ""
  }`;
};

export const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const connectBtnOnClickHandler = async () => {
    console.log("connecting...");
    const { library } = await getProvider();

    const accounts = await library.listAccounts();
    console.log("listAccounts:", accounts);
    console.log("getNetwork:", await library.getNetwork());
    console.log("getBalance:", await library.getBalance(accounts[0]));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <nav className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10 xs:flex-col">
        <div className="basis-2/6 justify-start xs:display-block">
          <a href="#" className="flex justify-start">
            <img
              className="h-8 w-auto sm:h-10"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="NFT Marketplace"
            />
            <h1 className="my-auto font-bold text-2xl ml-2">NFT Marketplace</h1>
          </a>
        </div>
        <div className="flex basis-3/6 items-center justify-center text-xl lg:w-0 xs:display-none">
          <Link href="/">
            <a className={getNavbarItemStyles(router)}>Home</a>
          </Link>
          <Link href="/create-nft">
            <a className={getNavbarItemStyles(router, "/create-nft")}>
              Sell NFT
            </a>
          </Link>
          <Link href="/my-nfts">
            <a className={getNavbarItemStyles(router, "/my-nfts")}>My NFTs</a>
          </Link>
          <Link href="/dashboard">
            <a className={getNavbarItemStyles(router, "/dashboard")}>
              Dashboard
            </a>
          </Link>
        </div>
        <div className="flex grow-0 basis-1/6 items-end justify-end lg:w-0">
          <button
            onClick={async () => await connectBtnOnClickHandler()}
            className="bg-pink-500 hover:bg-pink-700 shadow-lg shadow-pink-500/50 text-white font-bold py-2 px-4 rounded"
          >
            Connect
          </button>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
};

export default App;
