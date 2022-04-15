import { NextRouter, useRouter } from "next/router";

import Link from "next/link";
import { useAppContext } from "../AppContext";

const getNavbarItemStyles = (
  router: NextRouter,
  expectedRoute: string = "/"
): string => {
  return `mr-4 text-pink-500 ${
    router.pathname === expectedRoute ? "font-black" : ""
  }`;
};

export const Navbar = () => {
  const { account, connectingWallet, connectWallet } = useAppContext();
  const router = useRouter();

  return (
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
          <a className={getNavbarItemStyles(router, "/create-nft")}>Sell NFT</a>
        </Link>
        <Link href="/my-nfts">
          <a className={getNavbarItemStyles(router, "/my-nfts")}>My NFTs</a>
        </Link>
        <Link href="/dashboard">
          <a className={getNavbarItemStyles(router, "/dashboard")}>Dashboard</a>
        </Link>
      </div>
      <div className="flex grow-0 basis-1/6 items-end justify-end lg:w-0">
        {connectingWallet ? (
          <p>
            <b>Connecting...</b>
          </p>
        ) : (
          ""
        )}
        {!account && !connectingWallet ? (
          <button
            onClick={async () => await connectWallet()}
            className="bg-pink-500 hover:bg-pink-700 shadow-lg shadow-pink-500/50 text-white font-bold py-2 px-4 rounded"
          >
            Connect
          </button>
        ) : (
          ""
        )}
        {account && !connectingWallet ? (
          <p>
            <b>Connected!</b>
          </p>
        ) : (
          ""
        )}
      </div>
    </nav>
  );
};

export default Navbar;
