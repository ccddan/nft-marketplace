import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { NextRouter, useRouter } from "next/router";
import { Popover, Transition } from "@headlessui/react";

import { Fragment } from "react";
import Link from "next/link";
import { useAppContext } from "../src/AppContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Create NFTs", href: "/create-nft" },
  { name: "My NFTs", href: "/my-nfts" },
  { name: "Dashboard", href: "/dashboard" },
];

const getNavbarItemStyles = (
  router: NextRouter,
  expectedRoute: string = "/"
): string => {
  return `ml-4 text-pink-500 ${
    router.pathname === expectedRoute ? "font-black" : ""
  }`;
};

export const Navbar = () => {
  const { account, connectingWallet, connectWallet, disconnectWallet } =
    useAppContext();
  const router = useRouter();

  const renderWalletButton = (
    closeFn: Function | null = null,
    styles: string = ""
  ) => {
    if (!account) {
      return (
        <button
          onClick={async () => {
            await connectWallet();
            if (closeFn) closeFn();
          }}
          className={`${styles} ${connectingWallet ? "disabled" : ""}`}
        >
          {connectingWallet ? "Connecting..." : "Connect"}
        </button>
      );
    }
    if (account && !connectingWallet) {
      return (
        <button
          onClick={async () => {
            await disconnectWallet();
            if (closeFn) closeFn();
          }}
          className={styles}
        >
          Disconnect
        </button>
      );
    }
    return "";
  };

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl border-b-2 border-gray-100 pb-0 pt-0">
        <div className="relative z-10 pb-0 bg-white w-full mx-auto">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <Popover>
            <div className="relative pt-0 pb-0 md:mt-5 md:mb-5 px-4 lg:px-8">
              <nav
                className="relative flex items-center justify-between w-full sm:h-10"
                aria-label="Global"
              >
                <div className="md:basis-2/6 justify-between w-full">
                  <div className="flex items-center justify-between w-full">
                    <a href="#" className="flex items-center">
                      <span className="sr-only">Logo</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-9 w-9 text-pink-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="items-center text-left pl-[10px] font-black text-pink-500 hidden md:block">
                        NFT Marketplace
                      </p>
                    </a>
                    <div className="grow items-center text-left pl-[10px] font-black text-pink-500 md:hidden">
                      <p>NFT Marketplace</p>
                    </div>
                    <div className="-mr-2 flex items-right md:hidden">
                      <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500">
                        <span className="sr-only">Open menu</span>
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                </div>
                <div
                  className="hidden md:block flex basis-4/6 items-left justify-start text-xl lg:w-0"
                  // className="hidden md:block md:ml-10 md:pr-4 md:space-x-8"
                >
                  {navigation.map((item) => (
                    <Link href={item.href} key={item.name}>
                      <a className={getNavbarItemStyles(router, item.href)}>
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>
                <div className="flex hidden md:block basis-1/6 items-end justify-end lg:w-0">
                  <div className="flex items-right justify-between w-auto md:w-auto">
                    {renderWalletButton(
                      null,
                      "bg-pink-500 shadow-lg shadow-pink-500/50 text-white font-bold py-2 px-4 rounded hover:bg-pink-700 float-right"
                    )}
                  </div>
                </div>
              </nav>
            </div>

            <Transition
              as={Fragment}
              enter="duration-150 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Popover.Panel
                focus
                className="fixed z-1000000 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
              >
                {(props: any) => (
                  <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="px-5 pt-4 flex items-center justify-between">
                      <div className="w-full"></div>
                      <div className="-mr-2">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                          <span className="sr-only">Close menu</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                      {navigation.map((item) => (
                        <Link href={item.href} key={item.name}>
                          <a
                            className={`block px-3 py-2 rounded-md ${getNavbarItemStyles(
                              router,
                              item.href
                            )}`}
                          >
                            <Popover.Button
                              onClick={() => {
                                console.log("Closing menu from ", item.name);
                                props.close();
                              }}
                            >
                              {item.name}
                            </Popover.Button>
                          </a>
                        </Link>
                      ))}
                    </div>
                    <div className="block w-full p-0 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100">
                      {!account ? (
                        <button
                          onClick={async () => {
                            await connectWallet();
                            props.close();
                          }}
                          className={`w-full h-full bg-pink-500 hover:bg-pink-700 shadow-lg shadow-pink-500/50 text-white font-bold py-2 px-4 rounded-b-lg ${
                            connectingWallet ? "disabled" : ""
                          }`}
                        >
                          {connectingWallet ? "Connecting..." : "Connect"}
                        </button>
                      ) : (
                        ""
                      )}
                      {account && !connectingWallet ? (
                        <button
                          onClick={async () => {
                            await disconnectWallet();
                            props.close();
                          }}
                          className="w-full h-full bg-pink-500 hover:bg-pink-700 shadow-lg shadow-pink-500/50 text-white font-bold py-2 px-4 rounded-b-lg"
                        >
                          Disconnect
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
