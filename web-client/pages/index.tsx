import { useEffect, useState } from "react";

import Link from "next/link";
import NFTMarketplaceInfo from "../../smart-contracts/artifacts/contracts/NFTMarket.sol/NFTMarket.info.json";
import NFTMarketplaceSpecs from "../../smart-contracts/artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import type { NextPage } from "next";
import axios from "axios";
import { ethers } from "ethers";
import { getProvider } from "../src/provider";

export const Home: NextPage = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = await getProvider();
    const contract = new ethers.Contract(
      NFTMarketplaceInfo.addr,
      NFTMarketplaceSpecs.abi,
      provider
    );
    const data = await contract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items: any[] = await Promise.all(
      data.map(async (i: any) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  async function buyNft(nft: any) {
    const provider = await getProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      NFTMarketplaceInfo.addr,
      NFTMarketplaceSpecs.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-15 sm:px-6 lg:max-w-7xl lg:px-8">
        {loadingState === "loaded" && !nfts.length ? (
          <div className="relative p-8 text-center border border-gray-200 rounded-lg">
            <h2 className="text-2xl font-medium">Nothing for sale...</h2>

            <p className="mt-4 text-sm text-white-500">
              You can create and sell your own NFTs!
            </p>

            <Link href="/create-nft">
              <a
                href="#"
                className="inline-flex items-center px-5 py-3 mt-8 font-medium text-white bg-pink-500 hover:bg-pink-700 rounded-lg"
              >
                Create NFTs
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
              For Sale
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-2 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4">
              {nfts.map((nft) => (
                <div
                  key={nft.tokenId}
                  className="relative border p-3 hover:shadow-lg hover:shadow-pink-300/50"
                >
                  <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden lg:h-80 lg:aspect-none">
                    <a href={nft.image}>
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-center object-cover lg:w-full lg:h-full hover:opacity-75 hover:scale-125 duration-700"
                      />
                    </a>
                  </div>
                  <div className="mt-4 flex justify-between p-3">
                    <div className="overflow-hidden">
                      <div className="uppercase truncate">
                        <h3 className="text-sm text-gray-700 truncate">
                          {nft.name}
                        </h3>
                      </div>
                      <div className="w-full max-h-20 min-h-20 h-20 overflow-auto">
                        <p className="mt-1 text-sm text-gray-500 text-truncate">
                          {nft.description}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-8">
                        <i>Price:</i> {nft.price} ETH
                      </p>
                    </div>
                  </div>
                  <div className="mt-0 flex items-end">
                    <button
                      className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full"
                      onClick={() => buyNft(nft)}
                    >
                      Buy
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
};

export default Home;
