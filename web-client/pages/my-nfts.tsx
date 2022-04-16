import { useEffect, useState } from "react";

import Link from "next/link";
import NFTMarketplaceInfo from "../../smart-contracts/artifacts/contracts/NFTMarket.sol/NFTMarket.info.json";
import NFTMarketplaceSpec from "../../smart-contracts/artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import axios from "axios";
import { ethers } from "ethers";
import { useAppContext } from "../src/AppContext";
import { useRouter } from "next/router";

export default function MyAssets() {
  const { signer } = useAppContext();

  const [nfts, setNfts] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  useEffect(() => {
    if (signer) loadNFTs();
  }, [signer]);

  async function loadNFTs() {
    const marketplaceContract = new ethers.Contract(
      NFTMarketplaceInfo.addr,
      NFTMarketplaceSpec.abi,
      signer
    );
    const data = await marketplaceContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i: any) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  function listNFT(nft: any) {
    router.push(
      `/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}&boughtPrice=${nft.price}`
    );
  }
  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto px-4 py-2 sm:py-0 sm:px-4 lg:max-w-7xl lg:px-8">
        {loadingState === "loaded" && !nfts.length ? (
          <div className="relative p-8 text-center border border-gray-200 rounded-lg">
            <h2 className="text-2xl font-medium">You do not own any NFT...</h2>

            <p className="mt-4 text-sm text-white-500">
              Take a look at the NFTs in the Marketplace!
            </p>

            <Link href="/">
              <a
                href="#"
                className="inline-flex items-center px-5 py-3 mt-8 font-medium text-white bg-pink-500 hover:bg-pink-700 rounded-lg"
              >
                Buy NFTs
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="flex-shrink-0 w-4 h-4 ml-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              My NFTs
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-2 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4">
              {nfts.map((nft, i) => (
                <div
                  key={nft.tokenId}
                  className="relative border p-3 hover:shadow-lg hover:shadow-gray-300/50"
                >
                  <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-t-lg overflow-hidden lg:h-80 lg:aspect-none">
                    <a href={nft.image}>
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-center object-cover lg:w-full lg:h-full hover:opacity-75 hover:scale-125 duration-700"
                      />
                    </a>
                  </div>
                  <div className="p-4 bg-black rounded-b-lg">
                    <p className="text-2xl font-bold text-white">
                      Price - {nft.price} Eth
                    </p>
                    <button
                      className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                      onClick={() => listNFT(nft)}
                    >
                      Sell
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
