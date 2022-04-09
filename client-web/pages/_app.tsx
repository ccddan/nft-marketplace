import "../styles/globals.css";

import type { AppProps } from "next/app";
import Link from "next/link";

export const App = ({ Component, pageProps }: AppProps) => {
  const connectBtnOnClickHandler = async () => {
    console.log("connecting...");
function MyApp({ Component, pageProps }: AppProps) {
    console.log("connected!!");
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
            <a className="mr-4 text-pink-500">Home</a>
          </Link>
          <Link href="/create-nft">
            <a className="mr-6 text-pink-500">Sell NFT</a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6 text-pink-500">My NFTs</a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6 text-pink-500">Dashboard</a>
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
